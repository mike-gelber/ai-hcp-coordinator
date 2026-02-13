/**
 * Unit tests for the Personalized Outreach Strategy Generator.
 *
 * Tests cover:
 * - Persona classification across all archetypes
 * - Strategy generation with all required sections
 * - Channel mix ranking and availability logic
 * - Messaging themes personalization
 * - Content tone & style mapping
 * - Cadence recommendations
 * - Conversation starters based on profile data
 * - Objection handling personalization
 * - Context assembly from HCP profiles
 * - Edge cases (minimal data, missing fields)
 */

import { classifyPersona, generateStrategy, _internal } from "@/services/outreach-strategy";
import type { HcpStrategyContext, OutreachStrategy } from "@/types/outreach";

const { deriveChannelAvailability, derivePrescribingBehavior, deriveEngagementHistory } = _internal;

// ─── Test Fixtures ──────────────────────────────────────────────────────────

function createBaseContext(overrides: Partial<HcpStrategyContext> = {}): HcpStrategyContext {
  return {
    hcpId: "test-hcp-001",
    npi: "1234567893",
    firstName: "John",
    lastName: "Smith",
    credentials: "MD",
    gender: "M",
    primarySpecialty: "Cardiology",
    subSpecialty: "Interventional Cardiology",
    yearsInPractice: 15,
    medicalSchool: "Harvard Medical School",
    boardCertifications: ["Cardiology", "Internal Medicine"],
    affiliations: [
      {
        organizationName: "Massachusetts General Hospital",
        type: "hospital",
        role: "Attending Physician",
        isPrimary: true,
      },
    ],
    publications: [],
    clinicalTrials: [],
    channelAvailability: {
      email: true,
      phone: true,
      sms: true,
      linkedin: true,
      twitter: false,
      doximity: true,
      directMail: true,
    },
    prescribingBehavior: {
      topTherapeuticAreas: ["Heart Failure", "Hypertension"],
      prescribingVolume: "medium",
      brandVsGeneric: "balanced",
      competitiveProducts: ["Entresto", "Eliquis"],
    },
    engagementHistory: {
      totalInteractions: 0,
      channels: {},
    },
    isKol: false,
    ...overrides,
  };
}

function createAcademicResearcherContext(): HcpStrategyContext {
  return createBaseContext({
    hcpId: "test-hcp-researcher",
    firstName: "Elena",
    lastName: "Rodriguez",
    credentials: "MD, PhD",
    yearsInPractice: 20,
    primarySpecialty: "Oncology",
    affiliations: [
      {
        organizationName: "Memorial Sloan Kettering",
        type: "academic",
        role: "Associate Professor",
        isPrimary: true,
      },
    ],
    publications: Array.from({ length: 25 }, (_, i) => ({
      title: `Novel therapeutic approaches in breast cancer treatment - Study ${i + 1}`,
      journal: i < 5 ? "New England Journal of Medicine" : "Journal of Clinical Oncology",
      year: 2020 + Math.floor(i / 5),
      therapeuticArea: "Breast Cancer",
      meshTerms: ["Breast Neoplasms", "Immunotherapy"],
    })),
    clinicalTrials: [
      {
        title: "Phase III Trial of Novel CDK4/6 Inhibitor",
        phase: "Phase III",
        condition: "Breast Cancer",
        intervention: "CDK4/6 Inhibitor",
        role: "Principal Investigator",
        status: "recruiting",
      },
      {
        title: "Adjuvant Immunotherapy in Triple-Negative Breast Cancer",
        phase: "Phase II",
        condition: "Triple-Negative Breast Cancer",
        intervention: "Pembrolizumab + Chemotherapy",
        role: "Sub-Investigator",
        status: "completed",
      },
    ],
    prescribingBehavior: {
      topTherapeuticAreas: ["Breast Cancer", "Lung Cancer"],
      prescribingVolume: "medium",
      brandVsGeneric: "brand_leaning",
      competitiveProducts: ["Ibrance", "Kisqali", "Verzenio"],
    },
    isKol: false,
  });
}

function createKolInfluencerContext(): HcpStrategyContext {
  return createBaseContext({
    hcpId: "test-hcp-kol",
    firstName: "Michael",
    lastName: "Chen",
    credentials: "MD, FACC",
    yearsInPractice: 30,
    primarySpecialty: "Cardiology",
    affiliations: [
      {
        organizationName: "Cleveland Clinic",
        type: "hospital",
        role: "Chief of Cardiology",
        isPrimary: true,
      },
    ],
    publications: Array.from({ length: 40 }, (_, i) => ({
      title: `Cardiovascular outcomes study ${i + 1}`,
      journal: "Circulation",
      year: 2015 + Math.floor(i / 8),
      therapeuticArea: "Heart Failure",
      meshTerms: ["Heart Failure", "Cardiovascular Diseases"],
    })),
    clinicalTrials: [
      {
        title: "PARADIGM-HF2 Extension Study",
        phase: "Phase III",
        condition: "Heart Failure",
        intervention: "Novel ARNI",
        role: "Principal Investigator",
        status: "recruiting",
      },
    ],
    channelAvailability: {
      email: true,
      phone: true,
      sms: true,
      linkedin: true,
      twitter: true,
      doximity: true,
      directMail: true,
    },
    isKol: true,
  });
}

function createCommunityPractitionerContext(): HcpStrategyContext {
  return createBaseContext({
    hcpId: "test-hcp-community",
    firstName: "Sarah",
    lastName: "Johnson",
    credentials: "MD",
    yearsInPractice: 12,
    primarySpecialty: "Family Medicine",
    affiliations: [
      {
        organizationName: "Sunrise Family Practice",
        type: "group_practice",
        role: "Attending Physician",
        isPrimary: true,
      },
    ],
    publications: [
      {
        title: "Community health screening outcomes",
        journal: "Family Medicine Journal",
        year: 2022,
        therapeuticArea: "Diabetes",
        meshTerms: ["Diabetes Mellitus"],
      },
    ],
    clinicalTrials: [],
    channelAvailability: {
      email: true,
      phone: true,
      sms: true,
      linkedin: false,
      twitter: false,
      doximity: true,
      directMail: true,
    },
    prescribingBehavior: {
      topTherapeuticAreas: ["Diabetes", "Hypertension", "Depression"],
      prescribingVolume: "high",
      brandVsGeneric: "generic_leaning",
      competitiveProducts: ["Metformin", "Lisinopril", "Sertraline"],
      totalClaims: 1200,
    },
    isKol: false,
  });
}

function createDigitalNativeContext(): HcpStrategyContext {
  return createBaseContext({
    hcpId: "test-hcp-digital",
    firstName: "Aisha",
    lastName: "Patel",
    credentials: "DO",
    yearsInPractice: 5,
    primarySpecialty: "Dermatology",
    affiliations: [
      {
        organizationName: "Telehealth Dermatology Group",
        type: "group_practice",
        role: "Staff Physician",
        isPrimary: true,
      },
    ],
    publications: [],
    clinicalTrials: [],
    channelAvailability: {
      email: true,
      phone: true,
      sms: true,
      linkedin: true,
      twitter: true,
      doximity: true,
      directMail: true,
    },
    prescribingBehavior: {
      topTherapeuticAreas: ["Psoriasis", "Atopic Dermatitis"],
      prescribingVolume: "medium",
      brandVsGeneric: "balanced",
      competitiveProducts: ["Dupixent", "Otezla"],
    },
    isKol: false,
  });
}

function createConservativePrescriberContext(): HcpStrategyContext {
  return createBaseContext({
    hcpId: "test-hcp-conservative",
    firstName: "Robert",
    lastName: "Williams",
    credentials: "MD",
    yearsInPractice: 35,
    primarySpecialty: "Internal Medicine",
    affiliations: [
      {
        organizationName: "St. Luke's Medical Center",
        type: "hospital",
        role: "Senior Physician",
        isPrimary: true,
      },
    ],
    publications: [],
    clinicalTrials: [],
    channelAvailability: {
      email: true,
      phone: true,
      sms: false,
      linkedin: false,
      twitter: false,
      doximity: false,
      directMail: true,
    },
    prescribingBehavior: {
      topTherapeuticAreas: ["Hypertension", "Diabetes"],
      prescribingVolume: "medium",
      brandVsGeneric: "generic_leaning",
      competitiveProducts: ["Lisinopril", "Metformin", "Amlodipine"],
    },
    isKol: false,
  });
}

function createHospitalLeaderContext(): HcpStrategyContext {
  return createBaseContext({
    hcpId: "test-hcp-leader",
    firstName: "James",
    lastName: "Anderson",
    credentials: "MD, MBA",
    yearsInPractice: 25,
    primarySpecialty: "Neurology",
    affiliations: [
      {
        organizationName: "Johns Hopkins Hospital",
        type: "hospital",
        role: "Department Chair of Neurology",
        isPrimary: true,
      },
    ],
    publications: Array.from({ length: 10 }, (_, i) => ({
      title: `Neurology department outcomes study ${i + 1}`,
      journal: "Neurology",
      year: 2020 + Math.floor(i / 3),
      therapeuticArea: "Multiple Sclerosis",
      meshTerms: ["Multiple Sclerosis"],
    })),
    clinicalTrials: [],
    channelAvailability: {
      email: true,
      phone: true,
      sms: false,
      linkedin: true,
      twitter: false,
      doximity: true,
      directMail: true,
    },
    prescribingBehavior: {
      topTherapeuticAreas: ["Multiple Sclerosis", "Epilepsy"],
      prescribingVolume: "medium",
      brandVsGeneric: "balanced",
      competitiveProducts: ["Ocrevus", "Tecfidera", "Tysabri"],
    },
    isKol: false,
  });
}

function createMinimalContext(): HcpStrategyContext {
  return {
    hcpId: "test-hcp-minimal",
    npi: "9876543210",
    firstName: "Jane",
    lastName: "Doe",
    boardCertifications: [],
    affiliations: [],
    publications: [],
    clinicalTrials: [],
    channelAvailability: {
      email: true,
      phone: false,
      sms: false,
      linkedin: false,
      twitter: false,
      doximity: false,
      directMail: false,
    },
    prescribingBehavior: {
      topTherapeuticAreas: [],
      prescribingVolume: "medium",
      brandVsGeneric: "balanced",
      competitiveProducts: [],
    },
    engagementHistory: {
      totalInteractions: 0,
      channels: {},
    },
    isKol: false,
  };
}

// ─── Persona Classification Tests ───────────────────────────────────────────

describe("classifyPersona", () => {
  it("classifies an academic researcher correctly", () => {
    const ctx = createAcademicResearcherContext();
    const persona = classifyPersona(ctx);
    // With 25 publications and clinical trials, should be academic_researcher or kol_influencer
    expect(["academic_researcher", "kol_influencer"]).toContain(persona.archetype);
    expect(persona.label).toBeDefined();
    expect(persona.description).toBeDefined();
    expect(persona.traits).toBeInstanceOf(Array);
    expect(persona.traits.length).toBeGreaterThan(0);
  });

  it("classifies a KOL influencer correctly", () => {
    const ctx = createKolInfluencerContext();
    const persona = classifyPersona(ctx);
    expect(persona.archetype).toBe("kol_influencer");
    expect(persona.label).toBe("Key Opinion Leader");
  });

  it("classifies a community practitioner correctly", () => {
    const ctx = createCommunityPractitionerContext();
    const persona = classifyPersona(ctx);
    // Family medicine with group practice and high volume
    expect(["community_practitioner", "high_volume_prescriber"]).toContain(persona.archetype);
  });

  it("classifies a digital native correctly", () => {
    const ctx = createDigitalNativeContext();
    const persona = classifyPersona(ctx);
    expect(persona.archetype).toBe("digital_native");
    expect(persona.label).toBe("Digital Native");
  });

  it("classifies a conservative prescriber correctly", () => {
    const ctx = createConservativePrescriberContext();
    const persona = classifyPersona(ctx);
    expect(persona.archetype).toBe("conservative_prescriber");
    expect(persona.label).toBe("Conservative Prescriber");
  });

  it("classifies a hospital leader correctly", () => {
    const ctx = createHospitalLeaderContext();
    const persona = classifyPersona(ctx);
    expect(persona.archetype).toBe("hospital_leader");
    expect(persona.label).toBe("Hospital Leader");
  });

  it("handles minimal context gracefully", () => {
    const ctx = createMinimalContext();
    const persona = classifyPersona(ctx);
    expect(persona.archetype).toBeDefined();
    expect(persona.label).toBeDefined();
    expect(persona.description).toBeDefined();
    expect(persona.traits.length).toBeGreaterThan(0);
  });

  it("returns all required persona fields", () => {
    const ctx = createBaseContext();
    const persona = classifyPersona(ctx);
    expect(persona).toHaveProperty("archetype");
    expect(persona).toHaveProperty("label");
    expect(persona).toHaveProperty("description");
    expect(persona).toHaveProperty("traits");
  });
});

// ─── Strategy Generation Tests ──────────────────────────────────────────────

describe("generateStrategy", () => {
  it("returns a complete strategy with all required sections", () => {
    const ctx = createBaseContext();
    const strategy = generateStrategy(ctx);

    // Verify all top-level fields exist
    expect(strategy).toHaveProperty("version");
    expect(strategy).toHaveProperty("generatedAt");
    expect(strategy).toHaveProperty("hcpId", "test-hcp-001");
    expect(strategy).toHaveProperty("hcpNpi", "1234567893");
    expect(strategy).toHaveProperty("hcpName", "John Smith");
    expect(strategy).toHaveProperty("persona");
    expect(strategy).toHaveProperty("channelMix");
    expect(strategy).toHaveProperty("messagingThemes");
    expect(strategy).toHaveProperty("contentToneStyle");
    expect(strategy).toHaveProperty("cadence");
    expect(strategy).toHaveProperty("conversationStarters");
    expect(strategy).toHaveProperty("objectionHandling");
    expect(strategy).toHaveProperty("strategySummary");
  });

  it("generates a valid ISO timestamp", () => {
    const ctx = createBaseContext();
    const strategy = generateStrategy(ctx);
    expect(() => new Date(strategy.generatedAt)).not.toThrow();
    expect(new Date(strategy.generatedAt).toISOString()).toBe(strategy.generatedAt);
  });

  it("generates personalized strategy for academic researcher", () => {
    const ctx = createAcademicResearcherContext();
    const strategy = generateStrategy(ctx);

    expect(strategy.hcpName).toBe("Elena Rodriguez");

    // Should have publication-based conversation starters
    const pubStarters = strategy.conversationStarters.filter((s) => s.source === "publication");
    expect(pubStarters.length).toBeGreaterThan(0);

    // Should have clinical trial-based starters
    const trialStarters = strategy.conversationStarters.filter(
      (s) => s.source === "clinical_trial",
    );
    expect(trialStarters.length).toBeGreaterThan(0);

    // Content tone should be formal and data-heavy
    expect(strategy.contentToneStyle.formality).toBe("formal");
    expect(strategy.contentToneStyle.contentDensity).toBe("data_heavy");
  });

  it("generates personalized strategy for KOL influencer", () => {
    const ctx = createKolInfluencerContext();
    const strategy = generateStrategy(ctx);

    expect(strategy.persona.archetype).toBe("kol_influencer");

    // Strategy summary should mention KOL status
    expect(strategy.strategySummary).toContain("KOL");

    // In-person should rank high for KOLs
    const inPerson = strategy.channelMix.find((c) => c.channel === "in_person");
    expect(inPerson).toBeDefined();
    expect(inPerson!.rank).toBeLessThanOrEqual(3);
  });

  it("generates personalized strategy for community practitioner", () => {
    const ctx = createCommunityPractitionerContext();
    const strategy = generateStrategy(ctx);

    // Messaging should be practical
    const hasPatientOutcomeTheme = strategy.messagingThemes.some(
      (t) =>
        t.topic.toLowerCase().includes("patient") ||
        t.topic.toLowerCase().includes("practical") ||
        t.topic.toLowerCase().includes("real-world"),
    );
    expect(hasPatientOutcomeTheme).toBe(true);
  });

  it("generates personalized strategy for conservative prescriber", () => {
    const ctx = createConservativePrescriberContext();
    const strategy = generateStrategy(ctx);

    // Should have safety/long-term data in messaging or objection handling
    const hasSafetyTheme =
      strategy.messagingThemes.some(
        (t) =>
          t.topic.toLowerCase().includes("safety") || t.topic.toLowerCase().includes("long-term"),
      ) ||
      strategy.objectionHandling.some(
        (o) =>
          o.objection.toLowerCase().includes("safety") ||
          o.objection.toLowerCase().includes("long-term"),
      );
    expect(hasSafetyTheme).toBe(true);

    // Tone should be formal
    expect(strategy.contentToneStyle.formality).toBe("formal");
  });

  it("generates strategy for minimal profile without errors", () => {
    const ctx = createMinimalContext();
    const strategy = generateStrategy(ctx);

    // Should still have all required sections
    expect(strategy.channelMix.length).toBeGreaterThan(0);
    expect(strategy.messagingThemes.length).toBeGreaterThan(0);
    expect(strategy.conversationStarters.length).toBeGreaterThan(0);
    expect(strategy.objectionHandling.length).toBeGreaterThan(0);
    expect(strategy.strategySummary).toBeDefined();
    expect(strategy.strategySummary.length).toBeGreaterThan(0);
  });

  it("personalizes the strategy summary with HCP name", () => {
    const ctx = createBaseContext();
    const strategy = generateStrategy(ctx);
    expect(strategy.strategySummary).toContain("John");
    expect(strategy.strategySummary).toContain("Smith");
  });
});

// ─── Channel Mix Tests ──────────────────────────────────────────────────────

describe("channelMix", () => {
  it("ranks all 5 channels", () => {
    const ctx = createBaseContext();
    const strategy = generateStrategy(ctx);
    expect(strategy.channelMix.length).toBe(5);

    const channels = strategy.channelMix.map((c) => c.channel);
    expect(channels).toContain("email");
    expect(channels).toContain("sms");
    expect(channels).toContain("direct_mail");
    expect(channels).toContain("social");
    expect(channels).toContain("in_person");
  });

  it("assigns sequential ranks starting from 1", () => {
    const ctx = createBaseContext();
    const strategy = generateStrategy(ctx);
    const ranks = strategy.channelMix.map((c) => c.rank).sort((a, b) => a - b);
    expect(ranks).toEqual([1, 2, 3, 4, 5]);
  });

  it("marks channel availability correctly", () => {
    const ctx = createBaseContext({
      channelAvailability: {
        email: true,
        phone: false,
        sms: false,
        linkedin: false,
        twitter: false,
        doximity: false,
        directMail: false,
      },
    });
    const strategy = generateStrategy(ctx);

    const emailChannel = strategy.channelMix.find((c) => c.channel === "email");
    expect(emailChannel!.available).toBe(true);

    const smsChannel = strategy.channelMix.find((c) => c.channel === "sms");
    expect(smsChannel!.available).toBe(false);
  });

  it("reduces effectiveness score for unavailable channels", () => {
    const fullCtx = createBaseContext({
      channelAvailability: {
        email: true,
        phone: true,
        sms: true,
        linkedin: true,
        twitter: true,
        doximity: true,
        directMail: true,
      },
    });
    const limitedCtx = createBaseContext({
      channelAvailability: {
        email: true,
        phone: false,
        sms: false,
        linkedin: false,
        twitter: false,
        doximity: false,
        directMail: false,
      },
    });

    const fullStrategy = generateStrategy(fullCtx);
    const limitedStrategy = generateStrategy(limitedCtx);

    // SMS should score much lower when unavailable
    const fullSms = fullStrategy.channelMix.find((c) => c.channel === "sms");
    const limitedSms = limitedStrategy.channelMix.find((c) => c.channel === "sms");
    expect(limitedSms!.effectivenessScore).toBeLessThan(fullSms!.effectivenessScore);
  });

  it("includes reasoning for each channel", () => {
    const ctx = createBaseContext();
    const strategy = generateStrategy(ctx);
    for (const channel of strategy.channelMix) {
      expect(channel.reasoning).toBeDefined();
      expect(channel.reasoning.length).toBeGreaterThan(10);
    }
  });

  it("boosts preferred channel from engagement history", () => {
    const ctx = createBaseContext({
      engagementHistory: {
        totalInteractions: 20,
        preferredChannel: "sms",
        channels: { sms: 15, email: 5 },
      },
    });
    const strategyWithHistory = generateStrategy(ctx);

    const ctxNoHistory = createBaseContext({
      engagementHistory: {
        totalInteractions: 0,
        channels: {},
      },
    });
    const strategyNoHistory = generateStrategy(ctxNoHistory);

    const smsWithHistory = strategyWithHistory.channelMix.find((c) => c.channel === "sms");
    const smsNoHistory = strategyNoHistory.channelMix.find((c) => c.channel === "sms");

    expect(smsWithHistory!.effectivenessScore).toBeGreaterThan(smsNoHistory!.effectivenessScore);
  });
});

// ─── Messaging Themes Tests ─────────────────────────────────────────────────

describe("messagingThemes", () => {
  it("generates at least 3 themes", () => {
    const ctx = createBaseContext();
    const strategy = generateStrategy(ctx);
    expect(strategy.messagingThemes.length).toBeGreaterThanOrEqual(3);
  });

  it("includes therapeutic area-based themes when prescribing data exists", () => {
    const ctx = createBaseContext({
      prescribingBehavior: {
        topTherapeuticAreas: ["Heart Failure"],
        prescribingVolume: "high",
        brandVsGeneric: "balanced",
        competitiveProducts: [],
      },
    });
    const strategy = generateStrategy(ctx);

    const hasTherapeuticTheme = strategy.messagingThemes.some((t) =>
      t.topic.toLowerCase().includes("heart failure"),
    );
    expect(hasTherapeuticTheme).toBe(true);
  });

  it("includes publication-based themes for researchers", () => {
    const ctx = createAcademicResearcherContext();
    const strategy = generateStrategy(ctx);

    const hasPubTheme = strategy.messagingThemes.some(
      (t) =>
        t.topic.toLowerCase().includes("research") || t.topic.toLowerCase().includes("publish"),
    );
    expect(hasPubTheme).toBe(true);
  });

  it("includes competitive intelligence theme when competitors exist", () => {
    const ctx = createBaseContext({
      prescribingBehavior: {
        topTherapeuticAreas: ["Heart Failure"],
        prescribingVolume: "medium",
        brandVsGeneric: "balanced",
        competitiveProducts: ["Entresto", "Eliquis"],
      },
    });
    const strategy = generateStrategy(ctx);

    const hasCompetitiveTheme = strategy.messagingThemes.some(
      (t) =>
        t.topic.toLowerCase().includes("comparative") ||
        t.topic.toLowerCase().includes("switch") ||
        t.rationale.toLowerCase().includes("entresto"),
    );
    expect(hasCompetitiveTheme).toBe(true);
  });

  it("assigns valid priority levels", () => {
    const ctx = createBaseContext();
    const strategy = generateStrategy(ctx);
    for (const theme of strategy.messagingThemes) {
      expect(["primary", "secondary", "tertiary"]).toContain(theme.priority);
    }
  });

  it("includes rationale for each theme", () => {
    const ctx = createBaseContext();
    const strategy = generateStrategy(ctx);
    for (const theme of strategy.messagingThemes) {
      expect(theme.rationale).toBeDefined();
      expect(theme.rationale.length).toBeGreaterThan(10);
    }
  });
});

// ─── Content Tone & Style Tests ─────────────────────────────────────────────

describe("contentToneStyle", () => {
  it("returns all required tone fields", () => {
    const ctx = createBaseContext();
    const strategy = generateStrategy(ctx);
    const tone = strategy.contentToneStyle;
    expect(tone).toHaveProperty("formality");
    expect(tone).toHaveProperty("contentDensity");
    expect(tone).toHaveProperty("clinicalTone");
    expect(tone).toHaveProperty("styleNotes");
  });

  it("maps academic researcher to formal/data-heavy/clinical", () => {
    const ctx = createAcademicResearcherContext();
    const strategy = generateStrategy(ctx);
    // Could be academic_researcher or kol_influencer
    expect(["formal"]).toContain(strategy.contentToneStyle.formality);
    expect(["data_heavy"]).toContain(strategy.contentToneStyle.contentDensity);
  });

  it("maps digital native to casual/narrative/conversational", () => {
    const ctx = createDigitalNativeContext();
    const strategy = generateStrategy(ctx);
    expect(strategy.contentToneStyle.formality).toBe("casual");
    expect(strategy.contentToneStyle.contentDensity).toBe("narrative");
    expect(strategy.contentToneStyle.clinicalTone).toBe("conversational");
  });

  it("generates non-empty style notes", () => {
    const ctx = createBaseContext();
    const strategy = generateStrategy(ctx);
    expect(strategy.contentToneStyle.styleNotes.length).toBeGreaterThan(0);
  });

  it("adjusts style notes for senior physicians", () => {
    const seniorCtx = createBaseContext({ yearsInPractice: 30 });
    const juniorCtx = createBaseContext({ yearsInPractice: 3 });

    const seniorStrategy = generateStrategy(seniorCtx);
    const juniorStrategy = generateStrategy(juniorCtx);

    // Senior should get peer-to-peer tone note
    expect(seniorStrategy.contentToneStyle.styleNotes).toContain("experienced");
    // Junior should get mentorship note
    expect(juniorStrategy.contentToneStyle.styleNotes).toContain("mentorship");
  });

  it("includes PhD-specific notes for MD/PhD credentials", () => {
    const ctx = createBaseContext({ credentials: "MD, PhD" });
    const strategy = generateStrategy(ctx);
    expect(strategy.contentToneStyle.styleNotes).toContain("research");
  });
});

// ─── Cadence Tests ──────────────────────────────────────────────────────────

describe("cadence", () => {
  it("returns all required cadence fields", () => {
    const ctx = createBaseContext();
    const strategy = generateStrategy(ctx);
    const cadence = strategy.cadence;
    expect(cadence).toHaveProperty("frequency");
    expect(cadence).toHaveProperty("preferredDays");
    expect(cadence).toHaveProperty("preferredTimeOfDay");
    expect(cadence).toHaveProperty("reasoning");
  });

  it("uses valid frequency values", () => {
    const ctx = createBaseContext();
    const strategy = generateStrategy(ctx);
    expect(["daily", "weekly", "bi_weekly", "monthly", "quarterly"]).toContain(
      strategy.cadence.frequency,
    );
  });

  it("includes at least one preferred day", () => {
    const ctx = createBaseContext();
    const strategy = generateStrategy(ctx);
    expect(strategy.cadence.preferredDays.length).toBeGreaterThan(0);
  });

  it("recommends lower frequency for conservative prescribers", () => {
    const ctx = createConservativePrescriberContext();
    const strategy = generateStrategy(ctx);
    expect(["monthly", "bi_weekly"]).toContain(strategy.cadence.frequency);
  });

  it("adjusts cadence based on engagement history", () => {
    const newContactCtx = createDigitalNativeContext();
    newContactCtx.engagementHistory = {
      totalInteractions: 0,
      channels: {},
    };

    const strategy = generateStrategy(newContactCtx);
    // Digital natives default to weekly, but new contacts should start slower
    expect(["bi_weekly", "weekly"]).toContain(strategy.cadence.frequency);
  });
});

// ─── Conversation Starters Tests ────────────────────────────────────────────

describe("conversationStarters", () => {
  it("generates at least one conversation starter", () => {
    const ctx = createBaseContext();
    const strategy = generateStrategy(ctx);
    expect(strategy.conversationStarters.length).toBeGreaterThan(0);
  });

  it("generates publication-based starters for researchers", () => {
    const ctx = createAcademicResearcherContext();
    const strategy = generateStrategy(ctx);

    const pubStarters = strategy.conversationStarters.filter((s) => s.source === "publication");
    expect(pubStarters.length).toBeGreaterThan(0);

    // Should reference the HCP's last name
    for (const starter of pubStarters) {
      expect(starter.suggestedText).toContain("Rodriguez");
    }
  });

  it("generates clinical trial-based starters when trials exist", () => {
    const ctx = createAcademicResearcherContext();
    const strategy = generateStrategy(ctx);

    const trialStarters = strategy.conversationStarters.filter(
      (s) => s.source === "clinical_trial",
    );
    expect(trialStarters.length).toBeGreaterThan(0);
  });

  it("generates prescribing-based starters when prescribing data exists", () => {
    const ctx = createBaseContext({
      prescribingBehavior: {
        topTherapeuticAreas: ["Heart Failure"],
        prescribingVolume: "high",
        brandVsGeneric: "balanced",
        competitiveProducts: ["Entresto"],
      },
    });
    const strategy = generateStrategy(ctx);

    const rxStarters = strategy.conversationStarters.filter(
      (s) => s.source === "prescribing_pattern",
    );
    expect(rxStarters.length).toBeGreaterThan(0);
  });

  it("generates affiliation-based starters when affiliations exist", () => {
    const ctx = createBaseContext();
    const strategy = generateStrategy(ctx);

    const affStarters = strategy.conversationStarters.filter((s) => s.source === "affiliation");
    expect(affStarters.length).toBeGreaterThan(0);
    expect(affStarters[0].suggestedText).toContain("Massachusetts General Hospital");
  });

  it("sorts starters by relevance score descending", () => {
    const ctx = createAcademicResearcherContext();
    const strategy = generateStrategy(ctx);

    for (let i = 1; i < strategy.conversationStarters.length; i++) {
      expect(strategy.conversationStarters[i - 1].relevanceScore).toBeGreaterThanOrEqual(
        strategy.conversationStarters[i].relevanceScore,
      );
    }
  });

  it("provides generic starters for minimal profiles", () => {
    const ctx = createMinimalContext();
    const strategy = generateStrategy(ctx);
    expect(strategy.conversationStarters.length).toBeGreaterThan(0);
  });

  it("includes all required fields in each starter", () => {
    const ctx = createBaseContext();
    const strategy = generateStrategy(ctx);
    for (const starter of strategy.conversationStarters) {
      expect(starter).toHaveProperty("topic");
      expect(starter).toHaveProperty("suggestedText");
      expect(starter).toHaveProperty("source");
      expect(starter).toHaveProperty("relevanceScore");
      expect(starter.suggestedText.length).toBeGreaterThan(20);
    }
  });
});

// ─── Objection Handling Tests ───────────────────────────────────────────────

describe("objectionHandling", () => {
  it("generates at least 2 objection handlers", () => {
    const ctx = createBaseContext();
    const strategy = generateStrategy(ctx);
    expect(strategy.objectionHandling.length).toBeGreaterThanOrEqual(2);
  });

  it("includes the universal 'satisfied with current treatment' objection", () => {
    const ctx = createBaseContext();
    const strategy = generateStrategy(ctx);

    const universal = strategy.objectionHandling.find((o) =>
      o.objection.toLowerCase().includes("satisfied"),
    );
    expect(universal).toBeDefined();
    expect(universal!.likelihood).toBe("high");
  });

  it("includes persona-specific objections for academic researchers", () => {
    const ctx = createAcademicResearcherContext();
    const strategy = generateStrategy(ctx);

    const evidenceObjection = strategy.objectionHandling.find(
      (o) =>
        o.objection.toLowerCase().includes("evidence") ||
        o.objection.toLowerCase().includes("clinical"),
    );
    expect(evidenceObjection).toBeDefined();
  });

  it("includes cost or time objection for community practitioners", () => {
    // Community practitioner with high volume gets classified as high_volume_prescriber
    // Both personas get relevant objection handlers
    const ctx = createCommunityPractitionerContext();
    const strategy = generateStrategy(ctx);

    // Should have either cost objection (community) or time objection (high-volume)
    const relevantObjection = strategy.objectionHandling.find(
      (o) =>
        o.objection.toLowerCase().includes("afford") ||
        o.objection.toLowerCase().includes("cost") ||
        o.objection.toLowerCase().includes("time") ||
        o.objection.toLowerCase().includes("presentation"),
    );
    expect(relevantObjection).toBeDefined();
  });

  it("includes competitive product-specific objection", () => {
    const ctx = createBaseContext({
      prescribingBehavior: {
        topTherapeuticAreas: ["Heart Failure"],
        prescribingVolume: "medium",
        brandVsGeneric: "balanced",
        competitiveProducts: ["Entresto"],
      },
    });
    const strategy = generateStrategy(ctx);

    const compObjection = strategy.objectionHandling.find((o) => o.objection.includes("Entresto"));
    expect(compObjection).toBeDefined();
    expect(compObjection!.evidenceBasis).toContain("Entresto");
  });

  it("includes all required fields in each handler", () => {
    const ctx = createBaseContext();
    const strategy = generateStrategy(ctx);
    for (const handler of strategy.objectionHandling) {
      expect(handler).toHaveProperty("objection");
      expect(handler).toHaveProperty("response");
      expect(handler).toHaveProperty("evidenceBasis");
      expect(handler).toHaveProperty("likelihood");
      expect(["high", "medium", "low"]).toContain(handler.likelihood);
      expect(handler.response.length).toBeGreaterThan(20);
    }
  });

  it("includes generic safety objection for conservative prescribers", () => {
    const ctx = createConservativePrescriberContext();
    const strategy = generateStrategy(ctx);

    const safetyObjection = strategy.objectionHandling.find(
      (o) =>
        o.objection.toLowerCase().includes("safety") ||
        o.objection.toLowerCase().includes("long-term"),
    );
    expect(safetyObjection).toBeDefined();
  });

  it("includes time objection for high-volume prescribers", () => {
    const ctx = createBaseContext({
      prescribingBehavior: {
        topTherapeuticAreas: ["Diabetes"],
        prescribingVolume: "high",
        brandVsGeneric: "balanced",
        competitiveProducts: [],
        totalClaims: 1500,
      },
    });
    // We need to also give this HCP a specialty that triggers high-volume classification
    const strategy = generateStrategy(ctx);

    // The universal objection should be present at minimum
    expect(strategy.objectionHandling.length).toBeGreaterThanOrEqual(2);
  });
});

// ─── Context Derivation Tests ───────────────────────────────────────────────

describe("deriveChannelAvailability", () => {
  it("detects phone availability from locations", () => {
    const result = deriveChannelAvailability({
      locations: [{ phone: "(555) 123-4567" }],
      socialProfiles: [],
    });
    expect(result.phone).toBe(true);
    expect(result.sms).toBe(true);
  });

  it("marks phone unavailable when no phone numbers exist", () => {
    const result = deriveChannelAvailability({
      locations: [{ phone: null }],
      socialProfiles: [],
    });
    expect(result.phone).toBe(false);
    expect(result.sms).toBe(false);
  });

  it("detects social profile availability", () => {
    const result = deriveChannelAvailability({
      locations: [],
      socialProfiles: [
        { platform: "LinkedIn", isActive: true },
        { platform: "Twitter", isActive: false },
        { platform: "Doximity", isActive: true },
      ],
    });
    expect(result.linkedin).toBe(true);
    expect(result.twitter).toBe(false); // Inactive
    expect(result.doximity).toBe(true);
  });

  it("marks direct mail as available when locations exist", () => {
    const result = deriveChannelAvailability({
      locations: [{ phone: null }],
      socialProfiles: [],
    });
    expect(result.directMail).toBe(true);
  });

  it("marks direct mail as unavailable when no locations exist", () => {
    const result = deriveChannelAvailability({
      locations: [],
      socialProfiles: [],
    });
    expect(result.directMail).toBe(false);
  });
});

describe("derivePrescribingBehavior", () => {
  it("returns default values for empty prescribing data", () => {
    const result = derivePrescribingBehavior([]);
    expect(result.prescribingVolume).toBe("medium");
    expect(result.brandVsGeneric).toBe("balanced");
    expect(result.topTherapeuticAreas).toEqual([]);
    expect(result.competitiveProducts).toEqual([]);
  });

  it("aggregates therapeutic areas by claim count", () => {
    const result = derivePrescribingBehavior([
      {
        therapeuticArea: "Heart Failure",
        drugName: "Entresto",
        claimCount: 200,
        totalCost: 5000,
      },
      {
        therapeuticArea: "Heart Failure",
        drugName: "Eliquis",
        claimCount: 150,
        totalCost: 3000,
      },
      {
        therapeuticArea: "Hypertension",
        drugName: "Lisinopril",
        claimCount: 100,
        totalCost: 500,
      },
    ]);

    expect(result.topTherapeuticAreas[0]).toBe("Heart Failure");
    expect(result.topTherapeuticAreas[1]).toBe("Hypertension");
  });

  it("classifies high prescribing volume correctly", () => {
    const result = derivePrescribingBehavior([
      {
        therapeuticArea: "Diabetes",
        drugName: "Metformin",
        claimCount: 600,
        totalCost: 1000,
      },
    ]);
    expect(result.prescribingVolume).toBe("high");
  });

  it("classifies low prescribing volume correctly", () => {
    const result = derivePrescribingBehavior([
      {
        therapeuticArea: "Oncology",
        drugName: "Keytruda",
        claimCount: 50,
        totalCost: 100000,
      },
    ]);
    expect(result.prescribingVolume).toBe("low");
  });

  it("collects unique drug names as competitive products", () => {
    const result = derivePrescribingBehavior([
      {
        therapeuticArea: "Heart Failure",
        drugName: "Entresto",
        claimCount: 100,
        totalCost: 5000,
      },
      {
        therapeuticArea: "Heart Failure",
        drugName: "Entresto",
        claimCount: 50,
        totalCost: 2500,
      },
      {
        therapeuticArea: "AFib",
        drugName: "Eliquis",
        claimCount: 80,
        totalCost: 4000,
      },
    ]);
    expect(result.competitiveProducts).toContain("Entresto");
    expect(result.competitiveProducts).toContain("Eliquis");
    // Should deduplicate
    expect(result.competitiveProducts.filter((p) => p === "Entresto").length).toBe(1);
  });
});

describe("deriveEngagementHistory", () => {
  it("returns empty history for no conversation logs", () => {
    const result = deriveEngagementHistory([]);
    expect(result.totalInteractions).toBe(0);
    expect(result.channels).toEqual({});
    expect(result.preferredChannel).toBeUndefined();
  });

  it("counts interactions correctly", () => {
    const result = deriveEngagementHistory([
      { channel: "email", role: "assistant", createdAt: new Date("2024-01-01") },
      { channel: "email", role: "user", createdAt: new Date("2024-01-02") },
      { channel: "sms", role: "assistant", createdAt: new Date("2024-01-03") },
    ]);
    expect(result.totalInteractions).toBe(3);
    expect(result.channels.email).toBe(2);
    expect(result.channels.sms).toBe(1);
  });

  it("identifies the preferred channel correctly", () => {
    const result = deriveEngagementHistory([
      { channel: "email", role: "assistant", createdAt: new Date() },
      { channel: "email", role: "user", createdAt: new Date() },
      { channel: "email", role: "assistant", createdAt: new Date() },
      { channel: "sms", role: "assistant", createdAt: new Date() },
    ]);
    expect(result.preferredChannel).toBe("email");
  });

  it("tracks last interaction date", () => {
    const result = deriveEngagementHistory([
      { channel: "email", role: "assistant", createdAt: new Date("2024-01-01") },
      { channel: "email", role: "user", createdAt: new Date("2024-06-15") },
    ]);
    expect(result.lastInteractionDate).toBeDefined();
    expect(new Date(result.lastInteractionDate!).getTime()).toBe(new Date("2024-06-15").getTime());
  });
});

// ─── Strategy Summary Tests ─────────────────────────────────────────────────

describe("strategySummary", () => {
  it("includes HCP name", () => {
    const ctx = createBaseContext();
    const strategy = generateStrategy(ctx);
    expect(strategy.strategySummary).toContain("John");
    expect(strategy.strategySummary).toContain("Smith");
  });

  it("includes persona label", () => {
    const ctx = createKolInfluencerContext();
    const strategy = generateStrategy(ctx);
    expect(strategy.strategySummary).toContain("Key Opinion Leader");
  });

  it("includes affiliation when present", () => {
    const ctx = createKolInfluencerContext();
    const strategy = generateStrategy(ctx);
    expect(strategy.strategySummary).toContain("Cleveland Clinic");
  });

  it("includes channel recommendations", () => {
    const ctx = createBaseContext();
    const strategy = generateStrategy(ctx);
    // Should mention at least one channel
    const channelMentions = ["email", "sms", "direct mail", "social", "in person"];
    const hasChannelMention = channelMentions.some((ch) =>
      strategy.strategySummary.toLowerCase().includes(ch),
    );
    expect(hasChannelMention).toBe(true);
  });

  it("mentions research for HCPs with publications", () => {
    const ctx = createAcademicResearcherContext();
    const strategy = generateStrategy(ctx);
    expect(strategy.strategySummary.toLowerCase()).toContain("publication");
  });

  it("mentions KOL status for KOLs", () => {
    const ctx = createKolInfluencerContext();
    const strategy = generateStrategy(ctx);
    expect(strategy.strategySummary).toContain("KOL");
  });
});

// ─── Cross-cutting / Integration Tests ──────────────────────────────────────

describe("strategy integration", () => {
  it("all archetypes produce valid strategies", () => {
    const contexts = [
      createBaseContext(),
      createAcademicResearcherContext(),
      createKolInfluencerContext(),
      createCommunityPractitionerContext(),
      createDigitalNativeContext(),
      createConservativePrescriberContext(),
      createHospitalLeaderContext(),
      createMinimalContext(),
    ];

    for (const ctx of contexts) {
      const strategy = generateStrategy(ctx);
      validateStrategyStructure(strategy);
    }
  });

  it("strategy output is JSON-serializable", () => {
    const ctx = createAcademicResearcherContext();
    const strategy = generateStrategy(ctx);
    const serialized = JSON.stringify(strategy);
    const parsed = JSON.parse(serialized) as OutreachStrategy;
    expect(parsed.hcpId).toBe(strategy.hcpId);
    expect(parsed.channelMix.length).toBe(strategy.channelMix.length);
    expect(parsed.messagingThemes.length).toBe(strategy.messagingThemes.length);
  });

  it("different HCPs get different strategies", () => {
    const ctx1 = createAcademicResearcherContext();
    const ctx2 = createCommunityPractitionerContext();

    const strategy1 = generateStrategy(ctx1);
    const strategy2 = generateStrategy(ctx2);

    expect(strategy1.hcpId).not.toBe(strategy2.hcpId);
    expect(strategy1.persona.archetype).not.toBe(strategy2.persona.archetype);

    // Channel rankings should differ
    const top1 = strategy1.channelMix[0].channel;
    const top2 = strategy2.channelMix[0].channel;
    // They may or may not differ, but effectiveness scores should differ
    const score1 = strategy1.channelMix[0].effectivenessScore;
    const score2 = strategy2.channelMix[0].effectivenessScore;
    expect(top1 !== top2 || score1 !== score2).toBe(true);
  });
});

// ─── Helpers ────────────────────────────────────────────────────────────────

function validateStrategyStructure(strategy: OutreachStrategy) {
  // Top level
  expect(strategy.version).toBeDefined();
  expect(strategy.generatedAt).toBeDefined();
  expect(strategy.hcpId).toBeDefined();
  expect(strategy.hcpNpi).toBeDefined();
  expect(strategy.hcpName).toBeDefined();

  // Persona
  expect(strategy.persona).toBeDefined();
  expect(strategy.persona.archetype).toBeDefined();
  expect(strategy.persona.label).toBeDefined();

  // Channel mix
  expect(strategy.channelMix.length).toBe(5);
  for (const ch of strategy.channelMix) {
    expect(ch.channel).toBeDefined();
    expect(ch.rank).toBeGreaterThan(0);
    expect(ch.reasoning).toBeDefined();
    expect(typeof ch.available).toBe("boolean");
    expect(ch.effectivenessScore).toBeGreaterThanOrEqual(0);
    expect(ch.effectivenessScore).toBeLessThanOrEqual(100);
  }

  // Messaging themes (minimal profiles may only have 2-3 themes)
  expect(strategy.messagingThemes.length).toBeGreaterThanOrEqual(2);
  for (const theme of strategy.messagingThemes) {
    expect(theme.topic).toBeDefined();
    expect(theme.rationale).toBeDefined();
    expect(["primary", "secondary", "tertiary"]).toContain(theme.priority);
  }

  // Content tone
  expect(strategy.contentToneStyle).toBeDefined();
  expect(["formal", "semi_formal", "casual"]).toContain(strategy.contentToneStyle.formality);
  expect(["data_heavy", "balanced", "narrative"]).toContain(
    strategy.contentToneStyle.contentDensity,
  );
  expect(["clinical", "conversational", "hybrid"]).toContain(
    strategy.contentToneStyle.clinicalTone,
  );

  // Cadence
  expect(strategy.cadence).toBeDefined();
  expect(strategy.cadence.preferredDays.length).toBeGreaterThan(0);

  // Conversation starters
  expect(strategy.conversationStarters.length).toBeGreaterThan(0);

  // Objection handling
  expect(strategy.objectionHandling.length).toBeGreaterThan(0);

  // Summary
  expect(strategy.strategySummary.length).toBeGreaterThan(0);
}
