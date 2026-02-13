import Link from "next/link";
import { Scale, ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
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
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Privacy Policy</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Last updated: February 2026
        </p>

        <div className="mt-8 space-y-6 text-slate-700 dark:text-slate-300">
          <section>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              1. Information We Collect
            </h2>
            <p className="mt-2">
              Patent Buddy processes the invention description you submit for assessment purposes
              only. We do not collect personal information, and no user accounts are required.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              2. How We Use Your Information
            </h2>
            <p className="mt-2">
              Your invention description is used solely to generate a patentability assessment. The
              submission is processed in real-time and is not stored on our servers after the
              assessment is returned to you.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              3. Data Storage
            </h2>
            <p className="mt-2">
              We do not persistently store your submissions. Assessment results are stored
              temporarily in your browser&apos;s session storage and are cleared when you close the
              browser tab.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              4. Third-Party Services
            </h2>
            <p className="mt-2">
              Patent Buddy does not share your submission data with third parties. No external APIs
              or services receive your invention description.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">5. Cookies</h2>
            <p className="mt-2">
              Patent Buddy may use essential cookies for basic site functionality. We do not use
              tracking or advertising cookies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">6. Your Rights</h2>
            <p className="mt-2">
              Since we do not store personal data, there is no personal data to access, modify, or
              delete. Your assessment results exist only in your browser session.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              7. Changes to This Policy
            </h2>
            <p className="mt-2">
              We may update this Privacy Policy from time to time. Changes will be reflected on this
              page with an updated date.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
