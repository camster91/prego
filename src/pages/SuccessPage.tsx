import { Link } from "react-router-dom";
import { PageLayout } from "../shared/components/layout/PageLayout";
export function SuccessPage() {
  return (
    <PageLayout title="Check your purchase">
      <p className="mb-5 text-gray-700">
        A checkout link does not confirm access. Open Prego on your iPhone or
        Android device and use Restore purchases to check your store
        entitlement.
      </p>
      <Link
        className="inline-flex min-h-12 items-center text-primary-800 underline"
        to="/pricing"
      >
        View purchase options
      </Link>
    </PageLayout>
  );
}
