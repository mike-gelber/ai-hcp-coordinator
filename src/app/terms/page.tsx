import Link from "next/link";
import { Scale, ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">Home</span>
            </Link>
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                <Scale className="h-4 w-4" />
              </div>
              <span className="font-semibold text-slate-900 dark:text-white">Patent Buddy</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Terms of Service</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Last updated: February 2026
        </p>

        <div className="mt-8 space-y-6 text-slate-700 dark:text-slate-300">
          <section>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              1. Acceptance of Terms
            </h2>
            <p className="mt-2">
              By using Patent Buddy, you agree to these Terms of Service. If you do not agree,
              please do not use the service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              2. Service Description
            </h2>
            <p className="mt-2">
              Patent Buddy provides preliminary, automated assessments of potential patentability.
              The service uses rule-based analysis to evaluate ideas against basic patent criteria
              (novelty, non-obviousness, and utility).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              3. Not Legal Advice
            </h2>
            <p className="mt-2">
              <strong>Patent Buddy does not provide legal advice.</strong> Assessments are for
              informational purposes only and are indicative, not definitive. Patentability depends
              on many factors that cannot be fully evaluated by an automated tool. You should always
              consult a qualified patent attorney or registered patent agent before making any
              decisions about patent filings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">4. No Warranty</h2>
            <p className="mt-2">
              The service is provided &quot;as is&quot; without warranties of any kind. We do not
              guarantee the accuracy, completeness, or usefulness of any assessment.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              5. Limitation of Liability
            </h2>
            <p className="mt-2">
              Patent Buddy and its operators shall not be liable for any damages arising from the
              use of this service, including but not limited to decisions made based on assessment
              results.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              6. Anonymous Use
            </h2>
            <p className="mt-2">
              Patent Buddy does not require user accounts. Submissions are processed anonymously and
              are not stored after the assessment is returned.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              7. Changes to Terms
            </h2>
            <p className="mt-2">
              We may update these Terms from time to time. Continued use of the service constitutes
              acceptance of any changes.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
