import { FlaskConical, Upload, BarChart3, Users, Zap, Shield } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero */}
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-2 text-sm font-medium text-brand-700 dark:bg-brand-950 dark:text-brand-300">
            <Zap className="h-4 w-4" />
            AI-Powered HCP Engagement
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
            AI HCP Field Force
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600 dark:text-gray-400">
            Ingest NPI target lists, enrich HCP profiles with public and proprietary data, and
            deploy personalized AI agents that craft ultra-customized multi-channel outreach plans.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-4">
            <Link
              href="/dashboard"
              className="rounded-lg bg-brand-500 px-6 py-3 text-sm font-semibold text-gray-950 shadow-sm hover:bg-brand-400 transition-colors"
            >
              Go to Dashboard
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-lg border border-amber-400 bg-amber-50 px-6 py-3 text-sm font-semibold text-amber-700 hover:bg-amber-100 transition-colors dark:border-amber-600 dark:bg-amber-950 dark:text-amber-300 dark:hover:bg-amber-900"
            >
              <FlaskConical className="h-4 w-4" />
              Try Demo Mode
            </Link>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            icon={<Upload className="h-6 w-6" />}
            title="NPI Target List Ingestion"
            description="Upload CSV or Excel files with NPI numbers. We validate, deduplicate, and prepare them for enrichment."
          />
          <FeatureCard
            icon={<Users className="h-6 w-6" />}
            title="HCP Profile Enrichment"
            description="Automatically enrich each HCP with data from NPPES, publications, prescribing data, and social media."
          />
          <FeatureCard
            icon={<BarChart3 className="h-6 w-6" />}
            title="AI Persona Generation"
            description="AI agents analyze each HCP and generate rich personas — prescribing philosophy, communication style, and motivators."
          />
          <FeatureCard
            icon={<Zap className="h-6 w-6" />}
            title="Personalized Outreach"
            description="Ultra-customized outreach plans across email, SMS, direct mail, and social — tailored to each HCP."
          />
          <FeatureCard
            icon={<Shield className="h-6 w-6" />}
            title="Compliance Built-In"
            description="Every outreach includes required disclaimers, no off-label claims, and full audit logging."
          />
          <FeatureCard
            icon={<FlaskConical className="h-6 w-6" />}
            title="Demo Mode"
            description="Explore the full platform with 1,000 synthetic HCP profiles — no data upload required."
          />
        </div>
      </div>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-4 inline-flex rounded-lg bg-brand-50 p-3 text-brand-600 dark:bg-brand-950 dark:text-brand-400">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-gray-900 dark:text-white">{title}</h3>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  );
}
