/**
 * Personalized Outreach Strategy Generator
 *
 * For each HCP, generates an ultra-customized outreach plan that specifies
 * what to say, how to say it, and through which channels.
 *
 * The generator:
 * 1. Assembles full HCP context from the profile and related data
 * 2. Classifies the HCP into a persona/archetype
 * 3. Generates a complete outreach strategy (AI-powered or rule-based)
 * 4. Persists the strategy in the OutreachPlan model
 */

import { prisma } from "@/lib/db";
import type {
  OutreachStrategy,
  HcpStrategyContext,
  HcpPersona,
  HcpArchetype,
  ChannelRecommendation,
  MessagingTheme,
  ContentToneStyle,
  OutreachCadence,
  ConversationStarter,
  ObjectionHandler,
  ChannelAvailability,
  PrescribingBehavior,
  EngagementHistory,
  OutreachChannel,
  FormalityLevel,
  ContentDensity,
  ClinicalTone,
  FrequencyUnit,
  GenerateStrategyResponse,
} from "@/types/outreach";

// ─── Context Assembly ───────────────────────────────────────────────────────

/**
 * Assemble the full HCP context from a profile ID, pulling all related data.
 */
export async function assembleHcpContext(
  hcpId: string
): Promise<HcpStrategyContext | null> {
  const profile = await prisma.hcpProfile.findUnique({
    where: { id: hcpId },
    include: {
      locations: true,
      affiliations: true,
      publications: true,
      socialProfiles: true,
      prescribingData: true,
      clinicalTrials: true,
      conversationLogs: true,
      proprietaryData: true,
    },
  });

  if (!profile) return null;

  // Derive channel availability from the profile data
  const channelAvailability = deriveChannelAvailability(profile);

  // Summarize prescribing behavior
  const prescribingBehavior = derivePrescribingBehavior(profile.prescribingData);

  // Summarize engagement history from conversation logs
  const engagementHistory = deriveEngagementHistory(profile.conversationLogs);

  // Determine KOL status from social profiles
  const isKol = profile.socialProfiles.some((sp) => sp.isKol);

  return {
    hcpId: profile.id,
    npi: profile.npi,
    firstName: profile.firstName,
    lastName: profile.lastName,
    credentials: profile.credentials ?? undefined,
    gender: profile.gender ?? undefined,
    primarySpecialty: profile.primarySpecialty ?? undefined,
    subSpecialty: profile.subSpecialty ?? undefined,
    yearsInPractice: profile.yearsInPractice ?? undefined,
    medicalSchool: profile.medicalSchool ?? undefined,
    boardCertifications: profile.boardCertifications,
    affiliations: profile.affiliations.map((a) => ({
      organizationName: a.organizationName,
      type: a.type,
      role: a.role ?? undefined,
      isPrimary: a.isPrimary,
    })),
    publications: profile.publications.map((p) => ({
      title: p.title,
      journal: p.journal ?? undefined,
      year: p.year ?? undefined,
      therapeuticArea: p.therapeuticArea ?? undefined,
      meshTerms: p.meshTerms,
    })),
    clinicalTrials: profile.clinicalTrials.map((t) => ({
      title: t.title,
      phase: t.phase ?? undefined,
      condition: t.condition ?? undefined,
      intervention: t.intervention ?? undefined,
      role: t.role ?? undefined,
      status: t.status ?? undefined,
    })),
    channelAvailability,
    prescribingBehavior,
    engagementHistory,
    isKol,
  };
}

/**
 * Derive channel availability from the HCP profile and related data.
 */
function deriveChannelAvailability(profile: {
  locations: Array<{ phone?: string | null }>;
  socialProfiles: Array<{ platform: string; isActive: boolean }>;
}): ChannelAvailability {
  const hasPhone = profile.locations.some(
    (loc) => loc.phone && loc.phone.trim() !== ""
  );

  const activeSocials = new Set(
    profile.socialProfiles
      .filter((sp) => sp.isActive)
      .map((sp) => sp.platform.toLowerCase())
  );

  return {
    email: true, // We always attempt email outreach
    phone: hasPhone,
    sms: hasPhone,
    linkedin: activeSocials.has("linkedin"),
    twitter: activeSocials.has("twitter"),
    doximity: activeSocials.has("doximity"),
    directMail: profile.locations.length > 0,
  };
}

/**
 * Summarize prescribing behavior from prescribing data records.
 */
function derivePrescribingBehavior(
  prescribingData: Array<{
    therapeuticArea: string | null;
    drugName: string | null;
    claimCount: number | null;
    totalCost: number | null;
  }>
): PrescribingBehavior {
  if (prescribingData.length === 0) {
    return {
      topTherapeuticAreas: [],
      prescribingVolume: "medium",
      brandVsGeneric: "balanced",
      competitiveProducts: [],
    };
  }

  // Aggregate therapeutic areas by claim count
  const areaMap = new Map<string, number>();
  const drugs = new Set<string>();
  let totalClaims = 0;

  for (const rx of prescribingData) {
    if (rx.therapeuticArea) {
      areaMap.set(
        rx.therapeuticArea,
        (areaMap.get(rx.therapeuticArea) || 0) + (rx.claimCount || 0)
      );
    }
    if (rx.drugName) {
      drugs.add(rx.drugName);
    }
    totalClaims += rx.claimCount || 0;
  }

  const topTherapeuticAreas = [...areaMap.entries()]
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([area]) => area);

  // Classify prescribing volume
  let prescribingVolume: "high" | "medium" | "low" = "medium";
  if (totalClaims > 500) prescribingVolume = "high";
  else if (totalClaims < 100) prescribingVolume = "low";

  return {
    topTherapeuticAreas,
    prescribingVolume,
    brandVsGeneric: "balanced",
    competitiveProducts: [...drugs].slice(0, 10),
    totalClaims,
  };
}

/**
 * Summarize engagement history from conversation logs.
 */
function deriveEngagementHistory(
  conversationLogs: Array<{
    channel: string;
    role: string;
    createdAt: Date;
  }>
): EngagementHistory {
  if (conversationLogs.length === 0) {
    return {
      totalInteractions: 0,
      channels: {},
    };
  }

  const channelCounts: Record<string, number> = {};
  let lastDate: Date | undefined;

  for (const log of conversationLogs) {
    channelCounts[log.channel] = (channelCounts[log.channel] || 0) + 1;
    if (!lastDate || log.createdAt > lastDate) {
      lastDate = log.createdAt;
    }
  }

  // Find preferred channel (most interactions)
  const preferredChannel = Object.entries(channelCounts).sort(
    ([, a], [, b]) => b - a
  )[0]?.[0] as OutreachChannel | undefined;

  return {
    totalInteractions: conversationLogs.length,
    lastInteractionDate: lastDate?.toISOString(),
    preferredChannel,
    channels: channelCounts,
  };
}

// ─── Persona Classification ─────────────────────────────────────────────────

/** Persona definitions with scoring criteria */
const PERSONA_DEFINITIONS: Record<
  HcpArchetype,
  { label: string; description: string; traits: string[] }
> = {
  academic_researcher: {
    label: "Academic Researcher",
    description:
      "Publishes actively, involved in clinical trials, values evidence-based data and peer-reviewed studies.",
    traits: [
      "Evidence-driven",
      "Publishes regularly",
      "Clinical trial participant",
      "Values peer-reviewed data",
    ],
  },
  community_practitioner: {
    label: "Community Practitioner",
    description:
      "Primary care or general practice focused, values practical clinical insights and patient outcomes.",
    traits: [
      "Patient-outcome focused",
      "Practical-minded",
      "Community-oriented",
      "Values real-world evidence",
    ],
  },
  hospital_leader: {
    label: "Hospital Leader",
    description:
      "Holds leadership positions, influences formulary decisions, values institutional partnerships.",
    traits: [
      "Decision-maker",
      "Formulary influence",
      "Institutional mindset",
      "Values strategic partnerships",
    ],
  },
  early_adopter: {
    label: "Early Adopter",
    description:
      "Quick to try new therapies, digitally engaged, open to novel approaches.",
    traits: [
      "Innovation-friendly",
      "Digitally active",
      "Open to new therapies",
      "Trend-aware",
    ],
  },
  conservative_prescriber: {
    label: "Conservative Prescriber",
    description:
      "Prefers established therapies, cautious about new medications, values long-term safety data.",
    traits: [
      "Risk-averse",
      "Prefers established therapies",
      "Values long-term data",
      "Cautious adopter",
    ],
  },
  digital_native: {
    label: "Digital Native",
    description:
      "Highly active on social/professional platforms, engages with digital content, younger in practice.",
    traits: [
      "Digitally active",
      "Social media presence",
      "Engages with online content",
      "Tech-savvy",
    ],
  },
  high_volume_prescriber: {
    label: "High-Volume Prescriber",
    description:
      "High prescribing volume, time-constrained, values efficiency and concise information.",
    traits: [
      "High patient volume",
      "Time-constrained",
      "Values brevity",
      "Efficiency-focused",
    ],
  },
  kol_influencer: {
    label: "Key Opinion Leader",
    description:
      "Recognized thought leader, influences peers, speaks at conferences, large professional following.",
    traits: [
      "Thought leader",
      "Peer influencer",
      "Conference speaker",
      "Large professional network",
    ],
  },
};

/**
 * Classify an HCP into a persona/archetype based on their profile data.
 * Uses a scoring system to determine the best fit.
 */
export function classifyPersona(context: HcpStrategyContext): HcpPersona {
  const scores: Record<HcpArchetype, number> = {
    academic_researcher: 0,
    community_practitioner: 0,
    hospital_leader: 0,
    early_adopter: 0,
    conservative_prescriber: 0,
    digital_native: 0,
    high_volume_prescriber: 0,
    kol_influencer: 0,
  };

  // Publications & clinical trials → academic_researcher
  if (context.publications.length > 5) scores.academic_researcher += 3;
  if (context.publications.length > 15) scores.academic_researcher += 2;
  if (context.clinicalTrials.length > 0) scores.academic_researcher += 3;
  if (context.clinicalTrials.length > 3) scores.academic_researcher += 2;

  // KOL status → kol_influencer
  if (context.isKol) scores.kol_influencer += 5;
  if (context.publications.length > 20) scores.kol_influencer += 3;
  if (context.channelAvailability.twitter) scores.kol_influencer += 1;
  if (context.channelAvailability.linkedin) scores.kol_influencer += 1;

  // Leadership roles → hospital_leader
  const hasLeadershipRole = context.affiliations.some(
    (a) =>
      a.role &&
      /chief|director|chair|head|dean/i.test(a.role)
  );
  if (hasLeadershipRole) scores.hospital_leader += 5;
  if ((context.yearsInPractice ?? 0) > 20) scores.hospital_leader += 2;
  const hasHospitalAffiliation = context.affiliations.some(
    (a) => a.type === "hospital"
  );
  if (hasHospitalAffiliation) scores.hospital_leader += 1;

  // Digital presence → digital_native
  const digitalChannelCount = [
    context.channelAvailability.linkedin,
    context.channelAvailability.twitter,
    context.channelAvailability.doximity,
  ].filter(Boolean).length;
  if (digitalChannelCount >= 2) scores.digital_native += 3;
  if (digitalChannelCount >= 3) scores.digital_native += 2;
  if ((context.yearsInPractice ?? 20) < 10) scores.digital_native += 2;

  // Prescribing volume → high_volume_prescriber
  if (context.prescribingBehavior.prescribingVolume === "high") {
    scores.high_volume_prescriber += 5;
  }
  if ((context.prescribingBehavior.totalClaims ?? 0) > 1000) {
    scores.high_volume_prescriber += 2;
  }

  // Community / primary care → community_practitioner
  const communitySpecialties = [
    "Family Medicine",
    "Internal Medicine",
    "Pediatrics",
    "General Practice",
  ];
  if (
    context.primarySpecialty &&
    communitySpecialties.includes(context.primarySpecialty)
  ) {
    scores.community_practitioner += 3;
  }
  const hasGroupPractice = context.affiliations.some(
    (a) => a.type === "group_practice"
  );
  if (hasGroupPractice) scores.community_practitioner += 2;
  if (context.publications.length < 3) scores.community_practitioner += 1;

  // Conservative prescriber signals
  if (context.prescribingBehavior.brandVsGeneric === "generic_leaning") {
    scores.conservative_prescriber += 3;
  }
  if ((context.yearsInPractice ?? 0) > 25) scores.conservative_prescriber += 2;
  if (digitalChannelCount === 0) scores.conservative_prescriber += 1;
  if (context.publications.length < 2) scores.conservative_prescriber += 1;

  // Early adopter signals
  if (context.prescribingBehavior.brandVsGeneric === "brand_leaning") {
    scores.early_adopter += 2;
  }
  if ((context.yearsInPractice ?? 20) < 15) scores.early_adopter += 1;
  if (digitalChannelCount >= 1) scores.early_adopter += 1;
  if (context.clinicalTrials.length > 0) scores.early_adopter += 1;

  // Find the highest-scoring archetype
  const sorted = Object.entries(scores).sort(([, a], [, b]) => b - a);
  const [bestArchetype] = sorted[0] as [HcpArchetype, number];

  const definition = PERSONA_DEFINITIONS[bestArchetype];
  return {
    archetype: bestArchetype,
    label: definition.label,
    description: definition.description,
    traits: definition.traits,
  };
}

// ─── Strategy Generation (Rule-Based) ───────────────────────────────────────

/**
 * Generate a complete outreach strategy for an HCP.
 * This is the rule-based generator that uses deterministic logic
 * based on the persona and HCP context.
 */
export function generateStrategy(context: HcpStrategyContext): OutreachStrategy {
  const persona = classifyPersona(context);
  const channelMix = generateChannelMix(context, persona);
  const messagingThemes = generateMessagingThemes(context, persona);
  const contentToneStyle = generateContentToneStyle(persona, context);
  const cadence = generateCadence(persona, context);
  const conversationStarters = generateConversationStarters(context, persona);
  const objectionHandling = generateObjectionHandling(context, persona);
  const strategySummary = generateStrategySummary(
    context,
    persona,
    channelMix,
    cadence
  );

  return {
    version: "1.0.0",
    generatedAt: new Date().toISOString(),
    hcpId: context.hcpId,
    hcpNpi: context.npi,
    hcpName: `${context.firstName} ${context.lastName}`,
    persona,
    channelMix,
    messagingThemes,
    contentToneStyle,
    cadence,
    conversationStarters,
    objectionHandling,
    strategySummary,
  };
}

// ─── Channel Mix ────────────────────────────────────────────────────────────

function generateChannelMix(
  context: HcpStrategyContext,
  persona: HcpPersona
): ChannelRecommendation[] {
  const recommendations: ChannelRecommendation[] = [];
  const avail = context.channelAvailability;

  // Base effectiveness scores by persona
  const channelScores: Record<HcpArchetype, Record<OutreachChannel, number>> = {
    academic_researcher: {
      email: 85,
      in_person: 80,
      social: 60,
      direct_mail: 50,
      sms: 30,
    },
    community_practitioner: {
      in_person: 90,
      email: 70,
      direct_mail: 65,
      sms: 50,
      social: 35,
    },
    hospital_leader: {
      in_person: 90,
      email: 80,
      direct_mail: 60,
      social: 45,
      sms: 25,
    },
    early_adopter: {
      email: 80,
      social: 78,
      sms: 65,
      in_person: 60,
      direct_mail: 40,
    },
    conservative_prescriber: {
      in_person: 85,
      direct_mail: 75,
      email: 65,
      sms: 30,
      social: 20,
    },
    digital_native: {
      social: 90,
      email: 82,
      sms: 70,
      in_person: 50,
      direct_mail: 30,
    },
    high_volume_prescriber: {
      email: 80,
      sms: 75,
      in_person: 70,
      direct_mail: 45,
      social: 35,
    },
    kol_influencer: {
      in_person: 90,
      email: 85,
      social: 80,
      direct_mail: 50,
      sms: 35,
    },
  };

  const scores = channelScores[persona.archetype];

  // Check availability for each channel
  const channelAvailMap: Record<OutreachChannel, boolean> = {
    email: avail.email,
    sms: avail.sms || avail.phone,
    direct_mail: avail.directMail,
    social: avail.linkedin || avail.twitter || avail.doximity,
    in_person: avail.directMail, // If we have an address, in-person is possible
  };

  const channelReasonings: Record<HcpArchetype, Record<OutreachChannel, string>> = {
    academic_researcher: {
      email: "Researchers prefer detailed email communications with study data and citations",
      sms: "Brief SMS reminders can supplement email-based engagement",
      direct_mail: "Reprints and journal articles via mail can reinforce key messages",
      social: "Professional platforms allow engagement with published research",
      in_person: "Conference meetings and academic detailing are highly valued",
    },
    community_practitioner: {
      email: "Email summaries of practical clinical insights resonate well",
      sms: "Quick appointment reminders and follow-ups work for busy practitioners",
      direct_mail: "Patient education materials and samples via mail are appreciated",
      social: "Limited social presence; use sparingly for general updates",
      in_person: "In-office visits are the gold standard for community physicians",
    },
    hospital_leader: {
      email: "Formal email communications about institutional programs and partnerships",
      sms: "SMS is too informal for leadership-level engagement",
      direct_mail: "Executive summaries and institutional reports via mail are effective",
      social: "LinkedIn engagement for thought leadership content",
      in_person: "Executive meetings and advisory board invitations are preferred",
    },
    early_adopter: {
      email: "Email campaigns highlighting novel therapies and innovation drive engagement",
      sms: "Quick digital touchpoints align with their tech-forward preferences",
      direct_mail: "Less relevant for digitally-oriented early adopters",
      social: "Social channels are natural engagement points for innovation content",
      in_person: "Product launches and innovation showcases are compelling in person",
    },
    conservative_prescriber: {
      email: "Email can deliver safety data and long-term study results",
      sms: "SMS feels too informal and may be dismissed",
      direct_mail: "Physical mailings with comprehensive data packages build trust",
      social: "Conservative prescribers rarely engage on social platforms",
      in_person: "Face-to-face meetings build the trust needed for prescribing changes",
    },
    digital_native: {
      email: "Email is a primary communication channel for digital-first physicians",
      sms: "SMS and messaging apps are natural communication tools",
      direct_mail: "Physical mail is less effective for digitally-oriented HCPs",
      social: "Social and professional networks are their primary information sources",
      in_person: "Virtual meetings may be preferred over in-person visits",
    },
    high_volume_prescriber: {
      email: "Concise, scannable emails with clear calls to action work best",
      sms: "Brief text messages respect their limited time",
      direct_mail: "Quick-reference cards and dosing guides via mail are useful",
      social: "Limited time for social engagement; keep it brief and valuable",
      in_person: "Short, focused lunch-and-learn sessions maximize limited time",
    },
    kol_influencer: {
      email: "Personalized email with exclusive data and advisory invitations",
      sms: "SMS for time-sensitive advisory board or event coordination",
      direct_mail: "Premium mailings for advisory board materials and exclusive content",
      social: "Social engagement amplifies their thought leadership and builds relationship",
      in_person: "Conference engagements and advisory board meetings are essential",
    },
  };

  const reasonings = channelReasonings[persona.archetype];

  for (const channel of Object.keys(scores) as OutreachChannel[]) {
    const available = channelAvailMap[channel];
    // Adjust score based on availability
    const effectivenessScore = available
      ? scores[channel]
      : Math.round(scores[channel] * 0.3);

    recommendations.push({
      channel,
      rank: 0, // Will be set after sorting
      reasoning: reasonings[channel],
      available,
      effectivenessScore,
    });
  }

  // Boost score if engagement history shows success on a channel
  if (context.engagementHistory.preferredChannel) {
    const preferred = recommendations.find(
      (r) => r.channel === context.engagementHistory.preferredChannel
    );
    if (preferred) {
      preferred.effectivenessScore = Math.min(
        100,
        preferred.effectivenessScore + 10
      );
    }
  }

  // Sort by effectiveness and assign ranks
  recommendations.sort((a, b) => b.effectivenessScore - a.effectivenessScore);
  recommendations.forEach((r, i) => {
    r.rank = i + 1;
  });

  return recommendations;
}

// ─── Messaging Themes ───────────────────────────────────────────────────────

function generateMessagingThemes(
  context: HcpStrategyContext,
  persona: HcpPersona
): MessagingTheme[] {
  const themes: MessagingTheme[] = [];

  // Theme based on therapeutic area
  if (context.prescribingBehavior.topTherapeuticAreas.length > 0) {
    const topArea = context.prescribingBehavior.topTherapeuticAreas[0];
    themes.push({
      topic: `Latest advances in ${topArea} treatment`,
      rationale: `${topArea} is their highest-volume therapeutic area, indicating strong professional interest and patient need`,
      priority: "primary",
    });
  }

  // Theme based on publications/research
  if (context.publications.length > 0) {
    const recentPub = context.publications.sort(
      (a, b) => (b.year ?? 0) - (a.year ?? 0)
    )[0];
    themes.push({
      topic: `Building on their published research${recentPub.therapeuticArea ? ` in ${recentPub.therapeuticArea}` : ""}`,
      rationale: `With ${context.publications.length} publications, they value evidence-based discussion that connects to their research interests`,
      priority: "primary",
    });
  }

  // Theme based on clinical trials
  if (context.clinicalTrials.length > 0) {
    const activeTrial = context.clinicalTrials.find(
      (t) => t.status === "recruiting"
    ) ?? context.clinicalTrials[0];
    themes.push({
      topic: `Clinical trial collaboration and real-world evidence`,
      rationale: `Active in ${context.clinicalTrials.length} clinical trial(s), including "${activeTrial.title.slice(0, 80)}"`,
      priority: context.clinicalTrials.length > 2 ? "primary" : "secondary",
    });
  }

  // Persona-specific themes
  const personaThemes: Record<HcpArchetype, MessagingTheme> = {
    academic_researcher: {
      topic: "Peer-reviewed data and mechanism of action deep-dives",
      rationale:
        "Academic researchers value rigorous scientific evidence and novel pharmacological insights",
      priority: "secondary",
    },
    community_practitioner: {
      topic: "Real-world patient outcomes and practical prescribing tips",
      rationale:
        "Community practitioners prioritize practical information that directly impacts patient care",
      priority: "primary",
    },
    hospital_leader: {
      topic: "Institutional value proposition and formulary considerations",
      rationale:
        "Hospital leaders think in terms of institutional impact, costs, and population health",
      priority: "secondary",
    },
    early_adopter: {
      topic: "Novel therapeutic approaches and pipeline innovations",
      rationale:
        "Early adopters are motivated by innovation and being first to leverage new treatments",
      priority: "secondary",
    },
    conservative_prescriber: {
      topic: "Long-term safety data and head-to-head comparison studies",
      rationale:
        "Conservative prescribers need extensive safety evidence before considering therapeutic switches",
      priority: "primary",
    },
    digital_native: {
      topic: "Digital health tools and technology-enabled patient engagement",
      rationale:
        "Digital natives appreciate how technology can enhance treatment adherence and monitoring",
      priority: "secondary",
    },
    high_volume_prescriber: {
      topic: "Simplified dosing and adherence solutions for high patient volumes",
      rationale:
        "High-volume prescribers value efficiency gains that help them serve more patients",
      priority: "secondary",
    },
    kol_influencer: {
      topic: "Advisory board opportunities and exclusive data previews",
      rationale:
        "KOLs are motivated by opportunities to shape the field and access pre-publication data",
      priority: "secondary",
    },
  };

  themes.push(personaThemes[persona.archetype]);

  // Specialty-based theme if not already covered
  if (context.primarySpecialty && themes.length < 4) {
    themes.push({
      topic: `${context.primarySpecialty}-specific treatment paradigm updates`,
      rationale: `Specialty-specific content demonstrates understanding of their clinical focus area`,
      priority: "tertiary",
    });
  }

  // Competitive intelligence theme if they prescribe competitor products
  if (context.prescribingBehavior.competitiveProducts.length > 0) {
    themes.push({
      topic: "Comparative efficacy and switch considerations",
      rationale: `Currently prescribes ${context.prescribingBehavior.competitiveProducts.slice(0, 3).join(", ")} — comparative data may drive trial consideration`,
      priority: "secondary",
    });
  }

  // Ensure we always have at least 3 themes with fallbacks
  if (themes.length < 3) {
    themes.push({
      topic: "Patient support programs and resources",
      rationale:
        "All HCPs value patient support resources that improve outcomes and adherence",
      priority: "tertiary",
    });
  }

  if (themes.length < 3) {
    themes.push({
      topic: "Emerging treatment guidelines and best practices",
      rationale:
        "Staying current with evolving treatment guidelines is a universal priority for practicing physicians",
      priority: "tertiary",
    });
  }

  return themes;
}

// ─── Content Tone & Style ───────────────────────────────────────────────────

function generateContentToneStyle(
  persona: HcpPersona,
  context: HcpStrategyContext
): ContentToneStyle {
  const toneMap: Record<
    HcpArchetype,
    { formality: FormalityLevel; contentDensity: ContentDensity; clinicalTone: ClinicalTone }
  > = {
    academic_researcher: {
      formality: "formal",
      contentDensity: "data_heavy",
      clinicalTone: "clinical",
    },
    community_practitioner: {
      formality: "semi_formal",
      contentDensity: "balanced",
      clinicalTone: "conversational",
    },
    hospital_leader: {
      formality: "formal",
      contentDensity: "balanced",
      clinicalTone: "hybrid",
    },
    early_adopter: {
      formality: "semi_formal",
      contentDensity: "balanced",
      clinicalTone: "hybrid",
    },
    conservative_prescriber: {
      formality: "formal",
      contentDensity: "data_heavy",
      clinicalTone: "clinical",
    },
    digital_native: {
      formality: "casual",
      contentDensity: "narrative",
      clinicalTone: "conversational",
    },
    high_volume_prescriber: {
      formality: "semi_formal",
      contentDensity: "narrative",
      clinicalTone: "conversational",
    },
    kol_influencer: {
      formality: "formal",
      contentDensity: "data_heavy",
      clinicalTone: "hybrid",
    },
  };

  const base = toneMap[persona.archetype];

  // Generate style notes based on the persona and context
  const styleNotes = generateStyleNotes(persona, context);

  return {
    ...base,
    styleNotes,
  };
}

function generateStyleNotes(
  persona: HcpPersona,
  context: HcpStrategyContext
): string {
  const notes: string[] = [];

  // Seniority-based adjustments
  if ((context.yearsInPractice ?? 0) > 25) {
    notes.push(
      "Use respectful, peer-to-peer tone appropriate for a highly experienced physician."
    );
  } else if ((context.yearsInPractice ?? 0) < 5) {
    notes.push(
      "Tone can be slightly more approachable, emphasizing mentorship and learning opportunities."
    );
  }

  // Persona-specific notes
  switch (persona.archetype) {
    case "academic_researcher":
      notes.push(
        "Lead with data: cite specific trial endpoints, p-values, and NNT where applicable."
      );
      notes.push(
        "Reference their publications when relevant to establish credibility."
      );
      break;
    case "community_practitioner":
      notes.push(
        "Use patient case scenarios rather than raw data to illustrate clinical value."
      );
      notes.push("Keep messages practical — focus on 'how' rather than 'why'.");
      break;
    case "hospital_leader":
      notes.push(
        "Frame messages in terms of institutional value, cost-effectiveness, and population impact."
      );
      break;
    case "early_adopter":
      notes.push(
        "Emphasize novelty and differentiation from existing treatment options."
      );
      break;
    case "conservative_prescriber":
      notes.push(
        "Emphasize safety profile and long-term outcomes data. Avoid overselling."
      );
      notes.push(
        "Acknowledge their current treatment approach as valid before introducing alternatives."
      );
      break;
    case "digital_native":
      notes.push(
        "Use concise, scannable formats. Infographics and short-form content work well."
      );
      break;
    case "high_volume_prescriber":
      notes.push(
        "Keep communications extremely concise. Use bullet points and clear calls to action."
      );
      notes.push("Respect their time — every sentence should add value.");
      break;
    case "kol_influencer":
      notes.push(
        "Position them as a valued thought partner, not just a prescriber."
      );
      notes.push(
        "Offer exclusive access to data, advisory opportunities, and peer engagement."
      );
      break;
  }

  // Credential-based adjustments
  if (context.credentials?.includes("PhD")) {
    notes.push(
      "Acknowledge their research background — lead with scientific rigor."
    );
  }

  return notes.join(" ");
}

// ─── Cadence ────────────────────────────────────────────────────────────────

function generateCadence(
  persona: HcpPersona,
  context: HcpStrategyContext
): OutreachCadence {
  const cadenceMap: Record<
    HcpArchetype,
    { frequency: FrequencyUnit; preferredDays: string[]; preferredTimeOfDay: "morning" | "midday" | "afternoon" | "evening"; reasoning: string }
  > = {
    academic_researcher: {
      frequency: "bi_weekly",
      preferredDays: ["Tuesday", "Thursday"],
      preferredTimeOfDay: "morning",
      reasoning:
        "Academics are typically in clinic or meetings early week; mid-week mornings offer the best window for email engagement between rounds and research time.",
    },
    community_practitioner: {
      frequency: "bi_weekly",
      preferredDays: ["Tuesday", "Wednesday"],
      preferredTimeOfDay: "midday",
      reasoning:
        "Community physicians are busiest in the morning with patient appointments. Midday during lunch breaks provides the best engagement window.",
    },
    hospital_leader: {
      frequency: "monthly",
      preferredDays: ["Monday", "Tuesday"],
      preferredTimeOfDay: "morning",
      reasoning:
        "Hospital leaders plan their weeks on Mondays. Monthly touchpoints prevent communication fatigue while maintaining presence.",
    },
    early_adopter: {
      frequency: "weekly",
      preferredDays: ["Wednesday", "Thursday"],
      preferredTimeOfDay: "afternoon",
      reasoning:
        "Early adopters are active information seekers who appreciate regular updates. Mid-week afternoons catch them during planning time.",
    },
    conservative_prescriber: {
      frequency: "monthly",
      preferredDays: ["Tuesday"],
      preferredTimeOfDay: "morning",
      reasoning:
        "Less frequent touchpoints prevent pushback. Monthly cadence allows each interaction to deliver substantial new evidence.",
    },
    digital_native: {
      frequency: "weekly",
      preferredDays: ["Monday", "Wednesday", "Friday"],
      preferredTimeOfDay: "morning",
      reasoning:
        "Digital natives check communications frequently. Mornings across the week provide multiple low-pressure touchpoints.",
    },
    high_volume_prescriber: {
      frequency: "bi_weekly",
      preferredDays: ["Thursday", "Friday"],
      preferredTimeOfDay: "afternoon",
      reasoning:
        "End-of-week afternoons are when high-volume prescribers are most likely to have brief windows. Bi-weekly prevents overload.",
    },
    kol_influencer: {
      frequency: "bi_weekly",
      preferredDays: ["Tuesday", "Wednesday"],
      preferredTimeOfDay: "morning",
      reasoning:
        "KOLs have packed schedules but engage with personalized, high-value content. Early-week mornings align with their planning windows.",
    },
  };

  const base = cadenceMap[persona.archetype];

  // Adjust based on engagement history
  if (context.engagementHistory.totalInteractions > 10) {
    // Existing relationship — can increase frequency
    if (base.frequency === "monthly") {
      return { ...base, frequency: "bi_weekly", reasoning: base.reasoning + " Increased frequency based on established engagement history." };
    }
  } else if (context.engagementHistory.totalInteractions === 0) {
    // New contact — start slower
    if (base.frequency === "weekly") {
      return { ...base, frequency: "bi_weekly", reasoning: base.reasoning + " Starting with lower frequency as this is a new contact." };
    }
  }

  return base;
}

// ─── Conversation Starters ──────────────────────────────────────────────────

function generateConversationStarters(
  context: HcpStrategyContext,
  persona: HcpPersona
): ConversationStarter[] {
  const starters: ConversationStarter[] = [];

  // Publication-based starters
  if (context.publications.length > 0) {
    const recentPubs = [...context.publications]
      .sort((a, b) => (b.year ?? 0) - (a.year ?? 0))
      .slice(0, 2);

    for (const pub of recentPubs) {
      const yearStr = pub.year ? ` (${pub.year})` : "";
      starters.push({
        topic: `Their publication: "${pub.title.slice(0, 100)}"`,
        suggestedText: `Dr. ${context.lastName}, I was impressed by your work on "${pub.title.slice(0, 80)}"${yearStr}${pub.journal ? ` in ${pub.journal}` : ""}. Your findings align closely with recent data we've seen in this therapeutic area.`,
        source: "publication",
        relevanceScore: 90,
      });
    }
  }

  // Clinical trial-based starters
  if (context.clinicalTrials.length > 0) {
    const trial = context.clinicalTrials[0];
    starters.push({
      topic: `Their clinical trial involvement: "${trial.title.slice(0, 80)}"`,
      suggestedText: `Dr. ${context.lastName}, given your role${trial.role ? ` as ${trial.role}` : ""} in the ${trial.title.slice(0, 60)} trial${trial.condition ? ` for ${trial.condition}` : ""}, I'd love to share some complementary real-world evidence data that may be relevant.`,
      source: "clinical_trial",
      relevanceScore: 88,
    });
  }

  // Prescribing pattern-based starters
  if (context.prescribingBehavior.topTherapeuticAreas.length > 0) {
    const topArea = context.prescribingBehavior.topTherapeuticAreas[0];
    starters.push({
      topic: `Their prescribing focus in ${topArea}`,
      suggestedText: `Dr. ${context.lastName}, I understand ${topArea} is a key focus of your practice. We have new data on treatment approaches in this area that I think you'd find particularly relevant to your patients.`,
      source: "prescribing_pattern",
      relevanceScore: 75,
    });
  }

  // Affiliation-based starters
  if (context.affiliations.length > 0) {
    const primaryAff =
      context.affiliations.find((a) => a.isPrimary) ?? context.affiliations[0];
    starters.push({
      topic: `Their role at ${primaryAff.organizationName}`,
      suggestedText: `Dr. ${context.lastName}, ${primaryAff.role ? `in your role as ${primaryAff.role} at` : "given your work at"} ${primaryAff.organizationName}, I wanted to share some insights that may support ${primaryAff.type === "academic" ? "your research and clinical" : "your clinical"} programs.`,
      source: "affiliation",
      relevanceScore: 65,
    });
  }

  // Persona-based general starter if we have few specific ones
  if (starters.length < 2) {
    const generalStarters: Record<HcpArchetype, ConversationStarter> = {
      academic_researcher: {
        topic: "Recent peer-reviewed evidence",
        suggestedText: `Dr. ${context.lastName}, a recently published study in your specialty area presented some compelling findings. I'd welcome the opportunity to discuss how these results compare with your clinical experience.`,
        source: "general",
        relevanceScore: 50,
      },
      community_practitioner: {
        topic: "Practical patient outcomes",
        suggestedText: `Dr. ${context.lastName}, I've been hearing from other ${context.primarySpecialty ?? "physicians"} in the community about a treatment approach that's been showing strong real-world results. I'd love to share what we're seeing.`,
        source: "general",
        relevanceScore: 50,
      },
      hospital_leader: {
        topic: "Institutional partnership opportunity",
        suggestedText: `Dr. ${context.lastName}, we're working with several leading institutions on programs that improve both patient outcomes and operational efficiency. I think there may be a strong fit with your goals.`,
        source: "general",
        relevanceScore: 50,
      },
      early_adopter: {
        topic: "New treatment innovation",
        suggestedText: `Dr. ${context.lastName}, I know you stay at the forefront of therapeutic innovation. We have some exciting new data I'd love to be the first to share with you.`,
        source: "general",
        relevanceScore: 50,
      },
      conservative_prescriber: {
        topic: "Long-term safety evidence",
        suggestedText: `Dr. ${context.lastName}, I know that robust safety data is critical in your decision-making. We recently published 5-year follow-up data that I think addresses many of the questions you might have.`,
        source: "general",
        relevanceScore: 50,
      },
      digital_native: {
        topic: "Digital health resources",
        suggestedText: `Dr. ${context.lastName}, we've launched some new digital resources and tools for ${context.primarySpecialty ?? "your specialty"} that I think you'd find valuable. Would you be interested in a quick overview?`,
        source: "general",
        relevanceScore: 50,
      },
      high_volume_prescriber: {
        topic: "Streamlined prescribing solutions",
        suggestedText: `Dr. ${context.lastName}, I know your time is extremely valuable. I have a 2-minute summary of new data that could simplify your prescribing workflow for a significant portion of your patient panel.`,
        source: "general",
        relevanceScore: 50,
      },
      kol_influencer: {
        topic: "Advisory board invitation",
        suggestedText: `Dr. ${context.lastName}, given your recognized expertise and influence in the field, we'd be honored to invite you to participate in an upcoming advisory board discussion on emerging treatment paradigms.`,
        source: "general",
        relevanceScore: 55,
      },
    };
    starters.push(generalStarters[persona.archetype]);
  }

  // Sort by relevance
  starters.sort((a, b) => b.relevanceScore - a.relevanceScore);

  return starters;
}

// ─── Objection Handling ─────────────────────────────────────────────────────

function generateObjectionHandling(
  context: HcpStrategyContext,
  persona: HcpPersona
): ObjectionHandler[] {
  const handlers: ObjectionHandler[] = [];

  // Universal objections
  handlers.push({
    objection: "I'm satisfied with my current treatment approach",
    response:
      "I completely understand, and your patients are benefiting from your expertise. Rather than suggesting a change, I'd simply like to share some new data that might add to your treatment toolkit — it could be particularly relevant for patients who aren't fully responding to current regimens.",
    evidenceBasis: "Common across all HCP types; most physicians have established preferences",
    likelihood: "high",
  });

  // Persona-specific objections
  switch (persona.archetype) {
    case "academic_researcher":
      handlers.push({
        objection: "I need to see more robust clinical evidence before considering this",
        response:
          "Absolutely — that scientific rigor is exactly what makes your perspective so valuable. Let me share our Phase III data, including the full statistical analysis and subgroup breakdowns. We also have a meta-analysis in press that I think you'll find compelling.",
        evidenceBasis: "Academic researchers demand rigorous evidence before adoption",
        likelihood: "high",
      });
      handlers.push({
        objection: "The study design doesn't adequately control for confounding variables",
        response:
          "That's an excellent observation. Our team addressed this in the supplementary analysis using [relevant methodology]. I'd welcome your specific feedback — would you be open to reviewing the full protocol?",
        evidenceBasis: "Researchers often critique methodology as part of their evaluation process",
        likelihood: "medium",
      });
      break;

    case "community_practitioner":
      handlers.push({
        objection: "My patients can't afford this medication",
        response:
          "Cost is absolutely a critical factor in treatment decisions. We have comprehensive patient assistance programs covering up to [X]% of eligible patients, plus copay support that brings the out-of-pocket cost down significantly. Let me walk you through the options available for your patient population.",
        evidenceBasis: "Community practitioners often face cost barriers with their patient populations",
        likelihood: "high",
      });
      handlers.push({
        objection: "I don't have time for a detailed presentation",
        response:
          "I completely respect your time. I've prepared a one-page clinical summary with the key efficacy and safety data points. Can I leave it with your staff, and I'll follow up with a 3-minute call at a time that works for you?",
        evidenceBasis: "High patient volume limits available time for rep interactions",
        likelihood: "medium",
      });
      break;

    case "hospital_leader":
      handlers.push({
        objection: "This doesn't fit our current formulary strategy",
        response:
          "I understand formulary decisions involve multiple stakeholders and careful evaluation. We've prepared a health economics dossier that demonstrates the total cost of care impact, including reduced readmission rates and shorter hospital stays. Would it be helpful if I presented this to your P&T committee?",
        evidenceBasis: "Hospital leaders manage formulary decisions with institutional priorities",
        likelihood: "high",
      });
      break;

    case "early_adopter":
      handlers.push({
        objection: "What's truly different about this versus what's already in development?",
        response:
          "Great question — the key differentiators are [specific MOA/clinical advantages]. Unlike pipeline competitors, our approach offers [unique value]. We're also the only therapy with [specific endpoint] data. I can share a competitive landscape analysis if that would be helpful.",
        evidenceBasis: "Early adopters evaluate novelty relative to the full competitive landscape",
        likelihood: "medium",
      });
      break;

    case "conservative_prescriber":
      handlers.push({
        objection: "I want to wait for more long-term safety data",
        response:
          "That's a very prudent approach, and patient safety should always come first. We now have [X]-year follow-up data showing a consistent safety profile with no new signals. I also have the post-marketing surveillance summary that covers over [Y] patient-years of real-world use.",
        evidenceBasis: "Conservative prescribers prioritize long-term safety over short-term efficacy gains",
        likelihood: "high",
      });
      handlers.push({
        objection: "The generic alternative works well enough for my patients",
        response:
          "Generics are certainly an important part of treatment. However, for the subset of patients who aren't achieving optimal outcomes, our data shows meaningful improvements in [key endpoints]. This isn't about replacing what's working — it's about having another option for patients who need it.",
        evidenceBasis:
          context.prescribingBehavior.brandVsGeneric === "generic_leaning"
            ? "This HCP shows a preference for generic prescribing"
            : "Common concern for cost-conscious prescribers",
        likelihood: context.prescribingBehavior.brandVsGeneric === "generic_leaning" ? "high" : "medium",
      });
      break;

    case "digital_native":
      handlers.push({
        objection: "I can find all this information online myself",
        response:
          "You absolutely can, and I appreciate that you stay well-informed. What I can add is curated, real-time access to data that isn't publicly available yet, plus direct access to our medical science team for any questions. I've also set up a digital resource hub specifically for your clinical interests.",
        evidenceBasis: "Digitally active HCPs often self-serve information and may question rep value",
        likelihood: "medium",
      });
      break;

    case "high_volume_prescriber":
      handlers.push({
        objection: "I don't have time for this",
        response:
          "I completely respect that. Let me leave you with a 30-second summary: [key value proposition in one sentence]. If that sounds relevant to your patients, I have a one-pager and a dosing quick-reference card. Can I leave those with your team?",
        evidenceBasis: "High-volume prescribers are chronically time-constrained",
        likelihood: "high",
      });
      break;

    case "kol_influencer":
      handlers.push({
        objection: "I have concerns about the trial design that limit my endorsement",
        response:
          "Your critique is incredibly valuable — that's exactly the kind of expert perspective we need. Would you be willing to share your specific concerns in an advisory setting? Your input could directly shape our next-phase study design, and we'd compensate you appropriately for your time and expertise.",
        evidenceBasis: "KOLs often have nuanced scientific objections and value being heard",
        likelihood: "medium",
      });
      handlers.push({
        objection: "I need to maintain my independence and objectivity",
        response:
          "Absolutely, and we deeply respect that. Any collaboration would be fully transparent, compliant with all guidelines, and completely voluntary. We value your independent assessment precisely because it's independent — that credibility is what makes your perspective so important.",
        evidenceBasis: "KOLs are careful about perceived conflicts of interest",
        likelihood: "medium",
      });
      break;
  }

  // Prescribing behavior-specific objections
  if (context.prescribingBehavior.competitiveProducts.length > 0) {
    const topCompetitor = context.prescribingBehavior.competitiveProducts[0];
    handlers.push({
      objection: `I'm getting good results with ${topCompetitor}`,
      response: `${topCompetitor} is certainly a solid choice, and I'm glad your patients are doing well. For your consideration, our head-to-head data shows comparable efficacy with some additional benefits in [specific area]. This could be particularly relevant for patients who [specific patient subset].`,
      evidenceBasis: `Prescribing data shows current use of ${topCompetitor}`,
      likelihood: "high",
    });
  }

  return handlers;
}

// ─── Strategy Summary ───────────────────────────────────────────────────────

function generateStrategySummary(
  context: HcpStrategyContext,
  persona: HcpPersona,
  channelMix: ChannelRecommendation[],
  cadence: OutreachCadence
): string {
  const topChannels = channelMix
    .filter((c) => c.rank <= 3)
    .map((c) => c.channel.replace("_", " "))
    .join(", ");

  const specialty = context.primarySpecialty ?? "their specialty";
  const experience =
    (context.yearsInPractice ?? 0) > 20
      ? "highly experienced"
      : (context.yearsInPractice ?? 0) > 10
        ? "experienced"
        : "earlier-career";

  const parts: string[] = [
    `Dr. ${context.firstName} ${context.lastName} is classified as a "${persona.label}" — an ${experience} ${specialty} specialist`,
  ];

  if (context.affiliations.length > 0) {
    const primaryAff =
      context.affiliations.find((a) => a.isPrimary) ?? context.affiliations[0];
    parts[0] += ` at ${primaryAff.organizationName}`;
  }
  parts[0] += ".";

  parts.push(
    `The recommended approach focuses on ${topChannels} as primary channels, with a ${cadence.frequency.replace("_", "-")} cadence targeting ${cadence.preferredDays.join(" and ")} ${cadence.preferredTimeOfDay}s.`
  );

  if (context.publications.length > 0 || context.clinicalTrials.length > 0) {
    const researchNote = [];
    if (context.publications.length > 0)
      researchNote.push(
        `${context.publications.length} publication(s)`
      );
    if (context.clinicalTrials.length > 0)
      researchNote.push(
        `${context.clinicalTrials.length} clinical trial(s)`
      );
    parts.push(
      `Messaging should leverage their research background (${researchNote.join(" and ")}) to build credibility and engagement.`
    );
  }

  if (context.prescribingBehavior.prescribingVolume === "high") {
    parts.push(
      "As a high-volume prescriber, communications should be concise and high-impact."
    );
  }

  if (context.isKol) {
    parts.push(
      "Given their KOL status, consider advisory board and speaker program opportunities to deepen the relationship."
    );
  }

  return parts.join(" ");
}

// ─── OpenAI-Powered Generation ──────────────────────────────────────────────

/**
 * Generate a strategy using OpenAI for more nuanced, natural-language personalization.
 * Falls back to rule-based generation if OpenAI is unavailable.
 */
export async function generateStrategyWithAI(
  context: HcpStrategyContext
): Promise<OutreachStrategy> {
  // Check if OpenAI is configured
  if (!process.env.OPENAI_API_KEY) {
    return generateStrategy(context);
  }

  try {
    const { default: OpenAI } = await import("openai");
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const persona = classifyPersona(context);
    const ruleBasedStrategy = generateStrategy(context);

    const systemPrompt = `You are an expert pharmaceutical field force strategist. Given an HCP profile and a rule-based outreach strategy, enhance the strategy with more nuanced, personalized recommendations.

You must return a valid JSON object that matches the OutreachStrategy structure. Keep all structural fields intact but improve:
1. The reasoning and rationale fields to be more specific and insightful
2. The suggestedText fields in conversation starters to be more natural and compelling
3. The response fields in objection handling to be more persuasive and empathetic
4. The strategySummary to be more actionable and specific

Do NOT change the structure, field names, or remove any fields.`;

    const userPrompt = `HCP Profile:
- Name: Dr. ${context.firstName} ${context.lastName}${context.credentials ? `, ${context.credentials}` : ""}
- Specialty: ${context.primarySpecialty ?? "Not specified"}
- Years in Practice: ${context.yearsInPractice ?? "Unknown"}
- Persona: ${persona.label} (${persona.description})
- Publications: ${context.publications.length}
- Clinical Trials: ${context.clinicalTrials.length}
- Prescribing Volume: ${context.prescribingBehavior.prescribingVolume}
- KOL Status: ${context.isKol ? "Yes" : "No"}
- Available Channels: ${Object.entries(context.channelAvailability).filter(([, v]) => v).map(([k]) => k).join(", ")}

Rule-based strategy to enhance:
${JSON.stringify(ruleBasedStrategy, null, 2)}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 4000,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      return ruleBasedStrategy;
    }

    const enhanced = JSON.parse(content) as OutreachStrategy;

    // Preserve critical metadata fields from rule-based strategy
    enhanced.version = ruleBasedStrategy.version;
    enhanced.generatedAt = ruleBasedStrategy.generatedAt;
    enhanced.hcpId = ruleBasedStrategy.hcpId;
    enhanced.hcpNpi = ruleBasedStrategy.hcpNpi;
    enhanced.hcpName = ruleBasedStrategy.hcpName;
    enhanced.persona = ruleBasedStrategy.persona;

    return enhanced;
  } catch (error) {
    console.error("OpenAI strategy generation failed, falling back to rule-based:", error);
    return generateStrategy(context);
  }
}

// ─── Persistence ────────────────────────────────────────────────────────────

/**
 * Generate and persist an outreach strategy for an HCP.
 * Returns the strategy and whether it was freshly generated or retrieved from cache.
 */
export async function generateAndPersistStrategy(
  hcpId: string,
  options: { forceRegenerate?: boolean; useAI?: boolean } = {}
): Promise<GenerateStrategyResponse> {
  const { forceRegenerate = false, useAI = false } = options;

  // Check for existing strategy if not forcing regeneration
  if (!forceRegenerate) {
    const existing = await prisma.outreachPlan.findFirst({
      where: { hcpId, status: { in: ["draft", "active"] } },
      orderBy: { updatedAt: "desc" },
    });

    if (existing?.strategy) {
      return {
        success: true,
        strategy: existing.strategy as unknown as OutreachStrategy,
        cached: true,
      };
    }
  }

  // Assemble context
  const context = await assembleHcpContext(hcpId);
  if (!context) {
    return {
      success: false,
      error: `HCP profile not found: ${hcpId}`,
      cached: false,
    };
  }

  // Generate strategy
  const strategy = useAI
    ? await generateStrategyWithAI(context)
    : generateStrategy(context);

  // Persist to database
  await prisma.outreachPlan.create({
    data: {
      hcpId,
      persona: strategy.persona as object,
      strategy: strategy as unknown as object,
      channelMix: strategy.channelMix
        .filter((c) => c.available)
        .sort((a, b) => a.rank - b.rank)
        .map((c) => c.channel),
      status: "draft",
    },
  });

  return {
    success: true,
    strategy,
    cached: false,
  };
}

/**
 * Generate outreach strategies for a batch of HCPs.
 */
export async function generateStrategiesBatch(
  hcpIds: string[],
  options: { forceRegenerate?: boolean; useAI?: boolean } = {}
): Promise<{
  total: number;
  generated: number;
  failed: number;
  results: Array<{ hcpId: string; success: boolean; error?: string }>;
}> {
  const results: Array<{ hcpId: string; success: boolean; error?: string }> = [];
  let generated = 0;
  let failed = 0;

  for (const hcpId of hcpIds) {
    try {
      const result = await generateAndPersistStrategy(hcpId, options);
      if (result.success) {
        generated++;
        results.push({ hcpId, success: true });
      } else {
        failed++;
        results.push({ hcpId, success: false, error: result.error });
      }
    } catch (error) {
      failed++;
      results.push({
        hcpId,
        success: false,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return {
    total: hcpIds.length,
    generated,
    failed,
    results,
  };
}

// ─── Exports for testing ────────────────────────────────────────────────────

export const _internal = {
  deriveChannelAvailability,
  derivePrescribingBehavior,
  deriveEngagementHistory,
  generateChannelMix,
  generateMessagingThemes,
  generateContentToneStyle,
  generateCadence,
  generateConversationStarters,
  generateObjectionHandling,
  generateStrategySummary,
  generateStyleNotes,
  PERSONA_DEFINITIONS,
};
