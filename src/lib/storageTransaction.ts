import { transactionStorage, validateStoredRecord, storageHealth } from './storage';

export const transactionKey = 'prego-data-transaction';
export const dataKeys = ['prego-user-storage', 'prego-workout-session-storage', 'prego-active-timer'] as const;
const recordKeys = dataKeys.flatMap(key => [key, `${key}::shadow`]);
export interface TransactionStorage {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
  remove(key: string): Promise<void>;
}
interface Journal {
  version: 1;
  phase: 'prepared' | 'committed';
  before: Record<string, string | null>;
  after: Record<string, string | null>;
}
function parseJournal(text: string): Journal {
  const value = JSON.parse(text) as Journal;
  if (value.version !== 1 || !['prepared', 'committed'].includes(value.phase))
    throw new Error('Unsupported recovery record');
  for (const records of [value.before, value.after]) {
    if (!records || Object.keys(records).length !== recordKeys.length ||
      recordKeys.some(key => !(key in records) || (records[key] !== null && typeof records[key] !== 'string')))
      throw new Error('Invalid recovery record');
  }
  for (const key of recordKeys) {
    const next = value.after[key];
    if (next !== null) validateStoredRecord(key.replace(/::shadow$/, ''), next);
  }
  return value;
}
async function apply(records: Journal['before'], storage: TransactionStorage) {
  for (const key of recordKeys) {
    if (records[key] === null) await storage.remove(key);
    else await storage.set(key, records[key]);
  }
}
export async function recoverDataTransaction(storage: TransactionStorage = transactionStorage) {
  const text = await storage.get(transactionKey);
  if (text === null) return false;
  const journal = parseJournal(text);
  // Prepared operations roll back; a verified committed operation rolls forward.
  // Retain the journal if any recovery write fails so the next launch retries.
  await apply(journal.phase === 'committed' ? journal.after : journal.before, storage);
  await storage.remove(transactionKey);
  storageHealth.report('Recovered an interrupted data change. Your saved data is ready.');
  return true;
}
let active = false;
export async function replaceDataRecords(
  values: Record<typeof dataKeys[number], string | null>,
  storage: TransactionStorage = transactionStorage,
) {
  if (active) throw new Error('Another data change is in progress.');
  active = true;
  try {
    await recoverDataTransaction(storage);
    const before: Journal['before'] = {};
    const after: Journal['after'] = {};
    for (const key of dataKeys) {
      if (values[key] !== null) validateStoredRecord(key, values[key]);
      for (const recordKey of [key, `${key}::shadow`]) {
        before[recordKey] = await storage.get(recordKey);
        after[recordKey] = values[key];
      }
    }
    const journal: Journal = { version: 1, phase: 'prepared', before, after };
    await storage.set(transactionKey, JSON.stringify(journal));
    try {
      await apply(after, storage);
      await storage.set(transactionKey, JSON.stringify({ ...journal, phase: 'committed' }));
    } catch {
      try {
        await apply(before, storage);
        await storage.remove(transactionKey);
      } catch {
        storageHealth.report('A data change was interrupted. Keep your backup. Restart Prego to recover the saved copy.');
        throw new Error('Recovery is pending. Restart Prego before making further changes.');
      }
      throw new Error('The data change failed. Your previous records were restored.');
    }
    try { await storage.remove(transactionKey); }
    catch { storageHealth.report('Data saved. Recovery cleanup will finish on your next launch.'); }
  } finally { active = false; }
}
