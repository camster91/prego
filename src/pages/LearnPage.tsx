import { BookOpen, ArrowUpRight, ShieldCheck } from "lucide-react";
import { PageLayout } from "../shared/components/layout/PageLayout";
const resources = [
  {
    title: "Canadian pregnancy activity guideline",
    publisher: "Canadian Society for Exercise Physiology",
    href: "https://csep.ca/2018/10/18/2019-canadian-guideline-for-physical-activity-throughout-pregnancy/",
  },
  {
    title: "Get Active Questionnaire for Pregnancy",
    publisher: "CSEP · Original resource",
    href: "https://csep.ca/2021/05/27/get-active-questionnaire-for-pregnancy/",
  },
];
export function LearnPage() {
  return (
    <PageLayout
      title="A little knowledge. More confidence."
      subtitle="Understand the app. Find trusted sources."
    >
      <section id="safety" className="scroll-mt-24 rounded-2xl bg-sage-100 p-6">
        <ShieldCheck
          className="mb-3 h-7 w-7 text-primary-800"
          aria-hidden="true"
        />
        <h2 className="text-xl font-semibold text-primary-900">
          Safety & care
        </h2>
        <p className="mt-3 leading-relaxed text-gray-700">
          Prego does not assess medical clearance or diagnose symptoms. If you
          feel unwell, stop the session and contact your healthcare
          professional. In an emergency, contact local emergency services. Do
          not wait for the app to respond.
        </p>
        <p className="mt-3 text-sm text-gray-600">
          Region-specific warning-sign guidance and screening are awaiting
          qualified review. Guided sessions remain unavailable until that review
          is complete.
        </p>
      </section>
      <section className="mt-8">
        <h2 className="mb-4 text-xl font-semibold text-primary-900">
          Start with the original sources
        </h2>
        {resources.map((resource) => (
          <a
            key={resource.href}
            href={resource.href}
            target="_blank"
            rel="noopener noreferrer"
            className="mb-3 flex min-h-24 items-center gap-4 rounded-xl border border-sage-200 bg-white p-5"
          >
            <BookOpen
              className="h-6 w-6 shrink-0 text-primary-700"
              aria-hidden="true"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-primary-900">
                {resource.title}
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                {resource.publisher} · Opens an external website
              </p>
            </div>
            <ArrowUpRight className="h-5 w-5 shrink-0" aria-hidden="true" />
          </a>
        ))}
      </section>
      <section className="mt-8 rounded-2xl border border-sage-200 p-6">
        <h2 className="text-xl font-semibold text-primary-900">
          How our library will be reviewed
        </h2>
        <p className="mt-3 leading-relaxed text-gray-600">
          Exercise instructions, modifications and educational articles need
          named professional reviewers, sources, review dates and a version
          history before publication. Artwork is decorative and is not an
          exercise demonstration.
        </p>
      </section>
    </PageLayout>
  );
}
