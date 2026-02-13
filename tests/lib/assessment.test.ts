import { runAssessment } from "@/lib/assessment";
import type { IdeaSubmission } from "@/types/assessment";

describe("runAssessment", () => {
  it("returns a valid assessment structure", () => {
    const submission: IdeaSubmission = {
      title: "Test Invention",
      description: "A device that solves a practical problem by using a novel mechanism.",
    };

    const result = runAssessment(submission);

    expect(result).toBeDefined();
    expect(result.id).toMatch(/^pat_/);
    expect(result.ideaTitle).toBe("Test Invention");
    expect(["likely", "unclear", "unlikely"]).toContain(result.overallSignal);
    expect(result.overallSummary).toBeTruthy();
    expect(result.criteria).toHaveLength(3);
    expect(result.nextSteps.length).toBeGreaterThanOrEqual(4);
    expect(result.disclaimer).toBeTruthy();
    expect(result.submittedAt).toBeTruthy();
  });

  it("evaluates all three criteria", () => {
    const submission: IdeaSubmission = {
      title: "Widget",
      description: "An innovative new widget that provides utility.",
    };

    const result = runAssessment(submission);
    const criterionNames = result.criteria.map((c) => c.criterion);

    expect(criterionNames).toContain("novelty");
    expect(criterionNames).toContain("non-obviousness");
    expect(criterionNames).toContain("utility");
  });

  it("gives each criterion a valid signal and summary", () => {
    const submission: IdeaSubmission = {
      title: "Test",
      description: "This is a test idea that solves a real-world problem using new technology.",
    };

    const result = runAssessment(submission);

    for (const criterion of result.criteria) {
      expect(["likely", "unclear", "unlikely"]).toContain(criterion.signal);
      expect(criterion.summary).toBeTruthy();
      expect(criterion.label).toBeTruthy();
      expect(Array.isArray(criterion.tips)).toBe(true);
    }
  });

  it("scores highly novel descriptions as likely for novelty", () => {
    const submission: IdeaSubmission = {
      title: "Breakthrough Device",
      description:
        "A completely novel, first-of-its-kind device that is unprecedented and pioneering. Nothing like this exists. It is a breakthrough in the field with an original approach that no one has ever attempted.",
      uniqueAspects:
        "This is an entirely new invention with no existing counterpart. The unique mechanism has never been built before.",
    };

    const result = runAssessment(submission);
    const novelty = result.criteria.find((c) => c.criterion === "novelty");

    expect(novelty).toBeDefined();
    expect(novelty!.signal).toBe("likely");
  });

  it("scores vague short descriptions lower on novelty", () => {
    const submission: IdeaSubmission = {
      title: "Simple Tweak",
      description:
        "A simple improvement to an existing well-known product based on common obvious modifications.",
    };

    const result = runAssessment(submission);
    const novelty = result.criteria.find((c) => c.criterion === "novelty");

    expect(novelty).toBeDefined();
    expect(["unclear", "unlikely"]).toContain(novelty!.signal);
  });

  it("assesses utility positively when practical use is described", () => {
    const submission: IdeaSubmission = {
      title: "Practical Tool",
      description:
        "This tool solves a major problem in the industry. It helps users save time and increases efficiency. It has practical real-world application and enables customers to automate their workflow, improving their productivity and reducing costs.",
    };

    const result = runAssessment(submission);
    const utility = result.criteria.find((c) => c.criterion === "utility");

    expect(utility).toBeDefined();
    expect(utility!.signal).toBe("likely");
  });

  it("includes category-specific guidance when category is provided", () => {
    const submission: IdeaSubmission = {
      title: "Software Patent",
      description: "A new software system that processes data in a novel way.",
      category: "Software / App",
    };

    const result = runAssessment(submission);

    expect(result.overallSummary).toContain("Software");
  });

  it("includes next steps recommending prior art search and attorney", () => {
    const submission: IdeaSubmission = {
      title: "Any Idea",
      description: "Some invention description that is sufficiently long to be processed.",
    };

    const result = runAssessment(submission);

    const hasAttorney = result.nextSteps.some((s) => s.toLowerCase().includes("attorney"));
    const hasPriorArt = result.nextSteps.some((s) => s.toLowerCase().includes("prior art"));
    const hasProvisional = result.nextSteps.some((s) => s.toLowerCase().includes("provisional"));

    expect(hasAttorney).toBe(true);
    expect(hasPriorArt).toBe(true);
    expect(hasProvisional).toBe(true);
  });

  it("handles optional fields gracefully", () => {
    const submission: IdeaSubmission = {
      title: "Minimal Submission",
      description: "A brief description of an idea without optional fields.",
    };

    expect(() => runAssessment(submission)).not.toThrow();

    const result = runAssessment(submission);
    expect(result.criteria).toHaveLength(3);
    expect(result.overallSignal).toBeTruthy();
  });

  it("includes a disclaimer in the result", () => {
    const submission: IdeaSubmission = {
      title: "Test",
      description: "Testing the disclaimer is present in the assessment output.",
    };

    const result = runAssessment(submission);

    expect(result.disclaimer).toContain("not constitute legal advice");
    expect(result.disclaimer).toContain("patent attorney");
  });
});
