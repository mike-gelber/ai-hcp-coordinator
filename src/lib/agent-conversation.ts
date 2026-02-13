/**
 * Agent conversation generator.
 *
 * Produces realistic, contextual dialogue between the Strategist and
 * Outreach Specialist agents based on HCP profile data.
 *
 * When OpenAI credentials are available, this can be upgraded to use
 * real LLM-powered conversations. For now it generates intelligent
 * template-based dialogues customized to each HCP.
 */

import type { DemoHcpProfile } from "@/lib/demo-seed";
import type { AgentMessage, AgentRole } from "@/types/agents";

// ─── Helpers ────────────────────────────────────────────────────────────────

function msgId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function isoNow(offsetMs = 0): string {
  return new Date(Date.now() + offsetMs).toISOString();
}

function msg(
  role: AgentRole,
  content: string,
  index: number,
  meta?: AgentMessage["metadata"],
): AgentMessage {
  return {
    id: msgId(),
    role,
    content,
    timestamp: isoNow(index * 2000), // 2s between messages
    metadata: meta,
  };
}

// ─── Channel Recommendations ────────────────────────────────────────────────

function getRecommendedChannels(profile: DemoHcpProfile): string[] {
  const channels: string[] = [];

  if (profile.digitalPresence.hasLinkedIn) channels.push("LinkedIn");
  if (profile.digitalPresence.hasTwitter) channels.push("Twitter/X");
  if (profile.digitalPresence.hasDoximity) channels.push("Doximity");

  // Always include some traditional channels
  channels.push("Email");
  if (profile.prescribingProfile.prescribingVolume === "high") {
    channels.push("In-Person Visit");
  }
  if (profile.digitalPresence.isKol) {
    channels.push("Conference Networking");
    channels.push("Advisory Board Invitation");
  }

  return channels;
}

function getEngagementTier(profile: DemoHcpProfile): string {
  if (profile.digitalPresence.isKol) return "Tier 1 — Key Opinion Leader";
  if (profile.prescribingProfile.prescribingVolume === "high")
    return "Tier 1 — High-Volume Prescriber";
  if (profile.prescribingProfile.prescribingVolume === "medium")
    return "Tier 2 — Medium-Volume Prescriber";
  return "Tier 3 — Emerging Prescriber";
}

function getPrescribingInsight(profile: DemoHcpProfile): string {
  const { brandVsGeneric, prescribingVolume, topTherapeuticArea } = profile.prescribingProfile;

  if (brandVsGeneric === "brand-leaning") {
    return `They show a brand-leaning prescribing pattern in ${topTherapeuticArea}, which suggests openness to novel branded therapies with strong clinical data.`;
  } else if (brandVsGeneric === "generic-leaning") {
    return `They lean heavily toward generics in ${topTherapeuticArea}. We'll need to lead with pharmacoeconomic data and head-to-head trial results to make a compelling case for branded alternatives.`;
  }
  return `Their prescribing in ${topTherapeuticArea} is balanced between branded and generic — they're evidence-driven and likely respond to strong real-world data.`;
}

function getDigitalInsight(profile: DemoHcpProfile): string {
  const parts: string[] = [];
  const dp = profile.digitalPresence;

  if (dp.publicationCount > 20) {
    parts.push(
      `With ${dp.publicationCount} publications, they're a prolific researcher and likely value clinical evidence and peer-reviewed data.`,
    );
  } else if (dp.publicationCount > 5) {
    parts.push(
      `They have ${dp.publicationCount} publications — academically active, which means they'll respond well to clinical trial data and peer discussions.`,
    );
  } else {
    parts.push(
      `Limited publication history (${dp.publicationCount} papers) suggests a primarily clinical focus. Practical, real-world outcomes data will resonate best.`,
    );
  }

  const socialChannels: string[] = [];
  if (dp.hasLinkedIn) socialChannels.push("LinkedIn");
  if (dp.hasTwitter) socialChannels.push("Twitter/X");
  if (dp.hasDoximity) socialChannels.push("Doximity");

  if (socialChannels.length > 0) {
    parts.push(
      `They're active on ${socialChannels.join(", ")}, giving us digital touchpoints for engagement.`,
    );
  } else {
    parts.push(
      `They have minimal social media presence, so traditional channels (email, in-person) will be our primary approach.`,
    );
  }

  return parts.join(" ");
}

// ─── Conversation Generator ─────────────────────────────────────────────────

/**
 * Generate a full agent dialogue for a given HCP profile.
 */
export function generateAgentDialogue(profile: DemoHcpProfile): AgentMessage[] {
  const channels = getRecommendedChannels(profile);
  const tier = getEngagementTier(profile);
  const prescribingInsight = getPrescribingInsight(profile);
  const digitalInsight = getDigitalInsight(profile);

  const fullName = `Dr. ${profile.firstName} ${profile.lastName}`;
  const messages: AgentMessage[] = [];
  let i = 0;

  // ── Message 1: Strategist opens with analysis ──
  messages.push(
    msg(
      "strategist",
      `I've completed my initial analysis of ${fullName} (${profile.credentials}), NPI ${profile.npi}. Let me walk you through what I've found.\n\n` +
        `**Profile Summary:**\n` +
        `- **Specialty:** ${profile.primarySpecialty} — ${profile.yearsInPractice} years in practice\n` +
        `- **Affiliation:** ${profile.affiliation.organizationName} (${profile.affiliation.role})\n` +
        `- **Location:** ${profile.location.city}, ${profile.location.state}\n` +
        `- **Engagement Tier:** ${tier}\n\n` +
        `**Key Prescribing Insights:**\n${prescribingInsight}\n\n` +
        `**Digital Footprint:**\n${digitalInsight}`,
      i++,
      {
        type: "analysis",
        confidence: 0.92,
        tags: ["profile-analysis", "initial-assessment"],
      },
    ),
  );

  // ── Message 2: Outreach Specialist responds with initial thoughts ──
  messages.push(
    msg(
      "outreach_specialist",
      `Great analysis. Based on this profile, here's my initial read on how to approach ${fullName}:\n\n` +
        `${
          profile.digitalPresence.isKol
            ? `Since they're a KOL with significant publications, we should position them as a thought partner rather than a target. Advisory board invitations and peer-to-peer speaker programs would be ideal entry points.`
            : profile.prescribingProfile.prescribingVolume === "high"
              ? `As a high-volume prescriber, they're a priority target. We should lead with clinical data that's directly relevant to their practice in ${profile.prescribingProfile.topTherapeuticArea}.`
              : `They're a growing prescriber with development potential. A lighter-touch educational approach will build the relationship over time.`
        }\n\n` +
        `What channels do you recommend I prioritize? I see potential with ${channels.slice(0, 3).join(", ")}.`,
      i++,
      {
        type: "question",
        channels: channels.slice(0, 3),
      },
    ),
  );

  // ── Message 3: Strategist provides channel strategy ──
  const primaryChannel = profile.digitalPresence.hasDoximity
    ? "Doximity"
    : profile.digitalPresence.hasLinkedIn
      ? "LinkedIn"
      : "Email";

  const secondaryChannel =
    profile.prescribingProfile.prescribingVolume === "high"
      ? "In-Person Visit"
      : profile.digitalPresence.hasTwitter
        ? "Twitter/X"
        : "Email";

  messages.push(
    msg(
      "strategist",
      `Here's my recommended channel strategy for ${fullName}:\n\n` +
        `**Primary Channel: ${primaryChannel}**\n` +
        `${
          primaryChannel === "Doximity"
            ? `Doximity is the gold standard for reaching physicians. They're active there, so we have a direct line to share clinical content and initiate peer-to-peer engagement.`
            : primaryChannel === "LinkedIn"
              ? `LinkedIn gives us a professional context to engage. We can share relevant clinical content and industry insights to build credibility before making a direct ask.`
              : `Email remains our most reliable channel. We'll craft a personalized, data-driven message that speaks directly to their practice in ${profile.prescribingProfile.topTherapeuticArea}.`
        }\n\n` +
        `**Secondary Channel: ${secondaryChannel}**\n` +
        `${
          secondaryChannel === "In-Person Visit"
            ? `Given their high prescribing volume, a well-prepared in-person visit at ${profile.affiliation.organizationName} would be highly impactful. Bring the latest ${profile.prescribingProfile.topTherapeuticArea} trial data.`
            : secondaryChannel === "Twitter/X"
              ? `They're active on Twitter/X — we can engage with their posts, share relevant content, and build familiarity before the formal outreach.`
              : `Follow up email with additional evidence and a clear call to action, such as a webinar invite or sample request.`
        }\n\n` +
        `**Timing:** ${
          profile.yearsInPractice > 20
            ? `As a senior physician, they likely have a packed schedule. Early morning (7-8 AM) or late afternoon (4-5 PM) emails tend to perform best.`
            : `Mid-career physicians often check messages during lunch breaks. Target 11 AM - 1 PM for initial outreach.`
        }\n\n` +
        `**Key Message Angle:** Focus on ${
          profile.prescribingProfile.brandVsGeneric === "generic-leaning"
            ? "cost-effectiveness data and formulary advantages"
            : profile.prescribingProfile.brandVsGeneric === "brand-leaning"
              ? "latest clinical trial outcomes and real-world evidence"
              : "balanced clinical and economic data"
        } in ${profile.prescribingProfile.topTherapeuticArea}.`,
      i++,
      {
        type: "recommendation",
        confidence: 0.88,
        channels: [primaryChannel, secondaryChannel],
        tags: ["channel-strategy", "timing", "messaging"],
      },
    ),
  );

  // ── Message 4: Outreach Specialist drafts the plan ──
  messages.push(
    msg(
      "outreach_specialist",
      `Perfect. I'm putting together the outreach sequence now. Here's the plan:\n\n` +
        `**Week 1 — Initial Contact:**\n` +
        `- ${primaryChannel}: ${
          primaryChannel === "Doximity"
            ? `Send a personalized connection request with a brief note referencing their work in ${profile.prescribingProfile.topTherapeuticArea} at ${profile.affiliation.organizationName}.`
            : primaryChannel === "LinkedIn"
              ? `Send a connection request with a personalized note mentioning their ${profile.primarySpecialty} expertise and a recent development in ${profile.prescribingProfile.topTherapeuticArea}.`
              : `Send a warm, personalized email that leads with a relevant clinical insight in ${profile.prescribingProfile.topTherapeuticArea}, referencing their practice context at ${profile.affiliation.organizationName}.`
        }\n\n` +
        `**Week 2 — Value Add:**\n` +
        `- Share a clinical brief or white paper on the latest advances in ${profile.prescribingProfile.topTherapeuticArea} treatment. ${
          profile.digitalPresence.publicationCount > 10
            ? `Given their research background, include references to recent meta-analyses and landmark trials.`
            : `Keep it practical — focus on real-world outcomes and patient case studies.`
        }\n\n` +
        `**Week 3 — Engagement:**\n` +
        `- ${secondaryChannel}: ${
          secondaryChannel === "In-Person Visit"
            ? `Schedule a visit at ${profile.affiliation.organizationName}. Prepare a focused 10-minute presentation on our latest ${profile.prescribingProfile.topTherapeuticArea} data.`
            : `Follow up on ${secondaryChannel} with additional context. Invite them to an upcoming ${profile.primarySpecialty} virtual roundtable.`
        }\n\n` +
        `**Week 4 — Close / Next Step:**\n` +
        `- ${
          profile.digitalPresence.isKol
            ? `Extend an advisory board or speaker program invitation.`
            : profile.prescribingProfile.prescribingVolume === "high"
              ? `Propose a meeting to discuss formulary considerations or sample program.`
              : `Send a follow-up summary and leave the door open for future engagement.`
        }\n\n` +
        `Shall I draft the initial message copy?`,
      i++,
      {
        type: "action",
        channels: [primaryChannel, secondaryChannel],
        tags: ["outreach-plan", "4-week-sequence"],
      },
    ),
  );

  // ── Message 5: Strategist refines with compliance notes ──
  messages.push(
    msg(
      "strategist",
      `The sequence looks solid. A few strategic refinements:\n\n` +
        `**Compliance Guardrails:**\n` +
        `- Ensure all clinical claims reference FDA-approved indications only — no off-label discussion\n` +
        `- Include required fair balance language in any materials shared\n` +
        `- Log all touchpoints for audit trail compliance\n\n` +
        `**Personalization Notes for ${fullName}:**\n` +
        `${
          profile.affiliation.type === "academic"
            ? `- Academic affiliation — lead with data rigor, cite specific trial designs and endpoints\n- They likely mentor residents, so peer influence multiplier is high`
            : profile.affiliation.type === "hospital"
              ? `- Hospital-based practice — consider formulary committee dynamics\n- Hospital protocols may constrain prescribing, so address formulary inclusion`
              : `- Group practice setting — decision-making may involve practice partners\n- Consider whether practice-level engagement would amplify impact`
        }\n` +
        `- ${
          profile.yearsInPractice > 25
            ? `Very experienced — avoid "teaching" tone. Position as peer discussion and mutual exchange of insights.`
            : profile.yearsInPractice > 15
              ? `Mid-career and likely in leadership. Appeal to their influence on department protocols and younger physicians.`
              : `Earlier in career — eager to learn but busy. Keep messages concise and data-rich.`
        }\n\n` +
        `Go ahead and draft the initial outreach. I'll review before we send.`,
      i++,
      {
        type: "recommendation",
        confidence: 0.91,
        tags: ["compliance", "personalization", "refinement"],
      },
    ),
  );

  // ── Message 6: Outreach Specialist drafts the message ──
  messages.push(
    msg(
      "outreach_specialist",
      `Here's the draft for the initial ${primaryChannel} outreach:\n\n` +
        `---\n\n` +
        `**Subject:** ${
          profile.digitalPresence.isKol
            ? `Your expertise in ${profile.prescribingProfile.topTherapeuticArea} — a collaboration opportunity`
            : `New data in ${profile.prescribingProfile.topTherapeuticArea} that may interest you`
        }\n\n` +
        `Dear Dr. ${profile.lastName},\n\n` +
        `${
          profile.digitalPresence.isKol
            ? `As a recognized leader in ${profile.primarySpecialty} with an impressive body of research, I wanted to reach out regarding an emerging development in ${profile.prescribingProfile.topTherapeuticArea} that aligns with your area of expertise.`
            : profile.digitalPresence.publicationCount > 5
              ? `I've been following the latest developments in ${profile.prescribingProfile.topTherapeuticArea} and noticed your contributions to the field. I thought you might be interested in some recent clinical data we've gathered.`
              : `I hope this message finds you well. I'm reaching out because we've recently compiled compelling clinical data in ${profile.prescribingProfile.topTherapeuticArea} that I believe is relevant to your practice at ${profile.affiliation.organizationName}.`
        }\n\n` +
        `${
          profile.prescribingProfile.brandVsGeneric === "generic-leaning"
            ? `We understand the importance of cost-effective treatment options. Our latest data demonstrates favorable pharmacoeconomic outcomes that may complement your current prescribing approach.`
            : `Our latest Phase III data shows significant improvements in patient outcomes, including [key endpoint]. I'd love to share the full results with you.`
        }\n\n` +
        `Would you be open to a brief conversation? I'm happy to work around your schedule.\n\n` +
        `Best regards,\n` +
        `Alex Outreach\n` +
        `Field Medical Liaison\n\n` +
        `---\n\n` +
        `How does this look? I've tried to match the tone to their profile — ${
          profile.yearsInPractice > 20 ? "respectful and peer-to-peer" : "professional but warm"
        }. Ready to adjust as needed.`,
      i++,
      {
        type: "action",
        tags: ["draft-message", "initial-outreach"],
      },
    ),
  );

  // ── Message 7: Strategist approves with minor edits ──
  messages.push(
    msg(
      "strategist",
      `Excellent draft. The tone is spot-on. A couple of tweaks:\n\n` +
        `1. ${
          profile.digitalPresence.isKol
            ? `Add a specific reference to one of their published papers to show we've done our homework. Something like "Your recent work on [topic] caught our attention..."`
            : `Mention a specific clinical data point rather than leaving it as a placeholder — it increases credibility and open rates by ~40%.`
        }\n\n` +
        `2. ${
          profile.affiliation.type === "academic"
            ? `For an academic physician, consider adding a mention of potential research collaboration or data sharing.`
            : `Add a line about compliance with all applicable regulations to build trust.`
        }\n\n` +
        `3. The call-to-action is good — low commitment ("brief conversation") works well for initial outreach.\n\n` +
        `**Overall Assessment:**\n` +
        `- Engagement probability: ${
          profile.digitalPresence.isKol
            ? "High (72%) — KOLs are typically receptive to peer-level outreach"
            : profile.prescribingProfile.prescribingVolume === "high"
              ? "Moderate-High (64%) — high-volume prescribers are data-hungry"
              : "Moderate (48%) — will need consistent multi-touch follow-up"
        }\n` +
        `- Expected response time: ${
          profile.yearsInPractice > 20 ? "3-5 business days" : "1-3 business days"
        }\n` +
        `- Risk factors: ${
          profile.prescribingProfile.brandVsGeneric === "generic-leaning"
            ? "Generic preference may require stronger economic argument"
            : "None significant — profile aligns well with our offering"
        }\n\n` +
        `Once you make those edits, we're cleared to launch the Week 1 sequence. I'll continue monitoring and adjust the strategy based on engagement signals.`,
      i++,
      {
        type: "recommendation",
        confidence: 0.89,
        tags: ["approval", "edits", "probability-assessment"],
      },
    ),
  );

  // ── Message 8: Outreach Specialist confirms ──
  messages.push(
    msg(
      "outreach_specialist",
      `Got it — incorporating those edits now. Here's the updated status:\n\n` +
        `**Campaign Status for ${fullName}:**\n` +
        `- Outreach sequence: ✅ Drafted & reviewed\n` +
        `- Primary channel (${primaryChannel}): ✅ Ready to deploy\n` +
        `- Secondary channel (${secondaryChannel}): ⏳ Scheduled for Week 3\n` +
        `- Compliance check: ✅ Passed\n` +
        `- Personalization score: ${
          profile.digitalPresence.isKol
            ? "9.2/10"
            : profile.prescribingProfile.prescribingVolume === "high"
              ? "8.7/10"
              : "8.1/10"
        }\n\n` +
        `I'll deploy the initial outreach and report back with engagement metrics after 48 hours. In the meantime, I'll also be monitoring their ${
          profile.digitalPresence.hasTwitter
            ? "Twitter/X activity for any relevant posts we can engage with"
            : profile.digitalPresence.hasLinkedIn
              ? "LinkedIn activity for any relevant posts or shares"
              : "online activity for any additional touchpoint opportunities"
        }.\n\n` +
        `Let's reconvene once we have initial response data. The 4-week cadence is locked in.`,
      i++,
      {
        type: "report",
        channels: [primaryChannel, secondaryChannel],
        tags: ["status-update", "deployment-ready"],
      },
    ),
  );

  return messages;
}
