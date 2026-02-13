export interface IdeaSubmission {
  title: string;
  description: string;
  category?: string;
  existingSolutions?: string;
  uniqueAspects?: string;
}

export type Signal = "likely" | "unclear" | "unlikely";

export interface CriterionAssessment {
  criterion: "novelty" | "non-obviousness" | "utility";
  label: string;
  signal: Signal;
  summary: string;
  tips: string[];
}

export interface PatentabilityAssessment {
  id: string;
  overallSignal: Signal;
  overallSummary: string;
  criteria: CriterionAssessment[];
  nextSteps: string[];
  disclaimer: string;
  submittedAt: string;
  ideaTitle: string;
}

export const IDEA_CATEGORIES = [
  "Software / App",
  "Hardware / Electronics",
  "Mechanical / Engineering",
  "Biotech / Pharma",
  "Chemical / Materials",
  "Consumer Product",
  "Business Method",
  "Green / Clean Tech",
  "Medical Device",
  "Other",
] as const;

export type IdeaCategory = (typeof IDEA_CATEGORIES)[number];
