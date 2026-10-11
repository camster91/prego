import { useState } from "react";
import {
  exportBackup,
  parseBackup,
  restoreBackup,
  type Backup,
} from "../lib/dataControls";
import { Button } from "../shared/components/ui/Button";
import { Modal } from "../shared/components/ui/Modal";
export function DataControls() {
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState<Backup | null>(null);
  const [busy, setBusy] = useState(false);
  return (
    <section className="mb-6 rounded-2xl border border-sage-200 bg-white p-5">
      <h2 className="text-lg font-semibold text-primary-900">
        Your data, your choice
      </h2>
      <p className="my-3 text-sm text-gray-600">
        Save a backup before changing devices. Exported files contain private
        profile and workout information. Keep them somewhere secure.
      </p>
      <div className="flex flex-wrap gap-3">
        <Button
          variant="outline"
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            try {
              await exportBackup();
              setMessage("Backup prepared. Keep your saved copy private.");
            } catch {
              setMessage(
                "Backup could not be exported. Your data has not changed.",
              );
            } finally {
              setBusy(false);
            }
          }}
        >
          Export data
        </Button>
        <label className="inline-flex min-h-12 cursor-pointer items-center rounded-xl bg-sage-100 px-4 font-medium text-primary-800">
          Restore backup
          <input
            className="sr-only"
            type="file"
            accept="application/json,.json"
            disabled={busy}
            onChange={async (event) => {
              const file = event.target.files?.[0];
              event.target.value = "";
              if (!file) return;
              try {
                if (file.size > 5_000_000)
                  throw new Error("Backup is too large.");
                setPending(parseBackup(await file.text()));
              } catch (error) {
                setMessage(
                  error instanceof Error
                    ? error.message
                    : "Unable to read backup.",
                );
              }
            }}
          />
        </label>
      </div>
      <p role="status" className="mt-3 text-sm text-gray-600">
        {message}
      </p>
      <Modal
        isOpen={!!pending}
        onClose={() => setPending(null)}
        title="Replace your local data?"
      >
        <p className="mb-5 text-gray-700">
          This replaces your profile and history with{" "}
          {pending?.completedSessions.length ?? 0} saved sessions. Export your
          current data first if you want to keep it.
        </p>
        <Button
          disabled={busy}
          onClick={async () => {
            if (!pending) return;
            setBusy(true);
            try {
              await restoreBackup(pending);
              setPending(null);
              setMessage("Backup restored.");
            } catch {
              setMessage(
                "Restoration could not finish. Keep your backup and try again.",
              );
            } finally {
              setBusy(false);
            }
          }}
        >
          Restore this backup
        </Button>
      </Modal>
    </section>
  );
}
