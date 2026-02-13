/**
 * Types for the personalized outreach strategy generator.
 *
 * Defines the structured output format consumed by downstream channel modules.
 */

// ─── Channel Types ──────────────────────────────────────────────────────────

export type OutreachChannel = "email" | "sms" | "direct_mail" | "social" | "in_person";

export interface ChannelRecommendation {
  /** The outreach channel */
  channel: OutreachChannel;
  /** Priority rank (1 = highest priority) */
  rank: number;
  /** Why this channel is recommended for this HCP */
  reasoning: string;
  /** Whether we have confirmed availability for this channel */
  available: boolean;
  /** Estimated effectiveness score 0–100 */
  effectivenessScore: number;
}

// ─── Messaging ──────────────────────────────────────────────────────────────

export interface MessagingTheme {
  /** The topic or angle (e.g., "Recent clinical trial results") */
  topic: string;
  /** Why this theme resonates with the HCP */
  rationale: string;
  /** Priority: primary, secondary, or tertiary */
  priority: "primary" | "secondary" | "tertiary";
}

// ─── Tone & Style ───────────────────────────────────────────────────────────

export type FormalityLevel = "formal" | "semi_formal" | "casual";
export type ContentDensity = "data_heavy" | "balanced" | "narrative";
export type ClinicalTone = "clinical" | "conversational" | "hybrid";

export interface ContentToneStyle {
  /** How formal the communication should be */
  formality: FormalityLevel;
  /** Whether to lean data-heavy or narrative */
  contentDensity: ContentDensity;
  /** Clinical vs conversational register */
  clinicalTone: ClinicalTone;
  /** Additional style guidance for content generation */
  styleNotes: string;
}

// ─── Cadence ────────────────────────────────────────────────────────────────

export type FrequencyUnit = "daily" | "weekly" | "bi_weekly" | "monthly" | "quarterly";

export interface OutreachCadence {
  /** Recommended frequency */
  frequency: FrequencyUnit;
  /** Best day(s) of the week */
  preferredDays: string[];
  /** Best time of day */
  preferredTimeOfDay: "morning" | "midday" | "afternoon" | "evening";
  /** Reasoning behind the timing recommendation */
  reasoning: string;
}

// ─── Conversation Starters ──────────────────────────────────────────────────

export interface ConversationStarter {
  /** The talking point or opener */
  topic: string;
  /** The suggested opening line or talking point text */
  suggestedText: string;
  /** What data informed this starter */
  source: "publication" | "clinical_trial" | "prescribing_pattern" | "affiliation" | "general";
  /** Relevance score 0–100 */
  relevanceScore: number;
}

// ─── Objection Handling ─────────────────────────────────────────────────────

export interface ObjectionHandler {
  /** The predicted objection */
  objection: string;
  /** The recommended response */
  response: string;
  /** What evidence supports this objection prediction */
  evidenceBasis: string;
  /** Likelihood this objection will arise: high, medium, low */
  likelihood: "high" | "medium" | "low";
}

// ─── Full Outreach Strategy ─────────────────────────────────────────────────

export interface OutreachStrategy {
  /** Unique strategy version identifier */
  version: string;
  /** ISO timestamp of when this strategy was generated */
  generatedAt: string;
  /** HCP ID this strategy is for */
  hcpId: string;
  /** HCP NPI number */
  hcpNpi: string;
  /** Display name for reference */
  hcpName: string;
  /** The archetype/persona classification */
  persona: HcpPersona;
  /** Ranked channel recommendations */
  channelMix: ChannelRecommendation[];
  /** Key messaging themes */
  messagingThemes: MessagingTheme[];
  /** Tone and style guidance */
  contentToneStyle: ContentToneStyle;
  /** Outreach cadence recommendation */
  cadence: OutreachCadence;
  /** Specific conversation starters */
  conversationStarters: ConversationStarter[];
  /** Predicted objections with responses */
  objectionHandling: ObjectionHandler[];
  /** Summary paragraph describing the overall approach */
  strategySummary: string;
}

// ─── HCP Persona / Archetype ────────────────────────────────────────────────

export type HcpArchetype =
  | "academic_researcher"
  | "community_practitioner"
  | "hospital_leader"
  | "early_adopter"
  | "conservative_prescriber"
  | "digital_native"
  | "high_volume_prescriber"
  | "kol_influencer";

export interface HcpPersona {
  /** The archetype classification */
  archetype: HcpArchetype;
  /** Human-readable label */
  label: string;
  /** Description of this persona */
  description: string;
  /** Key traits that define this persona */
  traits: string[];
}

// ─── Input Context ──────────────────────────────────────────────────────────

/** Channel availability derived from HCP data */
export interface ChannelAvailability {
  email: boolean;
  phone: boolean;
  sms: boolean;
  linkedin: boolean;
  twitter: boolean;
  doximity: boolean;
  directMail: boolean;
}

/** Engagement history summary */
export interface EngagementHistory {
  totalInteractions: number;
  lastInteractionDate?: string;
  preferredChannel?: OutreachChannel;
  responseRate?: number;
  channels: Record<string, number>;
}

/** Prescribing behavior summary */
export interface PrescribingBehavior {
  topTherapeuticAreas: string[];
  prescribingVolume: "high" | "medium" | "low";
  brandVsGeneric: "brand_leaning" | "generic_leaning" | "balanced";
  competitiveProducts: string[];
  totalClaims?: number;
}

/** Full context assembled from HCP profile for strategy generation */
export interface HcpStrategyContext {
  hcpId: string;
  npi: string;
  firstName: string;
  lastName: string;
  credentials?: string;
  gender?: string;
  primarySpecialty?: string;
  subSpecialty?: string;
  yearsInPractice?: number;
  medicalSchool?: string;
  boardCertifications: string[];
  affiliations: Array<{
    organizationName: string;
    type: string;
    role?: string;
    isPrimary: boolean;
  }>;
  publications: Array<{
    title: string;
    journal?: string;
    year?: number;
    therapeuticArea?: string;
    meshTerms: string[];
  }>;
  clinicalTrials: Array<{
    title: string;
    phase?: string;
    condition?: string;
    intervention?: string;
    role?: string;
    status?: string;
  }>;
  channelAvailability: ChannelAvailability;
  prescribingBehavior: PrescribingBehavior;
  engagementHistory: EngagementHistory;
  isKol: boolean;
}

// ─── API Request / Response ─────────────────────────────────────────────────

export interface GenerateStrategyRequest {
  /** HCP profile ID */
  hcpId: string;
  /** Force regeneration even if a strategy already exists */
  forceRegenerate?: boolean;
}

export interface GenerateStrategyResponse {
  success: boolean;
  strategy?: OutreachStrategy;
  error?: string;
  /** Whether the strategy was freshly generated or retrieved from cache */
  cached: boolean;
}

export interface BatchGenerateRequest {
  /** List of HCP IDs to generate strategies for */
  hcpIds: string[];
  /** Force regeneration for all */
  forceRegenerate?: boolean;
}

export interface BatchGenerateResponse {
  success: boolean;
  total: number;
  generated: number;
  failed: number;
  results: Array<{
    hcpId: string;
    success: boolean;
    error?: string;
  }>;
}
