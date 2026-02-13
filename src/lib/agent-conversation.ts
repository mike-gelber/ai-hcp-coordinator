/**
 * Agent Conversation Generator
 *
 * Generates a simulated two-agent dialogue about an HCP profile and
 * their outreach strategy. The two agents are:
 *
 * - **Research Agent ("Scout")**: Analyzes the HCP profile, surfaces key
 *   insights about their background, publications, prescribing patterns,
 *   and digital presence.
 *
 * - **Strategy Agent ("Strategist")**: Takes Scout's findings and formulates
 *   a personalized outreach plan with channel recommendations, messaging
 *   themes, cadence, and objection handling.
 *
 * The conversation is generated deterministically from the profile data
 * so it's consistent and reproducible for demo purposes.
 */

import type { DemoHcpProfile } from "@/lib/demo-seed";

// ─── Types ──────────────────────────────────────────────────────────────────

export type AgentRole = "scout" | "strategist" | "system";

export interface AgentMessage {
  id: string;
  role: AgentRole;
  agentName: string;
  content: string;
  /** Delay in ms before this message appears (for streaming effect) */
  delay: number;
}

export interface AgentConversationData {
  hcpName: string;
  messages: AgentMessage[];
}

// ─── Persona Classification (mirrors backend) ──────────────────────────────

type Archetype =
  | "academic_researcher"
  | "community_practitioner"
  | "hospital_leader"
  | "early_adopter"
  | "conservative_prescriber"
  | "digital_native"
  | "high_volume_prescriber"
  | "kol_influencer";

interface PersonaResult {
  archetype: Archetype;
  label: string;
}

function classifyPersonaFromDemo(profile: DemoHcpProfile): PersonaResult {
  const scores: Record<Archetype, number> = {
    academic_researcher: 0,
    community_practitioner: 0,
    hospital_leader: 0,
    early_adopter: 0,
    conservative_prescriber: 0,
    digital_native: 0,
    high_volume_prescriber: 0,
    kol_influencer: 0,
  };

  const pubs = profile.digitalPresence.publicationCount;
  if (pubs > 5) scores.academic_researcher += 3;
  if (pubs > 15) scores.academic_researcher += 2;

  if (profile.digitalPresence.isKol) scores.kol_influencer += 5;
  if (pubs > 20) scores.kol_influencer += 3;
  if (profile.digitalPresence.hasTwitter) scores.kol_influencer += 1;
  if (profile.digitalPresence.hasLinkedIn) scores.kol_influencer += 1;

  const role = profile.affiliation.role.toLowerCase();
  if (/chief|director|chair|head|dean/.test(role)) scores.hospital_leader += 5;
  if (profile.yearsInPractice > 20) scores.hospital_leader += 2;
  if (profile.affiliation.type === "hospital") scores.hospital_leader += 1;

  const digitalCount = [
    profile.digitalPresence.hasLinkedIn,
    profile.digitalPresence.hasTwitter,
    profile.digitalPresence.hasDoximity,
  ].filter(Boolean).length;
  if (digitalCount >= 2) scores.digital_native += 3;
  if (digitalCount >= 3) scores.digital_native += 2;
  if (profile.yearsInPractice < 10) scores.digital_native += 2;

  if (profile.prescribingProfile.prescribingVolume === "high")
    scores.high_volume_prescriber += 5;

  const communitySpecialties = ["Family Medicine", "Internal Medicine", "Pediatrics"];
  if (communitySpecialties.includes(profile.primarySpecialty))
    scores.community_practitioner += 3;
  if (profile.affiliation.type === "group_practice")
    scores.community_practitioner += 2;
  if (pubs < 3) scores.community_practitioner += 1;

  if (profile.prescribingProfile.brandVsGeneric === "generic-leaning")
    scores.conservative_prescriber += 3;
  if (profile.yearsInPractice > 25) scores.conservative_prescriber += 2;
  if (digitalCount === 0) scores.conservative_prescriber += 1;

  if (profile.prescribingProfile.brandVsGeneric === "brand-leaning")
    scores.early_adopter += 2;
  if (profile.yearsInPractice < 15) scores.early_adopter += 1;
  if (digitalCount >= 1) scores.early_adopter += 1;

  const sorted = Object.entries(scores).sort(([, a], [, b]) => b - a);
  const archetype = sorted[0][0] as Archetype;

  const labels: Record<Archetype, string> = {
    academic_researcher: "Academic Researcher",
    community_practitioner: "Community Practitioner",
    hospital_leader: "Hospital Leader",
    early_adopter: "Early Adopter",
    conservative_prescriber: "Conservative Prescriber",
    digital_native: "Digital Native",
    high_volume_prescriber: "High-Volume Prescriber",
    kol_influencer: "Key Opinion Leader",
  };

  return { archetype, label: labels[archetype] };
}

// ─── Channel Recommendations ────────────────────────────────────────────────

function getTopChannels(
  profile: DemoHcpProfile,
  persona: PersonaResult
): string[] {
  const channelScores: Record<string, number> = {
    email: 70,
    "in-person": 60,
    social: 40,
    "direct mail": 50,
    SMS: 30,
  };

  // Adjust by persona
  switch (persona.archetype) {
    case "academic_researcher":
      channelScores.email += 15;
      channelScores["in-person"] += 20;
      break;
    case "community_practitioner":
      channelScores["in-person"] += 30;
      channelScores["direct mail"] += 15;
      break;
    case "hospital_leader":
      channelScores["in-person"] += 30;
      channelScores.email += 10;
      break;
    case "digital_native":
      channelScores.social += 50;
      channelScores.email += 12;
      channelScores.SMS += 40;
      break;
    case "high_volume_prescriber":
      channelScores.email += 10;
      channelScores.SMS += 45;
      break;
    case "kol_influencer":
      channelScores["in-person"] += 30;
      channelScores.email += 15;
      channelScores.social += 40;
      break;
    case "conservative_prescriber":
      channelScores["in-person"] += 25;
      channelScores["direct mail"] += 25;
      break;
    case "early_adopter":
      channelScores.email += 10;
      channelScores.social += 38;
      channelScores.SMS += 35;
      break;
  }

  // Boost social if digital presence
  if (profile.digitalPresence.hasLinkedIn) channelScores.social += 10;
  if (profile.digitalPresence.hasTwitter) channelScores.social += 5;

  return Object.entries(channelScores)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([ch]) => ch);
}

// ─── Conversation Generator ─────────────────────────────────────────────────

export function generateAgentConversation(
  profile: DemoHcpProfile
): AgentConversationData {
  const persona = classifyPersonaFromDemo(profile);
  const topChannels = getTopChannels(profile, persona);
  const messages: AgentMessage[] = [];
  let msgId = 0;
  let delay = 0;

  const STEP = 600; // ms between messages for animation

  function addMsg(role: AgentRole, content: string) {
    const name =
      role === "scout"
        ? "Scout"
        : role === "strategist"
          ? "Strategist"
          : "System";
    messages.push({
      id: `msg-${msgId++}`,
      role,
      agentName: name,
      content,
      delay,
    });
    delay += STEP;
  }

  // ── System kick-off
  addMsg(
    "system",
    `Starting outreach strategy session for **Dr. ${profile.firstName} ${profile.lastName}** (NPI: ${profile.npi})`
  );

  // ── Scout: profile overview
  addMsg(
    "scout",
    `I've pulled the full profile for **Dr. ${profile.lastName}**. Here's the overview:\n\n` +
    `- **Specialty:** ${profile.primarySpecialty}\n` +
    `- **Credentials:** ${profile.credentials}\n` +
    `- **Experience:** ${profile.yearsInPractice} years in practice\n` +
    `- **Medical School:** ${profile.medicalSchool}\n` +
    `- **Location:** ${profile.location.city}, ${profile.location.state}`
  );

  // ── Scout: affiliation
  addMsg(
    "scout",
    `They're currently serving as **${profile.affiliation.role}** at ` +
    `**${profile.affiliation.organizationName}** ` +
    `(${profile.affiliation.type.replace("_", " ")}). ` +
    (profile.affiliation.type === "academic"
      ? "This academic affiliation suggests they value evidence-based approaches and peer-reviewed data."
      : profile.affiliation.type === "hospital"
        ? "Being at a hospital setting means they likely have influence on formulary decisions and institutional protocols."
        : "This group practice setting means they're focused on practical patient outcomes and efficiency.")
  );

  // ── Strategist: initial reaction
  addMsg(
    "strategist",
    `Interesting. ${profile.yearsInPractice > 20
      ? "With over two decades of experience, we're dealing with a very established physician. We need to approach with peer-level respect."
      : profile.yearsInPractice > 10
        ? "Mid-career physician — experienced enough to have strong opinions, but still actively evolving their practice."
        : "Earlier in their career — likely more open to new information and digital engagement."
    } Let me hear more about their prescribing patterns and digital footprint.`
  );

  // ── Scout: prescribing data
  addMsg(
    "scout",
    `Here's what I found on prescribing behavior:\n\n` +
    `- **Top Therapeutic Area:** ${profile.prescribingProfile.topTherapeuticArea}\n` +
    `- **Volume:** ${profile.prescribingProfile.prescribingVolume} prescriber\n` +
    `- **Brand vs Generic:** ${profile.prescribingProfile.brandVsGeneric.replace("-", " ")}\n\n` +
    (profile.prescribingProfile.prescribingVolume === "high"
      ? "They're seeing a high volume of patients — time is their scarcest resource."
      : profile.prescribingProfile.prescribingVolume === "low"
        ? "Lower volume suggests they may spend more time per patient and be more deliberate in prescribing decisions."
        : "Moderate volume — they have a solid patient base but aren't overwhelmed.")
  );

  // ── Scout: digital presence
  const digitalPlatforms: string[] = [];
  if (profile.digitalPresence.hasLinkedIn) digitalPlatforms.push("LinkedIn");
  if (profile.digitalPresence.hasTwitter) digitalPlatforms.push("Twitter/X");
  if (profile.digitalPresence.hasDoximity) digitalPlatforms.push("Doximity");

  addMsg(
    "scout",
    `Digital presence analysis:\n\n` +
    `- **Active platforms:** ${digitalPlatforms.length > 0 ? digitalPlatforms.join(", ") : "None detected"}\n` +
    `- **Publications:** ${profile.digitalPresence.publicationCount} published works\n` +
    `- **KOL Status:** ${profile.digitalPresence.isKol ? "Yes — recognized Key Opinion Leader" : "No"}\n\n` +
    (profile.digitalPresence.publicationCount > 10
      ? "Heavy publication record — they're research-oriented and will respond to evidence-based engagement."
      : profile.digitalPresence.publicationCount > 0
        ? "Some publication activity — they engage with the academic side but aren't primarily research-driven."
        : "No publications found — they're primarily a clinical practitioner.")
  );

  // ── Strategist: persona classification
  addMsg(
    "strategist",
    `Based on everything Scout has gathered, I'm classifying Dr. ${profile.lastName} as a **"${persona.label}"** archetype.\n\n` +
    getPersonaExplanation(profile, persona)
  );

  // ── Strategist: channel recommendation
  addMsg(
    "strategist",
    `For channel strategy, I recommend this priority order:\n\n` +
    `1. **${topChannels[0]}** — primary channel\n` +
    `2. **${topChannels[1]}** — secondary channel\n` +
    `3. **${topChannels[2]}** — supplementary channel\n\n` +
    getChannelReasoning(profile, persona, topChannels)
  );

  // ── Scout: follow-up insight
  addMsg(
    "scout",
    getScoutInsight(profile, persona)
  );

  // ── Strategist: messaging & tone
  addMsg(
    "strategist",
    `Here's my recommendation on messaging and tone:\n\n` +
    getMessagingGuidance(profile, persona)
  );

  // ── Strategist: cadence
  addMsg(
    "strategist",
    getCadenceRecommendation(profile, persona)
  );

  // ── Strategist: objection prep
  addMsg(
    "strategist",
    `Finally, we should prepare for likely objections:\n\n` +
    getObjectionPrep(profile, persona)
  );

  // ── System: wrap-up
  addMsg(
    "system",
    `Strategy session complete. Outreach plan for Dr. ${profile.lastName} has been generated with ${messages.length - 1} insights across persona classification, channel mix, messaging, cadence, and objection handling.`
  );

  return {
    hcpName: `Dr. ${profile.firstName} ${profile.lastName}`,
    messages,
  };
}

// ─── Content Helpers ────────────────────────────────────────────────────────

function getPersonaExplanation(
  profile: DemoHcpProfile,
  persona: PersonaResult
): string {
  switch (persona.archetype) {
    case "academic_researcher":
      return (
        `With ${profile.digitalPresence.publicationCount} publications and an academic affiliation, ` +
        `they live in the world of evidence and data. We need to lead with clinical rigor — cite specific endpoints, ` +
        `p-values, and study designs. Generic marketing messages will fall flat.`
      );
    case "kol_influencer":
      return (
        `This is someone who shapes opinion in their field. ` +
        `With ${profile.digitalPresence.publicationCount} publications and recognized KOL status, ` +
        `they need to be treated as a thought partner, not a target. Advisory board invitations and ` +
        `exclusive data previews will resonate far more than standard detailing.`
      );
    case "community_practitioner":
      return (
        `As a ${profile.primarySpecialty} practitioner in a ${profile.affiliation.type.replace("_", " ")} setting, ` +
        `they're focused on practical patient outcomes. They want to know "how does this help my patients tomorrow?" ` +
        `not "what were the Phase III endpoints?" Real-world case examples will be our strongest tool.`
      );
    case "hospital_leader":
      return (
        `Their role as ${profile.affiliation.role} gives them institutional influence. ` +
        `They think in terms of formulary impact, cost-effectiveness, and population health outcomes. ` +
        `We need to frame everything through an institutional lens.`
      );
    case "digital_native":
      return (
        `Active on ${[profile.digitalPresence.hasLinkedIn && "LinkedIn", profile.digitalPresence.hasTwitter && "Twitter", profile.digitalPresence.hasDoximity && "Doximity"].filter(Boolean).join(", ")} ` +
        `with ${profile.yearsInPractice} years in practice — they're comfortable with digital engagement. ` +
        `We can leverage multiple digital touchpoints. Short-form content, infographics, and digital resource hubs will work well.`
      );
    case "high_volume_prescriber":
      return (
        `As a ${profile.prescribingProfile.prescribingVolume}-volume prescriber, ` +
        `time is their most precious resource. Every communication needs to be ultra-concise and high-impact. ` +
        `If we can't deliver value in 30 seconds, we've lost them.`
      );
    case "conservative_prescriber":
      return (
        `${profile.yearsInPractice} years of experience plus a ${profile.prescribingProfile.brandVsGeneric.replace("-", " ")} prescribing pattern ` +
        `tells me they don't switch easily. We need to build trust slowly with robust safety data ` +
        `and long-term outcomes evidence. Pushing too hard will backfire.`
      );
    case "early_adopter":
      return (
        `Their ${profile.prescribingProfile.brandVsGeneric.replace("-", " ")} prescribing tendency and digital engagement ` +
        `suggest they're open to innovation. They want to be first to know about new approaches. ` +
        `We should position our outreach around novelty, differentiation, and being ahead of the curve.`
      );
  }
}

function getChannelReasoning(
  profile: DemoHcpProfile,
  persona: PersonaResult,
  channels: string[]
): string {
  const lines: string[] = [];

  if (channels[0] === "in-person") {
    lines.push(
      `In-person is primary because ${persona.archetype === "kol_influencer"
        ? "KOLs value face-to-face relationships and exclusive access."
        : persona.archetype === "hospital_leader"
          ? "institutional leaders respond best to executive-level meetings."
          : "building personal rapport is critical for this physician's archetype."}`
    );
  } else if (channels[0] === "email") {
    lines.push(
      `Email leads because ${persona.archetype === "academic_researcher"
        ? "researchers engage deeply with detailed email content — we can include study data and citations."
        : "it allows us to deliver concise, scannable content they can review on their schedule."}`
    );
  } else if (channels[0] === "social") {
    lines.push(
      `Social channels lead because they're already active on ${[profile.digitalPresence.hasLinkedIn && "LinkedIn", profile.digitalPresence.hasTwitter && "Twitter"].filter(Boolean).join(" and ")} — we meet them where they already are.`
    );
  }

  if (profile.location.phone) {
    lines.push(`We have their phone number (${profile.location.phone}), so SMS and call follow-ups are possible.`);
  }

  if (!profile.digitalPresence.hasLinkedIn && !profile.digitalPresence.hasTwitter) {
    lines.push("Limited social media presence means we should avoid over-investing in social channels.");
  }

  return lines.join(" ");
}

function getScoutInsight(
  profile: DemoHcpProfile,
  persona: PersonaResult
): string {
  if (profile.digitalPresence.isKol) {
    return (
      `One more thing — Dr. ${profile.lastName} is flagged as a Key Opinion Leader. ` +
      `They likely speak at conferences and influence their peers' prescribing decisions. ` +
      `Any engagement we create could have a multiplier effect across their network.`
    );
  }

  if (profile.digitalPresence.publicationCount > 10) {
    return (
      `Worth noting — with ${profile.digitalPresence.publicationCount} publications, ` +
      `Dr. ${profile.lastName} is actively contributing to the literature in ${profile.prescribingProfile.topTherapeuticArea}. ` +
      `Referencing their specific work in our outreach would significantly boost credibility and engagement.`
    );
  }

  if (profile.prescribingProfile.prescribingVolume === "high") {
    return (
      `Something to keep in mind — as a high-volume prescriber in ${profile.prescribingProfile.topTherapeuticArea}, ` +
      `Dr. ${profile.lastName} has significant impact on patient outcomes at scale. ` +
      `Even a small shift in their prescribing behavior would represent a meaningful opportunity.`
    );
  }

  if (persona.archetype === "conservative_prescriber") {
    return (
      `I should flag that Dr. ${profile.lastName}'s ${profile.prescribingProfile.brandVsGeneric.replace("-", " ")} pattern ` +
      `has been consistent. They may have had negative experiences with branded products in the past, ` +
      `or they may be under institutional pressure to prescribe generics. Worth probing gently.`
    );
  }

  return (
    `Additional context: Dr. ${profile.lastName} has been in ${profile.location.city}, ${profile.location.state} ` +
    `for their career, affiliated with ${profile.affiliation.organizationName}. ` +
    `Local market dynamics and regional prescribing trends could influence their receptivity. ` +
    `I'd recommend checking our regional field intelligence before the first touchpoint.`
  );
}

function getMessagingGuidance(
  profile: DemoHcpProfile,
  persona: PersonaResult
): string {
  const area = profile.prescribingProfile.topTherapeuticArea;

  switch (persona.archetype) {
    case "academic_researcher":
      return (
        `- **Tone:** Formal, peer-to-peer, evidence-first\n` +
        `- **Lead with:** Recent clinical data in ${area}, mechanism of action deep-dives\n` +
        `- **Avoid:** Casual language, unsubstantiated claims\n` +
        `- **Key angle:** "New data that complements your published work in ${area}"`
      );
    case "kol_influencer":
      return (
        `- **Tone:** Respectful, exclusive, partnership-oriented\n` +
        `- **Lead with:** Advisory board invitations, pre-publication data access\n` +
        `- **Avoid:** Standard sales pitches — they see right through them\n` +
        `- **Key angle:** "Your expertise would be invaluable in shaping our approach to ${area}"`
      );
    case "community_practitioner":
      return (
        `- **Tone:** Warm, practical, patient-focused\n` +
        `- **Lead with:** Real-world case examples, patient support programs\n` +
        `- **Avoid:** Dense clinical data — keep it actionable\n` +
        `- **Key angle:** "Here's how this helps your ${area} patients specifically"`
      );
    case "hospital_leader":
      return (
        `- **Tone:** Professional, strategic, institutional\n` +
        `- **Lead with:** Health economics data, formulary value propositions\n` +
        `- **Avoid:** Purely clinical messaging — frame in institutional terms\n` +
        `- **Key angle:** "Institutional impact on ${area} outcomes and cost-effectiveness"`
      );
    case "digital_native":
      return (
        `- **Tone:** Concise, modern, visually engaging\n` +
        `- **Lead with:** Infographics, short-form content, digital tools\n` +
        `- **Avoid:** Long-form text-heavy emails\n` +
        `- **Key angle:** "Quick update on ${area} — here's what's new in 60 seconds"`
      );
    case "high_volume_prescriber":
      return (
        `- **Tone:** Ultra-concise, respectful of their time\n` +
        `- **Lead with:** One-line value prop, quick-reference dosing cards\n` +
        `- **Avoid:** Anything that takes more than 30 seconds to consume\n` +
        `- **Key angle:** "30-second summary: new option for your ${area} patients"`
      );
    case "conservative_prescriber":
      return (
        `- **Tone:** Measured, evidence-heavy, reassuring\n` +
        `- **Lead with:** Long-term safety data, head-to-head comparisons\n` +
        `- **Avoid:** Pressure tactics, urgency language\n` +
        `- **Key angle:** "5-year safety data you may find relevant for your ${area} approach"`
      );
    case "early_adopter":
      return (
        `- **Tone:** Energetic, innovation-forward\n` +
        `- **Lead with:** What's new, what's different, what's coming next\n` +
        `- **Avoid:** "Me-too" messaging — emphasize differentiation\n` +
        `- **Key angle:** "First look at a novel approach to ${area}"`
      );
  }
}

function getCadenceRecommendation(
  profile: DemoHcpProfile,
  persona: PersonaResult
): string {
  const cadenceMap: Record<Archetype, { freq: string; days: string; time: string }> = {
    academic_researcher: { freq: "Bi-weekly", days: "Tuesday/Thursday", time: "mornings" },
    community_practitioner: { freq: "Bi-weekly", days: "Tuesday/Wednesday", time: "midday (lunch hour)" },
    hospital_leader: { freq: "Monthly", days: "Monday/Tuesday", time: "mornings" },
    early_adopter: { freq: "Weekly", days: "Wednesday/Thursday", time: "afternoons" },
    conservative_prescriber: { freq: "Monthly", days: "Tuesdays", time: "mornings" },
    digital_native: { freq: "Weekly", days: "Mon/Wed/Fri", time: "mornings" },
    high_volume_prescriber: { freq: "Bi-weekly", days: "Thursday/Friday", time: "afternoons" },
    kol_influencer: { freq: "Bi-weekly", days: "Tuesday/Wednesday", time: "mornings" },
  };

  const c = cadenceMap[persona.archetype];

  return (
    `For cadence, I recommend **${c.freq}** touchpoints, targeting **${c.days}** **${c.time}**.\n\n` +
    (persona.archetype === "high_volume_prescriber"
      ? `End-of-week afternoons catch them when patient load starts to ease. Don't over-communicate — every touchpoint must deliver clear value or we'll get blocked.`
      : persona.archetype === "conservative_prescriber"
        ? `Monthly is key here — too frequent and we'll trigger pushback. Each interaction needs to introduce substantial new evidence to justify their time.`
        : persona.archetype === "digital_native"
          ? `Digital natives process information in bursts, so multiple light-touch weekly contacts work well. Keep each one short and valuable.`
          : persona.archetype === "kol_influencer"
            ? `KOLs have packed calendars. Bi-weekly keeps us present without being a nuisance. Always lead with something exclusive or high-value.`
            : `This cadence respects their schedule while maintaining consistent presence. We can adjust up or down based on engagement signals after the first 4 weeks.`)
  );
}

function getObjectionPrep(
  profile: DemoHcpProfile,
  persona: PersonaResult
): string {
  const objections: string[] = [];

  // Universal
  objections.push(
    `**"I'm happy with my current approach"** → Acknowledge their expertise, then position as an *addition* to their toolkit, not a replacement. ` +
    `Focus on the patient subgroup where current approaches fall short.`
  );

  // Persona-specific
  switch (persona.archetype) {
    case "academic_researcher":
      objections.push(
        `**"The evidence isn't strong enough"** → Have Phase III data, meta-analyses, and subgroup analyses ready. ` +
        `Offer to share the full protocol. Invite them to critique the methodology — they'll respect that.`
      );
      break;
    case "community_practitioner":
      objections.push(
        `**"My patients can't afford it"** → Lead with patient assistance programs and copay support details. ` +
        `Have specific out-of-pocket cost scenarios ready for their patient demographics.`
      );
      break;
    case "hospital_leader":
      objections.push(
        `**"It's not on our formulary"** → Offer a health economics dossier and propose a P&T committee presentation. ` +
        `Frame in terms of total cost of care including reduced readmissions.`
      );
      break;
    case "digital_native":
      objections.push(
        `**"I can find all this online"** → Acknowledge their resourcefulness, then offer curated, ` +
        `non-public data and direct MSL access as value-adds they can't get elsewhere.`
      );
      break;
    case "high_volume_prescriber":
      objections.push(
        `**"I don't have time"** → Respect the constraint. Have a 30-second elevator pitch ready ` +
        `plus a one-page leave-behind. Offer to schedule a 3-minute call at their convenience.`
      );
      break;
    case "conservative_prescriber":
      objections.push(
        `**"I need more long-term safety data"** → This is legitimate — have the longest-duration safety data at your fingertips. ` +
        `Post-marketing surveillance reports and real-world evidence studies are your best tools here.`
      );
      break;
    case "kol_influencer":
      objections.push(
        `**"I have concerns about the trial design"** → Welcome the critique. Offer an advisory role where their feedback ` +
        `can shape future study design. This turns an objection into an engagement opportunity.`
      );
      break;
    case "early_adopter":
      objections.push(
        `**"What makes this truly different?"** → Have a crisp differentiation story ready. ` +
        `Competitive landscape analysis and mechanism-of-action comparisons will satisfy their curiosity.`
      );
      break;
  }

  // Brand vs generic specific
  if (profile.prescribingProfile.brandVsGeneric === "generic-leaning") {
    objections.push(
      `**"The generic works fine"** → Don't challenge the generic head-on. Instead, focus on the specific patient subset ` +
      `where the generic doesn't achieve optimal outcomes. Let the clinical evidence do the persuading.`
    );
  }

  return objections.join("\n\n");
}
