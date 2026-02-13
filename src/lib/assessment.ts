import {
  CriterionAssessment,
  IdeaSubmission,
  PatentabilityAssessment,
  Signal,
} from "@/types/assessment";

// ─── Helpers ────────────────────────────────────────────────────────

function generateId(): string {
  return `pat_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function containsAny(text: string, keywords: string[]): boolean {
  const lower = text.toLowerCase();
  return keywords.some((kw) => lower.includes(kw.toLowerCase()));
}

function countMatches(text: string, keywords: string[]): number {
  const lower = text.toLowerCase();
  return keywords.filter((kw) => lower.includes(kw.toLowerCase())).length;
}

// ─── Keyword dictionaries ───────────────────────────────────────────

const NOVELTY_POSITIVE = [
  "new",
  "novel",
  "first",
  "original",
  "unique",
  "invented",
  "breakthrough",
  "pioneering",
  "unprecedented",
  "never before",
  "no existing",
  "nothing like",
  "no one has",
  "doesn't exist",
  "does not exist",
  "innovative",
  "revolutionary",
];

const NOVELTY_NEGATIVE = [
  "improvement",
  "existing",
  "already",
  "like",
  "similar to",
  "based on",
  "modification",
  "variation",
  "tweak",
  "version of",
  "inspired by",
  "copy",
  "common",
  "well-known",
  "obvious",
  "widely used",
];

const NON_OBVIOUS_POSITIVE = [
  "unexpected",
  "surprising",
  "complex",
  "combination",
  "combining",
  "interdisciplinary",
  "cross-domain",
  "counterintuitive",
  "technical challenge",
  "difficult problem",
  "nobody thought",
  "non-trivial",
  "sophisticated",
  "multi-step",
  "synergy",
  "unique approach",
];

const NON_OBVIOUS_NEGATIVE = [
  "simple",
  "straightforward",
  "obvious",
  "anyone could",
  "basic",
  "trivial",
  "easy",
  "well-known technique",
  "standard",
  "conventional",
  "textbook",
  "commonly done",
];

const UTILITY_POSITIVE = [
  "solves",
  "problem",
  "useful",
  "application",
  "benefit",
  "helps",
  "improves",
  "reduces",
  "increases",
  "enables",
  "saves",
  "prevents",
  "automates",
  "efficiency",
  "practical",
  "real-world",
  "users can",
  "customers",
  "industry",
  "market",
];

const UTILITY_NEGATIVE = [
  "theoretical",
  "abstract",
  "conceptual",
  "hypothetical",
  "no practical",
  "artistic",
  "aesthetic only",
];

// ─── Category-specific guidance ────────────────────────────────────

const CATEGORY_TIPS: Record<string, string> = {
  "Software / App":
    "Software patents require describing a specific technical process or system, not just an abstract idea. Focus on the technical implementation details.",
  "Hardware / Electronics":
    "Hardware inventions are generally strong patent candidates. Document the specific physical components and how they interact.",
  "Mechanical / Engineering":
    "Mechanical inventions have a long history of patent protection. Be precise about the mechanism, materials, and dimensions.",
  "Biotech / Pharma":
    "Biotech patents often require extensive experimental data. Consider both composition-of-matter and method-of-use claims.",
  "Chemical / Materials":
    "Chemical patents should describe specific compositions, processes, and measurable properties of the resulting material.",
  "Consumer Product":
    "Consumer products can be patented for their functional aspects. Consider both utility patents and design patents.",
  "Business Method":
    "Business method patents face higher scrutiny after Alice Corp. v. CLS Bank. You must show a concrete technical implementation, not just an abstract business concept.",
  "Green / Clean Tech":
    "Green technology patents are growing rapidly. Emphasize the technical mechanism that achieves environmental benefits.",
  "Medical Device":
    "Medical device patents should detail the device's structure, mechanism, and clinical application. FDA regulatory pathway is separate from patent protection.",
  Other:
    "Describe your invention's technical details as specifically as possible, focusing on what makes it functionally different from existing solutions.",
};

// ─── Assessment functions ──────────────────────────────────────────

function assessNovelty(submission: IdeaSubmission): CriterionAssessment {
  const fullText = [
    submission.description,
    submission.existingSolutions ?? "",
    submission.uniqueAspects ?? "",
  ].join(" ");

  const positiveHits = countMatches(fullText, NOVELTY_POSITIVE);
  const negativeHits = countMatches(fullText, NOVELTY_NEGATIVE);
  const hasExistingSolutions = (submission.existingSolutions?.trim().length ?? 0) > 20;
  const hasUniqueAspects = (submission.uniqueAspects?.trim().length ?? 0) > 20;
  const descLength = wordCount(submission.description);

  let score = 50; // baseline

  // Positive signals
  score += positiveHits * 8;
  if (hasUniqueAspects) score += 15;
  if (descLength > 100) score += 10;
  if (descLength > 200) score += 5;

  // Negative signals
  score -= negativeHits * 6;
  if (hasExistingSolutions && !hasUniqueAspects) score -= 10;

  // Clamp
  score = Math.max(0, Math.min(100, score));

  let signal: Signal;
  let summary: string;

  if (score >= 65) {
    signal = "likely";
    summary =
      "Your idea appears to contain novel elements. The description suggests features that may not exist in current solutions.";
  } else if (score >= 35) {
    signal = "unclear";
    summary =
      "It's not clear from the description whether your idea is sufficiently novel. A prior art search would help clarify this.";
  } else {
    signal = "unlikely";
    summary =
      "Based on the description, the idea may overlap significantly with existing solutions. Consider how your approach differs technically.";
  }

  const tips: string[] = [];
  if (!hasUniqueAspects) {
    tips.push(
      "Describe what specifically makes your invention different from anything that exists today.",
    );
  }
  if (descLength < 50) {
    tips.push(
      "A more detailed description helps assess novelty. Try to explain the technical mechanism or process.",
    );
  }
  if (hasExistingSolutions) {
    tips.push(
      "You mentioned existing solutions — clearly articulate how your invention differs from each one.",
    );
  }
  tips.push(
    "A professional prior art search can uncover existing patents and publications you may not be aware of.",
  );

  return {
    criterion: "novelty",
    label: "Novelty",
    signal,
    summary,
    tips,
  };
}

function assessNonObviousness(submission: IdeaSubmission): CriterionAssessment {
  const fullText = [submission.description, submission.uniqueAspects ?? ""].join(" ");

  const positiveHits = countMatches(fullText, NON_OBVIOUS_POSITIVE);
  const negativeHits = countMatches(fullText, NON_OBVIOUS_NEGATIVE);
  const descLength = wordCount(submission.description);

  let score = 45;

  score += positiveHits * 10;
  score -= negativeHits * 8;
  if (descLength > 150) score += 10;
  if (containsAny(fullText, ["combine", "combining", "cross", "interdisciplinary"])) score += 10;

  score = Math.max(0, Math.min(100, score));

  let signal: Signal;
  let summary: string;

  if (score >= 60) {
    signal = "likely";
    summary =
      "Your invention appears to involve non-obvious elements. The approach described suggests it wouldn't be an obvious step for someone skilled in the field.";
  } else if (score >= 35) {
    signal = "unclear";
    summary =
      "It's difficult to determine non-obviousness from the description alone. Consider emphasizing what technical challenges you overcame or what unexpected results you achieved.";
  } else {
    signal = "unlikely";
    summary =
      "The described approach may be considered an obvious variation of known techniques. Highlight any surprising or counterintuitive aspects of your solution.";
  }

  const tips: string[] = [];
  tips.push("Explain why someone skilled in the field wouldn't naturally arrive at your solution.");
  if (!containsAny(fullText, ["unexpected", "surprising", "counterintuitive"]))
    tips.push(
      "If your invention produced unexpected results, describe them — this strongly supports non-obviousness.",
    );
  if (!containsAny(fullText, ["combine", "combining", "cross", "interdisciplinary"]))
    tips.push(
      "If you combined ideas from different fields in a new way, explain that — cross-domain innovation often supports non-obviousness.",
    );

  return {
    criterion: "non-obviousness",
    label: "Non-Obviousness",
    signal,
    summary,
    tips,
  };
}

function assessUtility(submission: IdeaSubmission): CriterionAssessment {
  const fullText = [
    submission.description,
    submission.existingSolutions ?? "",
    submission.uniqueAspects ?? "",
  ].join(" ");

  const positiveHits = countMatches(fullText, UTILITY_POSITIVE);
  const negativeHits = countMatches(fullText, UTILITY_NEGATIVE);

  let score = 55; // utility is generally easier to satisfy

  score += positiveHits * 6;
  score -= negativeHits * 10;

  score = Math.max(0, Math.min(100, score));

  let signal: Signal;
  let summary: string;

  if (score >= 55) {
    signal = "likely";
    summary =
      "Your invention appears to have clear practical utility. The described use case suggests real-world applicability.";
  } else if (score >= 30) {
    signal = "unclear";
    summary =
      "The practical utility could be stronger. Try to describe a specific, concrete use case or problem your invention solves.";
  } else {
    signal = "unlikely";
    summary =
      "The description doesn't clearly convey practical utility. Patents require that the invention has a specific, substantial, and credible use.";
  }

  const tips: string[] = [];
  if (!containsAny(fullText, ["problem", "solves", "solution"]))
    tips.push("Clearly state the specific problem your invention solves.");
  if (!containsAny(fullText, ["user", "customer", "patient", "industry"]))
    tips.push("Identify who would benefit from your invention and how.");
  tips.push(
    "Utility is generally the easiest patent criterion to meet — your invention just needs a specific, real-world application.",
  );

  return {
    criterion: "utility",
    label: "Utility",
    signal,
    summary,
    tips,
  };
}

// ─── Overall assessment ────────────────────────────────────────────

function computeOverallSignal(criteria: CriterionAssessment[]): Signal {
  const signals = criteria.map((c) => c.signal);
  const likelyCount = signals.filter((s) => s === "likely").length;
  const unlikelyCount = signals.filter((s) => s === "unlikely").length;

  if (likelyCount >= 2 && unlikelyCount === 0) return "likely";
  if (unlikelyCount >= 2) return "unlikely";
  return "unclear";
}

function buildOverallSummary(overall: Signal, submission: IdeaSubmission): string {
  const category = submission.category;
  const categoryNote = category && CATEGORY_TIPS[category] ? ` ${CATEGORY_TIPS[category]}` : "";

  switch (overall) {
    case "likely":
      return `Based on the information provided, your idea shows promising signs of patentability across the key criteria.${categoryNote} However, this is only a preliminary indication — a thorough prior art search and consultation with a patent attorney are essential next steps.`;
    case "unclear":
      return `Based on the information provided, some aspects of your idea's patentability are unclear and would benefit from further analysis.${categoryNote} We recommend providing more detail about what makes your invention unique and consulting with a patent professional.`;
    case "unlikely":
      return `Based on the information provided, your idea may face challenges meeting standard patentability criteria.${categoryNote} This doesn't necessarily mean it's unpatentable — consider consulting a patent attorney who can provide a thorough analysis.`;
  }
}

function buildNextSteps(overall: Signal): string[] {
  const steps: string[] = [];

  steps.push(
    "Conduct a prior art search: Search patent databases (USPTO, Google Patents, Espacenet) for existing patents and published applications similar to your idea.",
  );
  steps.push(
    "Consult a patent attorney: A registered patent attorney or agent can provide professional guidance on your specific situation and help determine the best strategy.",
  );
  steps.push(
    "Consider a provisional patent application: A provisional application establishes an early filing date and gives you 12 months to file a full (non-provisional) application. It's less expensive and buys you time.",
  );
  steps.push(
    "Document your invention: Keep detailed written records of your idea, including dates, drawings, and any prototypes or test results. This documentation can be important later.",
  );

  if (overall === "likely") {
    steps.push(
      "Evaluate your IP strategy: Consider whether a utility patent, design patent, or trade secret best protects your invention. Your attorney can advise on the right approach.",
    );
  }

  if (overall === "unclear" || overall === "unlikely") {
    steps.push(
      "Refine your invention: Consider what specific technical aspects make your solution different. Sometimes narrowing the focus to the most novel element strengthens a patent application.",
    );
  }

  return steps;
}

// ─── Main export ───────────────────────────────────────────────────

const DISCLAIMER =
  "This assessment is for informational purposes only and does not constitute legal advice. Patentability depends on many factors that cannot be fully evaluated through an automated tool. The results are indicative only and should not be relied upon as a definitive determination. Always consult a qualified patent attorney or registered patent agent before making any decisions about patent filings.";

export function runAssessment(submission: IdeaSubmission): PatentabilityAssessment {
  const novelty = assessNovelty(submission);
  const nonObviousness = assessNonObviousness(submission);
  const utility = assessUtility(submission);

  const criteria = [novelty, nonObviousness, utility];
  const overallSignal = computeOverallSignal(criteria);
  const overallSummary = buildOverallSummary(overallSignal, submission);
  const nextSteps = buildNextSteps(overallSignal);

  return {
    id: generateId(),
    overallSignal,
    overallSummary,
    criteria,
    nextSteps,
    disclaimer: DISCLAIMER,
    submittedAt: new Date().toISOString(),
    ideaTitle: submission.title,
  };
}
