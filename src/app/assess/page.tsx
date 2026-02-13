"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Scale, ArrowLeft, ArrowRight, Loader2, Shield, Lightbulb, Info } from "lucide-react";
import { IDEA_CATEGORIES, IdeaCategory } from "@/types/assessment";

export default function AssessPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<IdeaCategory | "">("");
  const [existingSolutions, setExistingSolutions] = useState("");
  const [uniqueAspects, setUniqueAspects] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setFieldErrors({});

    try {
      const body: Record<string, string> = {
        title,
        description,
      };
      if (category) body.category = category;
      if (existingSolutions.trim()) body.existingSolutions = existingSolutions;
      if (uniqueAspects.trim()) body.uniqueAspects = uniqueAspects;

      const res = await fetch("/api/assess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.details) {
          setFieldErrors(data.details);
        }
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      // Store the result in sessionStorage and navigate to results
      sessionStorage.setItem("patent-buddy-assessment", JSON.stringify(data));
      router.push("/results");
    } catch {
      setError("Failed to connect to the server. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">Back</span>
            </Link>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                <Scale className="h-4 w-4" />
              </div>
              <span className="font-semibold text-slate-900 dark:text-white">Patent Buddy</span>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Page title */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Describe Your Invention
          </h1>
          <p className="mt-3 text-slate-600 dark:text-slate-400">
            The more detail you provide, the better our assessment will be. All fields marked with *
            are required.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Title */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <label
              htmlFor="title"
              className="block text-sm font-semibold text-slate-900 dark:text-white"
            >
              Invention Title *
            </label>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Give your invention a short, descriptive name.
            </p>
            <input
              id="title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Self-Cleaning Solar Panel Coating"
              className="mt-3 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-slate-500"
            />
            {fieldErrors.title && (
              <p className="mt-2 text-sm text-red-600">{fieldErrors.title[0]}</p>
            )}
          </div>

          {/* Category */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <label
              htmlFor="category"
              className="block text-sm font-semibold text-slate-900 dark:text-white"
            >
              Category
            </label>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Select the category that best fits your invention (optional).
            </p>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as IdeaCategory)}
              className="mt-3 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            >
              <option value="">-- Select a category --</option>
              {IDEA_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <label
              htmlFor="description"
              className="block text-sm font-semibold text-slate-900 dark:text-white"
            >
              Describe Your Invention *
            </label>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Explain what your invention does and how it works. Include technical details if
              possible.
            </p>
            <div className="mt-3 rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-950/50">
              <div className="flex items-start gap-2">
                <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>Tip:</strong> Think about: What problem does it solve? How does it work?
                  What are the key components or steps? What is the end result?
                </p>
              </div>
            </div>
            <textarea
              id="description"
              required
              rows={8}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your invention in detail..."
              className="mt-3 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-slate-500"
            />
            <div className="mt-1 text-right text-xs text-slate-400">
              {description.length} / 10,000 characters
            </div>
            {fieldErrors.description && (
              <p className="mt-2 text-sm text-red-600">{fieldErrors.description[0]}</p>
            )}
          </div>

          {/* Existing Solutions */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <label
              htmlFor="existingSolutions"
              className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white"
            >
              Known Existing Solutions
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-normal text-slate-500 dark:bg-slate-700 dark:text-slate-400">
                Optional
              </span>
            </label>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Are you aware of any existing products, patents, or solutions that are similar?
              Describing them helps us assess novelty.
            </p>
            <textarea
              id="existingSolutions"
              rows={4}
              value={existingSolutions}
              onChange={(e) => setExistingSolutions(e.target.value)}
              placeholder="e.g., Current solar panels use manual cleaning or water-based systems, but no existing coating provides self-cleaning properties using..."
              className="mt-3 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-slate-500"
            />
          </div>

          {/* Unique Aspects */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <label
              htmlFor="uniqueAspects"
              className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white"
            >
              What Makes It Unique?
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-normal text-slate-500 dark:bg-slate-700 dark:text-slate-400">
                Optional
              </span>
            </label>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Describe what sets your invention apart. What&apos;s new or different about your
              approach?
            </p>
            <textarea
              id="uniqueAspects"
              rows={4}
              value={uniqueAspects}
              onChange={(e) => setUniqueAspects(e.target.value)}
              placeholder="e.g., Unlike existing solutions, my invention uses a novel nano-particle coating that..."
              className="mt-3 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-slate-500"
            />
          </div>

          {/* Disclaimer */}
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/50">
            <div className="flex items-start gap-3">
              <Info className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
              <p className="text-sm text-amber-800 dark:text-amber-300">
                Your submission is anonymous and is not stored. The assessment provided is for
                informational purposes only and does not constitute legal advice. Always consult a
                qualified patent attorney.
              </p>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950/50">
              <div className="flex items-start gap-3">
                <Shield className="mt-0.5 h-5 w-5 shrink-0 text-red-600 dark:text-red-400" />
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              </div>
            </div>
          )}

          {/* Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-8 py-4 text-base font-semibold text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  Get Assessment
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
