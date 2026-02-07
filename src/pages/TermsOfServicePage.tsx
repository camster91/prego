import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { PageLayout } from '../shared/components/layout/PageLayout';
import { Button } from '../shared/components/ui/Button';

function TermsOfServicePage() {
  const navigate = useNavigate();

  return (
    <PageLayout title="Terms of Service">
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
          Please read these Terms of Service ("Terms") carefully before using
          Prego ("the app"). By using Prego, you agree to be bound by these
          Terms.
        </p>

        <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">
          1. Informational Purposes Only
        </h2>
        <p className="text-gray-700 mb-4">
          Prego is designed for informational and educational purposes only. The
          exercise routines, guidance, and content provided in this app do not
          constitute medical advice, diagnosis, or treatment. The app is not a
          substitute for professional medical advice from a qualified healthcare
          provider.
        </p>

        <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">
          2. Consult Your Healthcare Provider
        </h2>
        <p className="text-gray-700 mb-4">
          You must consult with your doctor, midwife, or other qualified
          healthcare provider before beginning any exercise program during
          pregnancy. This is especially important if you have any pre-existing
          medical conditions, pregnancy complications, or have been advised to
          limit physical activity. Always obtain medical clearance before
          following any exercise routine provided by this app.
        </p>

        <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">
          3. No Warranty or Liability
        </h2>
        <p className="text-gray-700 mb-4">
          The app and all content, exercises, and guidance are provided "as is"
          and "as available" without warranties of any kind, whether express or
          implied. We do not warrant that the exercise guidance is suitable for
          your individual circumstances, health condition, or stage of
          pregnancy. To the fullest extent permitted by applicable law, we
          disclaim all liability for any injury, harm, loss, or damage arising
          from your use of the app or reliance on its content, including but not
          limited to physical injury resulting from performing exercises shown in
          the app.
        </p>

        <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">
          4. User Responsibility
        </h2>
        <p className="text-gray-700 mb-4">
          You are solely responsible for your own health and safety decisions.
          You agree to:
        </p>
        <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
          <li>
            Stop exercising immediately if you experience pain, dizziness,
            shortness of breath, bleeding, or any other concerning symptoms.
          </li>
          <li>
            Follow your healthcare provider's advice over any guidance provided
            by this app.
          </li>
          <li>
            Use your own judgment regarding the appropriateness and safety of
            any exercise for your individual situation.
          </li>
          <li>
            Not rely on this app as a substitute for professional prenatal care.
          </li>
        </ul>

        <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">
          5. Third-Party Content
        </h2>
        <p className="text-gray-700 mb-4">
          The app may include embedded content from third parties, such as
          YouTube videos. We are not responsible for the accuracy, availability,
          or content of third-party materials. Your interaction with third-party
          content is governed by those parties' respective terms and policies.
        </p>

        <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">
          6. Intellectual Property
        </h2>
        <p className="text-gray-700 mb-4">
          All content, design, and functionality of Prego are the property of
          the app's creators and are protected by applicable intellectual
          property laws. You may not reproduce, distribute, or create derivative
          works from the app without prior written permission.
        </p>

        <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">
          7. Changes to These Terms
        </h2>
        <p className="text-gray-700 mb-4">
          We reserve the right to modify these Terms at any time. Changes will
          be posted on this page with an updated revision date. Your continued
          use of the app after changes are posted constitutes acceptance of the
          revised Terms.
        </p>

        <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">
          8. Governing Law
        </h2>
        <p className="text-gray-700 mb-4">
          These Terms shall be governed by and construed in accordance with
          applicable law, without regard to conflict of law principles.
        </p>

        <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">
          9. Contact
        </h2>
        <p className="text-gray-700 mb-4">
          If you have questions about these Terms of Service, please reach out
          through the app's support channels.
        </p>
      </div>
    </PageLayout>
  );
}

export { TermsOfServicePage };
