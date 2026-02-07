import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { PageLayout } from '../shared/components/layout/PageLayout';
import { Button } from '../shared/components/ui/Button';

function PrivacyPolicyPage() {
  const navigate = useNavigate();

  return (
    <PageLayout title="Privacy Policy">
      <div className="mb-4">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </div>

      <div className="prose prose-gray max-w-none">
        <p className="text-sm text-gray-500 mb-6">
          Last updated: February 2026
        </p>

        <p className="text-gray-700 mb-6">
          Prego ("we", "our", or "the app") is a pregnancy exercise companion
          designed to support your fitness journey during pregnancy. We are
          committed to protecting your privacy. This Privacy Policy explains how
          the app handles your information.
        </p>

        <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">
          1. Data Storage
        </h2>
        <p className="text-gray-700 mb-4">
          All data you enter into Prego -- including your due date, exercise
          preferences, workout history, and progress -- is stored exclusively on
          your device using your browser's localStorage. We do not operate any
          servers that collect, store, or process your personal information. Your
          data never leaves your device unless you choose to clear it.
        </p>

        <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">
          2. No Personal Health Data Transmission
        </h2>
        <p className="text-gray-700 mb-4">
          Prego does not transmit any personal health data, pregnancy
          information, or exercise activity to any external server, API, or
          third party. All health-related data remains entirely on your local
          device.
        </p>

        <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">
          3. No Third-Party Analytics
        </h2>
        <p className="text-gray-700 mb-4">
          We do not use any third-party analytics services, tracking pixels,
          advertising SDKs, or similar technologies. We do not collect usage
          statistics, crash reports, or behavioral data.
        </p>

        <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">
          4. Third-Party Content: YouTube
        </h2>
        <p className="text-gray-700 mb-4">
          Prego may embed exercise demonstration videos from YouTube. When you
          view these embedded videos, YouTube (operated by Google) may collect
          information in accordance with its own privacy policy, including
          cookies, IP address, and viewing activity. We encourage you to review{' '}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 underline hover:text-primary-700"
          >
            Google's Privacy Policy
          </a>{' '}
          for details on how YouTube handles your data. We do not control and
          are not responsible for YouTube's data practices.
        </p>

        <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">
          5. Data Deletion
        </h2>
        <p className="text-gray-700 mb-4">
          You can delete all data stored by Prego at any time by using the
          "Reset App" feature in the Settings page. This will permanently remove
          all locally stored data, including your profile, preferences, and
          workout history. Alternatively, you can clear your browser's
          localStorage for this site through your browser settings.
        </p>

        <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">
          6. Children's Privacy
        </h2>
        <p className="text-gray-700 mb-4">
          Prego is intended for use by adults. We do not knowingly collect
          information from anyone under the age of 13.
        </p>

        <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">
          7. Changes to This Policy
        </h2>
        <p className="text-gray-700 mb-4">
          We may update this Privacy Policy from time to time. Any changes will
          be reflected on this page with an updated revision date. Continued use
          of the app after changes constitutes acceptance of the revised policy.
        </p>

        <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">
          8. Contact
        </h2>
        <p className="text-gray-700 mb-4">
          If you have questions about this Privacy Policy, please reach out
          through the app's support channels.
        </p>
      </div>
    </PageLayout>
  );
}

export { PrivacyPolicyPage };
