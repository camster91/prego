import { describe, it, expect } from 'vitest';
import { replaceDataRecords, recoverDataTransaction, transactionKey, dataKeys, type TransactionStorage } from '../lib/storageTransaction';
function fixture() {
  const records = new Map<string, string>();
  let writes = 0;
  let failAt = Infinity;
  let permanent = false;
  const storage: TransactionStorage = {
    get: async key => records.get(key) ?? null,
    set: async (key, value) => {
      if (++writes === failAt || permanent) throw new Error('Disk full');
      records.set(key, value);
    },
    remove: async key => {
      if (++writes === failAt || permanent) throw new Error('Disk unavailable');
      records.delete(key);
    },
  };
  return { records, storage, fail: (at: number) => { writes = 0; failAt = at; }, lock: () => { permanent = true; }, unlock: () => { permanent = false; failAt = Infinity; } };
}
const profile = (name: string) => JSON.stringify({ version: 1, state: { profile: null, isOnboarded: false, fixture: name } });
const values = (name: string) => ({ 'prego-user-storage': profile(name), 'prego-workout-session-storage': null, 'prego-active-timer': null });
describe('recoverable data transactions', () => {
  it('replaces all records and mirrors, clears the timer and removes the journal', async () => {
    const f = fixture();
    f.records.set('prego-active-timer', '{"remaining":20}');
    await replaceDataRecords(values('new'), f.storage);
    expect(f.records.get('prego-user-storage')).toBe(profile('new'));
    expect(f.records.get('prego-user-storage::shadow')).toBe(profile('new'));
    expect(f.records.has('prego-active-timer')).toBe(false);
    expect(f.records.has(transactionKey)).toBe(false);
  });
  for (const at of [1, 2, 3, 4, 5, 6, 7, 8]) {
    it(`preserves previous records when write ${at} fails`, async () => {
      const f = fixture();
      f.records.set('prego-user-storage', profile('previous'));
      f.records.set('prego-user-storage::shadow', profile('previous'));
      f.fail(at);
      await expect(replaceDataRecords(values('new'), f.storage)).rejects.toThrow();
      expect(f.records.get('prego-user-storage')).toBe(profile('previous'));
      expect(f.records.get('prego-user-storage::shadow')).toBe(profile('previous'));
    });
  }
  it('recovers prepared writes after app termination and is idempotent', async () => {
    const f = fixture();
    const before: Record<string, string | null> = Object.fromEntries(dataKeys.flatMap(key => [[key, null], [`${key}::shadow`, null]]));
    before['prego-user-storage'] = profile('previous');
    const after = { ...before, 'prego-user-storage': profile('new') };
    f.records.set(transactionKey, JSON.stringify({ version: 1, phase: 'prepared', before, after }));
    f.records.set('prego-user-storage', profile('new'));
    expect(await recoverDataTransaction(f.storage)).toBe(true);
    expect(f.records.get('prego-user-storage')).toBe(profile('previous'));
    expect(await recoverDataTransaction(f.storage)).toBe(false);
  });
  it('retains a journal while the device is locked then rolls committed deletion forward', async () => {
    const f = fixture();
    const before: Record<string, string | null> = Object.fromEntries(dataKeys.flatMap(key => [[key, null], [`${key}::shadow`, null]]));
    before['prego-user-storage'] = profile('previous');
    const after = Object.fromEntries(Object.keys(before).map(key => [key, null]));
    f.records.set('prego-user-storage', profile('previous'));
    f.records.set(transactionKey, JSON.stringify({ version: 1, phase: 'committed', before, after }));
    f.lock();
    await expect(recoverDataTransaction(f.storage)).rejects.toThrow();
    expect(f.records.has(transactionKey)).toBe(true);
    f.unlock();
    await recoverDataTransaction(f.storage);
    expect(f.records.size).toBe(0);
  });
  it('rejects a journal with unexpected keys without deleting data', async () => {
    const f = fixture();
    f.records.set(transactionKey, JSON.stringify({ version: 1, phase: 'prepared', before: {}, after: { unknown: null } }));
    await expect(recoverDataTransaction(f.storage)).rejects.toThrow('Invalid');
    expect(f.records.has(transactionKey)).toBe(true);
  });
});
