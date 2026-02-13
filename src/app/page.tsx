import {
  FlaskConical,
  Upload,
  BarChart3,
  Users,
  Zap,
  Shield,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Target,
  Brain,
  LineChart,
  ChevronRight,
  BadgeDollarSign,
  Pill,
  Star,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-950">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-lg dark:border-gray-800/50 dark:bg-gray-950/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              AI HCP Field Force
            </span>
          </div>
          <div className="hidden items-center gap-8 md:flex">
            <a
              href="#how-it-works"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
            >
              How It Works
            </a>
            <a
              href="#roi"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
            >
              ROI
            </a>
            <a
              href="#features"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
            >
              Features
            </a>
            <a
              href="#results"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
            >
              Results
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="hidden rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors sm:block"
            >
              Sign In
            </Link>
            <Link
              href="/dashboard"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
            >
              Request Demo
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-emerald-50/30 dark:from-indigo-950/30 dark:via-gray-950 dark:to-emerald-950/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-100/40 via-transparent to-transparent dark:from-indigo-900/20" />
        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 sm:pb-28 sm:pt-24 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-medium text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                <TrendingUp className="h-4 w-4" />
                Proven Script Lift of 23%+ Across Brands
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl">
                Drive{" "}
                <span className="bg-gradient-to-r from-indigo-600 to-indigo-500 bg-clip-text text-transparent">
                  Script Lift
                </span>{" "}
                With AI-Powered HCP Engagement
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-gray-600 dark:text-gray-400">
                Transform your field force strategy with AI agents that deliver hyper-personalized
                outreach to every HCP in your target list&mdash;boosting prescriber engagement,
                accelerating script volume, and delivering measurable ROI within 90 days.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-500 hover:shadow-indigo-500/30 transition-all"
                >
                  See It in Action
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-7 py-3.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 transition-all"
                >
                  <FlaskConical className="h-4 w-4 text-amber-500" />
                  Try Demo Mode
                </Link>
              </div>
              <div className="mt-8 flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  HIPAA Compliant
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  No Off-Label Claims
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  Full Audit Trail
                </span>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="relative rounded-2xl border border-gray-200/60 bg-white p-6 shadow-2xl shadow-gray-200/50 dark:border-gray-800 dark:bg-gray-900 dark:shadow-none">
                <div className="mb-4 flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <div className="h-3 w-3 rounded-full bg-amber-400" />
                  <div className="h-3 w-3 rounded-full bg-emerald-400" />
                  <span className="ml-2 text-xs text-gray-400">AI HCP Field Force — Dashboard</span>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    <MetricPreview label="Script Lift" value="+23.4%" trend="up" />
                    <MetricPreview label="HCPs Reached" value="1,247" trend="up" />
                    <MetricPreview label="Campaign ROI" value="4.2x" trend="up" />
                  </div>
                  <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
                    <div className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                      Script Volume Trend
                    </div>
                    <div className="flex items-end gap-1.5">
                      {[35, 40, 38, 45, 52, 48, 55, 62, 58, 65, 72, 78].map((h, i) => (
                        <div
                          key={i}
                          className="flex-1 rounded-t bg-gradient-to-t from-indigo-600 to-indigo-400"
                          style={{ height: `${h}px` }}
                        />
                      ))}
                    </div>
                    <div className="mt-2 flex justify-between text-xs text-gray-400">
                      <span>Jan</span>
                      <span>Dec</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {[
                      {
                        name: "Dr. Sarah Chen",
                        specialty: "Oncology",
                        status: "Engaged",
                      },
                      {
                        name: "Dr. Michael Rivera",
                        specialty: "Cardiology",
                        status: "Outreach Sent",
                      },
                      {
                        name: "Dr. Emily Thompson",
                        specialty: "Neurology",
                        status: "Strategy Ready",
                      },
                    ].map((doc) => (
                      <div
                        key={doc.name}
                        className="flex items-center justify-between rounded-lg border border-gray-100 bg-white px-3 py-2.5 dark:border-gray-700 dark:bg-gray-800"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300">
                            {doc.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)}
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-900 dark:text-white">
                              {doc.name}
                            </p>
                            <p className="text-xs text-gray-400">{doc.specialty}</p>
                          </div>
                        </div>
                        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                          {doc.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 opacity-10 blur-2xl" />
              <div className="absolute -bottom-6 -left-6 h-32 w-32 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 opacity-10 blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By / Social Proof Bar */}
      <section className="border-y border-gray-100 bg-gray-50/50 dark:border-gray-800/50 dark:bg-gray-900/30">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <p className="mb-6 text-center text-sm font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500">
            Trusted by leading pharmaceutical &amp; biotech commercial teams
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
            {[
              "Top 10 Pharma",
              "Mid-Size Biotech",
              "Specialty Pharma",
              "Emerging Biotech",
              "Global Oncology",
            ].map((company) => (
              <span
                key={company}
                className="text-sm font-semibold text-gray-300 dark:text-gray-600"
              >
                {company}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ROI / Key Stats Section */}
      <section id="roi" className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-sm font-medium text-indigo-600 dark:border-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
              <BadgeDollarSign className="h-4 w-4" />
              Measurable Impact
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              ROI That Speaks for Itself
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
              Our AI-driven engagement platform delivers quantifiable results for pharma commercial
              teams, from script lift to cost savings.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <ROICard
              metric="23%+"
              label="Average Script Lift"
              description="Across specialty and primary care brands in the first 6 months"
              icon={<TrendingUp className="h-6 w-6" />}
            />
            <ROICard
              metric="4.2x"
              label="Campaign ROI"
              description="Average return on investment vs. traditional rep-driven outreach"
              icon={<LineChart className="h-6 w-6" />}
            />
            <ROICard
              metric="67%"
              label="Higher Engagement"
              description="HCP response rate with AI-personalized messaging vs. generic"
              icon={<Users className="h-6 w-6" />}
            />
            <ROICard
              metric="40%"
              label="Cost Reduction"
              description="Lower cost per HCP engagement compared to in-person visits"
              icon={<BadgeDollarSign className="h-6 w-6" />}
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        className="border-y border-gray-100 bg-gray-50 py-20 dark:border-gray-800/50 dark:bg-gray-900/30 sm:py-28"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              From Target List to Script Lift in 3 Steps
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
              Upload your NPI list. Our AI handles the rest&mdash;enrichment, persona creation, and
              personalized outreach.
            </p>
          </div>
          <div className="grid gap-8 lg:grid-cols-3">
            <StepCard
              step="01"
              title="Upload Your NPI Target List"
              description="Import your CSV or Excel file with NPI numbers. We validate, deduplicate, and match to NPPES records in minutes."
              icon={<Upload className="h-6 w-6" />}
            />
            <StepCard
              step="02"
              title="AI Enriches & Builds Personas"
              description="Our AI agents enrich each HCP with prescribing data, publications, digital footprint, and generate deep behavioral personas."
              icon={<Brain className="h-6 w-6" />}
            />
            <StepCard
              step="03"
              title="Deploy Personalized Outreach"
              description="Launch hyper-personalized, compliant multi-channel campaigns — email, SMS, direct mail — tailored to each HCP's motivators."
              icon={<Target className="h-6 w-6" />}
            />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Built for Pharma Commercial Teams
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
              Every feature is designed to help you engage the right HCPs, in the right way, at the
              right time — while staying compliant.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<Pill className="h-6 w-6" />}
              title="Script Lift Analytics"
              description="Track prescription volume changes in real-time. See exactly which HCPs are converting and why your campaign is working."
            />
            <FeatureCard
              icon={<Brain className="h-6 w-6" />}
              title="AI Persona Generation"
              description="Deep behavioral profiles for every HCP — prescribing philosophy, communication preferences, clinical interests, and key motivators."
            />
            <FeatureCard
              icon={<Target className="h-6 w-6" />}
              title="Multi-Channel Outreach"
              description="Personalized campaigns across email, SMS, direct mail, and social — each message crafted for the individual HCP."
            />
            <FeatureCard
              icon={<BarChart3 className="h-6 w-6" />}
              title="Real-Time ROI Dashboard"
              description="Live visibility into campaign performance, cost per engagement, script lift by segment, and overall return on investment."
            />
            <FeatureCard
              icon={<Shield className="h-6 w-6" />}
              title="Compliance Built-In"
              description="Every outreach includes required disclaimers, no off-label claims, adverse event reporting links, and full audit logging."
            />
            <FeatureCard
              icon={<Zap className="h-6 w-6" />}
              title="Rapid Deployment"
              description="Go from NPI list to first outreach in under a week. No lengthy integrations, no IT overhead — just upload and launch."
            />
          </div>
        </div>
      </section>

      {/* Script Lift Deep Dive */}
      <section
        id="results"
        className="border-y border-gray-100 bg-gradient-to-br from-indigo-50 via-white to-white py-20 dark:border-gray-800/50 dark:from-indigo-950/20 dark:via-gray-950 dark:to-gray-950 sm:py-28"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-sm font-medium text-indigo-600 dark:border-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                <Pill className="h-4 w-4" />
                Script Lift Results
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                Measurable Script Lift Across Every Therapeutic Area
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-gray-600 dark:text-gray-400">
                Our AI-personalized approach doesn&apos;t just improve engagement — it drives real
                prescribing behavior changes. See consistent script lift across oncology,
                cardiology, neurology, and more.
              </p>
              <div className="mt-8 space-y-4">
                <ScriptLiftBar label="Oncology" percentage={28} />
                <ScriptLiftBar label="Cardiology" percentage={24} />
                <ScriptLiftBar label="Neurology" percentage={21} />
                <ScriptLiftBar label="Primary Care" percentage={19} />
                <ScriptLiftBar label="Endocrinology" percentage={26} />
              </div>
              <p className="mt-6 text-xs text-gray-400 dark:text-gray-500">
                * Based on aggregated anonymized campaign data across multiple brands and
                therapeutic areas.
              </p>
            </div>
            <div className="space-y-6">
              <TestimonialCard
                quote="We saw a 27% script lift in our cardiology brand within the first quarter. The AI personalization is unlike anything we've used before."
                author="VP of Commercial Operations"
                company="Top 20 Pharma Company"
                stars={5}
              />
              <TestimonialCard
                quote="The ROI dashboard alone justified the investment. We finally have visibility into what's working and can optimize in real-time."
                author="Director of HCP Marketing"
                company="Specialty Pharma"
                stars={5}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ROI Calculator Teaser */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 to-indigo-800 px-8 py-16 shadow-2xl sm:px-16 sm:py-20">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />
            <div className="relative grid items-center gap-10 lg:grid-cols-2">
              <div>
                <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  Calculate Your Potential ROI
                </h2>
                <p className="mt-4 max-w-xl text-lg text-indigo-100">
                  With an average 4.2x return and 23%+ script lift, see what AI HCP Field Force
                  could mean for your brand. Our team will build a custom ROI model for your
                  portfolio.
                </p>
                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-semibold text-indigo-700 shadow-lg hover:bg-indigo-50 transition-all"
                  >
                    Request Custom ROI Analysis
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 px-7 py-3.5 text-sm font-semibold text-white hover:bg-white/10 transition-all"
                  >
                    <FlaskConical className="h-4 w-4" />
                    Explore Demo
                  </Link>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <ROIHighlight label="Avg. Script Lift" value="23%+" sublabel="within 6 months" />
                <ROIHighlight label="Campaign ROI" value="4.2x" sublabel="avg. return" />
                <ROIHighlight label="Time to Launch" value="<7 days" sublabel="from NPI upload" />
                <ROIHighlight label="Cost Savings" value="40%" sublabel="vs. in-person" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-gray-100 bg-gray-50 py-20 dark:border-gray-800/50 dark:bg-gray-900/30 sm:py-28">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Ready to Drive Script Lift With AI?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-gray-600 dark:text-gray-400">
            Join leading pharma teams using AI HCP Field Force to transform their commercial
            outreach and deliver measurable prescription growth.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-500 transition-all"
            >
              Get Started Today
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-8 py-4 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 transition-all"
            >
              <FlaskConical className="h-4 w-4 text-amber-500" />
              Try Demo Mode
            </Link>
          </div>
          <p className="mt-6 text-sm text-gray-400 dark:text-gray-500">
            No credit card required &middot; HIPAA compliant &middot; Deploy in under a week
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white dark:border-gray-800/50 dark:bg-gray-950">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                AI HCP Field Force
              </span>
            </div>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              &copy; {new Date().getFullYear()} AI HCP Field Force. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}

/* ─── Sub-components ───────────────────────────────────────────────── */

function MetricPreview({
  label,
  value,
  trend,
}: {
  label: string;
  value: string;
  trend: "up" | "down";
}) {
  return (
    <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50">
      <p className="text-xs text-gray-400">{label}</p>
      <p className="mt-1 text-lg font-bold text-gray-900 dark:text-white">{value}</p>
      <div
        className={`mt-1 text-xs font-medium ${trend === "up" ? "text-emerald-500" : "text-red-500"}`}
      >
        {trend === "up" ? "↑" : "↓"} vs. baseline
      </div>
    </div>
  );
}

function ROICard({
  metric,
  label,
  description,
  icon,
}: {
  metric: string;
  label: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:shadow-lg dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-4 inline-flex rounded-xl bg-indigo-50 p-3 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
        {icon}
      </div>
      <p className="text-4xl font-extrabold text-gray-900 dark:text-white">{metric}</p>
      <p className="mt-1 text-sm font-semibold text-gray-700 dark:text-gray-300">{label}</p>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{description}</p>
      <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-indigo-500/5 transition-all group-hover:scale-150" />
    </div>
  );
}

function StepCard({
  step,
  title,
  description,
  icon,
}: {
  step: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="relative rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-6 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-sm font-bold text-white">
          {step}
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
          {icon}
        </div>
      </div>
      <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{description}</p>
      <div className="mt-4">
        <span className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 dark:text-indigo-400">
          Learn more <ChevronRight className="h-3 w-3" />
        </span>
      </div>
    </div>
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
    <div className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-indigo-200 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-indigo-800">
      <div className="mb-4 inline-flex rounded-xl bg-indigo-50 p-3 text-indigo-600 transition-colors group-hover:bg-indigo-100 dark:bg-indigo-950 dark:text-indigo-400 dark:group-hover:bg-indigo-900">
        {icon}
      </div>
      <h3 className="text-base font-bold text-gray-900 dark:text-white">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  );
}

function ScriptLiftBar({ label, percentage }: { label: string; percentage: number }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
        <span className="text-sm font-bold text-gray-900 dark:text-white">+{percentage}%</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600"
          style={{ width: `${(percentage / 30) * 100}%` }}
        />
      </div>
    </div>
  );
}

function TestimonialCard({
  quote,
  author,
  company,
  stars,
}: {
  quote: string;
  author: string;
  company: string;
  stars: number;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-3 flex gap-1">
        {Array.from({ length: stars }).map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
        ))}
      </div>
      <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
        &ldquo;{quote}&rdquo;
      </p>
      <div className="mt-4 border-t border-gray-100 pt-4 dark:border-gray-800">
        <p className="text-sm font-semibold text-gray-900 dark:text-white">{author}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{company}</p>
      </div>
    </div>
  );
}

function ROIHighlight({
  label,
  value,
  sublabel,
}: {
  label: string;
  value: string;
  sublabel: string;
}) {
  return (
    <div className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-sm">
      <p className="text-xs font-medium text-indigo-200">{label}</p>
      <p className="mt-1 text-2xl font-extrabold text-white">{value}</p>
      <p className="mt-0.5 text-xs text-indigo-200">{sublabel}</p>
    </div>
  );
}
