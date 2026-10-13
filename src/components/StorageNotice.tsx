import { useSyncExternalStore } from "react";
import { storageHealth } from "../lib/storage";
export function StorageNotice() {
  const message = useSyncExternalStore(
    storageHealth.subscribe,
    storageHealth.getSnapshot,
  );
  return message ? (
    <div
      role="alert"
      className="mx-auto max-w-5xl border border-amber-300 bg-amber-50 p-4 text-amber-950"
    >
      {message}
    </div>
  ) : null;
}
