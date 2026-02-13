import { Lightbulb, Scale, FileCheck, ArrowRight, Shield, Search, BookOpen } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Scale className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-white">Patent Buddy</span>
          </div>
          <Link
            href="/assess"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
          >
            Get Started
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-300">
            <Lightbulb className="h-4 w-4" />
            Free Preliminary Assessment
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
            Is your idea
            <span className="text-blue-600 dark:text-blue-400"> patentable</span>?
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-400">
            Describe your invention and get an instant preliminary assessment of its patentability.
            Understand how your idea stacks up on novelty, non-obviousness, and utility — the three
            pillars of patent law.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-4">
            <Link
              href="/assess"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-8 py-4 text-base font-semibold text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg"
            >
              Check If Your Idea Is Patentable
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-500">
            No account required. Free and anonymous.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-t border-slate-200 bg-white py-20 dark:border-slate-800 dark:bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-slate-900 dark:text-white">
            How It Works
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-slate-600 dark:text-slate-400">
            Three simple steps to understand your idea&apos;s patent potential.
          </p>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            <StepCard
              number="1"
              icon={<BookOpen className="h-6 w-6" />}
              title="Describe Your Invention"
              description="Tell us about your idea — what it does, how it works, and what makes it different from existing solutions."
            />
            <StepCard
              number="2"
              icon={<Search className="h-6 w-6" />}
              title="Get Your Assessment"
              description="Our system evaluates your idea against the three key patent criteria: novelty, non-obviousness, and utility."
            />
            <StepCard
              number="3"
              icon={<FileCheck className="h-6 w-6" />}
              title="Review Next Steps"
              description="Receive clear, actionable guidance on what to do next — from prior art searches to consulting a patent attorney."
            />
          </div>
        </div>
      </section>

      {/* Patent Criteria */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-slate-900 dark:text-white">
            What Makes an Idea Patentable?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-slate-600 dark:text-slate-400">
            The U.S. Patent and Trademark Office evaluates patent applications on three main
            criteria.
          </p>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            <CriterionCard
              title="Novelty"
              description="Your invention must be new. It can't be something that already exists in the public domain — whether in patents, publications, products, or public knowledge."
              color="blue"
            />
            <CriterionCard
              title="Non-Obviousness"
              description="Your invention can't be an obvious variation of existing knowledge. It must represent a meaningful inventive step that wouldn't be apparent to someone skilled in the field."
              color="indigo"
            />
            <CriterionCard
              title="Utility"
              description="Your invention must have a practical, real-world use. It needs to be useful and operable — not purely theoretical or impossible."
              color="sky"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-slate-200 bg-blue-600 py-20 dark:border-slate-800">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white">Ready to check your idea?</h2>
          <p className="mt-4 text-lg text-blue-100">
            Get a free, instant preliminary assessment. No account needed.
          </p>
          <Link
            href="/assess"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-white px-8 py-4 text-base font-semibold text-blue-600 shadow-md transition-all hover:bg-blue-50 hover:shadow-lg"
          >
            Check If Your Idea Is Patentable
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-12 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                <Scale className="h-4 w-4" />
              </div>
              <span className="font-semibold text-slate-900 dark:text-white">Patent Buddy</span>
            </div>
            <div className="flex gap-6 text-sm text-slate-500 dark:text-slate-400">
              <Link href="/terms" className="hover:text-slate-700 dark:hover:text-slate-300">
                Terms of Service
              </Link>
              <Link href="/privacy" className="hover:text-slate-700 dark:hover:text-slate-300">
                Privacy Policy
              </Link>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-8 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/50">
            <div className="flex items-start gap-3">
              <Shield className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
              <p className="text-sm text-amber-800 dark:text-amber-300">
                <strong>Disclaimer:</strong> Patent Buddy provides preliminary, informational
                assessments only. This is not legal advice. Results are indicative and should not be
                relied upon as a definitive determination of patentability. Always consult a
                qualified patent attorney or registered patent agent before making decisions about
                patent filings.
              </p>
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-slate-400 dark:text-slate-500">
            &copy; {new Date().getFullYear()} Patent Buddy. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}

function StepCard({
  number,
  icon,
  title,
  description,
}: {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="relative rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="absolute -top-4 left-1/2 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
        {number}
      </div>
      <div className="mb-4 mt-2 inline-flex rounded-lg bg-blue-50 p-3 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{description}</p>
    </div>
  );
}

function CriterionCard({
  title,
  description,
  color,
}: {
  title: string;
  description: string;
  color: "blue" | "indigo" | "sky";
}) {
  const colorMap = {
    blue: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300",
    indigo:
      "border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950 dark:text-indigo-300",
    sky: "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-800 dark:bg-sky-950 dark:text-sky-300",
  };

  return (
    <div className={`rounded-xl border p-8 ${colorMap[color]}`}>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed opacity-90">{description}</p>
    </div>
  );
}
