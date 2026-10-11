import { PageLayout } from "../shared/components/layout/PageLayout";
export function PrivacyPolicyPage() {
  return (
    <PageLayout title="Your privacy">
      <p className="mb-6 text-sm text-gray-600">
        Implementation disclosure · Updated October 11, 2026 · Legal and store
        review pending
      </p>
      <div className="space-y-6 text-gray-700">
        <section>
          <h2 className="mb-2 text-lg font-semibold">
            Profile and workout records
          </h2>
          <p>
            Your name, due date, preferences and workout history are stored in
            the iOS system keychain or encrypted Android device storage, and
            unencrypted browser storage on the web. Native keychain records are
            restricted to this device and iCloud sync is disabled. On iOS,
            keychain records may remain after uninstall; use Delete data before
            uninstalling if you want them removed. Clearing browser storage or
            losing access to a device can remove your records. The app does not
            send these fields to a billing service.
          </p>
        </section>
        <section>
          <h2 className="mb-2 text-lg font-semibold">
            Purchases and external services
          </h2>
          <p>
            When native billing is configured, RevenueCat and Apple or Google
            process purchase records and an anonymous billing identifier to
            check access and restore purchases. Website hosting receives normal
            network requests. Opening linked sources or optional third-party
            video embeds contacts those services under their privacy policies.
            Custom decorative media is bundled locally.
          </p>
        </section>
        <section>
          <h2 className="mb-2 text-lg font-semibold">
            Export, restore and deletion
          </h2>
          <p>
            You can export a private backup, replace local records from a
            supported backup, or delete profile, workout history and active
            timer data in You. Exported copies outside the app remain under your
            control. Deleting local app data does not cancel or erase an
            app-store purchase or delete records held by billing providers.
            Provider deletion/support handling must be finalised before release.
          </p>
        </section>
        <section>
          <h2 className="mb-2 text-lg font-semibold">Analytics and support</h2>
          <p>
            This build has no configured advertising or third-party usage
            analytics. No pregnancy details should be included in diagnostic
            events. Public support ownership, retention terms and store privacy
            declarations are release requirements.
          </p>
        </section>
      </div>
    </PageLayout>
  );
}
