/**
 * Tests for the Agent Conversation Generator.
 */

import {
  generateAgentConversation,
  type AgentMessage,
} from "@/lib/agent-conversation";
import type { DemoHcpProfile } from "@/lib/demo-seed";

// ─── Test Fixtures ──────────────────────────────────────────────────────────

function createDemoProfile(
  overrides: Partial<DemoHcpProfile> = {}
): DemoHcpProfile {
  return {
    npi: "1234567893",
    firstName: "John",
    lastName: "Smith",
    credentials: "MD",
    gender: "M",
    primarySpecialty: "Cardiology",
    yearsInPractice: 15,
    medicalSchool: "Harvard Medical School",
    boardCertifications: ["Cardiology", "Internal Medicine"],
    location: {
      addressLine1: "123 Main St",
      city: "Boston",
      state: "MA",
      zipCode: "02115",
      phone: "(617) 555-1234",
    },
    affiliation: {
      organizationName: "Massachusetts General Hospital",
      type: "hospital",
      role: "Attending Physician",
    },
    prescribingProfile: {
      topTherapeuticArea: "Heart Failure",
      prescribingVolume: "medium",
      brandVsGeneric: "balanced",
    },
    digitalPresence: {
      hasLinkedIn: true,
      hasTwitter: false,
      hasDoximity: true,
      publicationCount: 5,
      isKol: false,
    },
    ...overrides,
  };
}

// ─── Tests ──────────────────────────────────────────────────────────────────

describe("generateAgentConversation", () => {
  it("generates a non-empty conversation", () => {
    const profile = createDemoProfile();
    const convo = generateAgentConversation(profile);
    expect(convo.messages.length).toBeGreaterThan(0);
  });

  it("includes the HCP name in the conversation data", () => {
    const profile = createDemoProfile();
    const convo = generateAgentConversation(profile);
    expect(convo.hcpName).toBe("Dr. John Smith");
  });

  it("starts with a system message", () => {
    const profile = createDemoProfile();
    const convo = generateAgentConversation(profile);
    expect(convo.messages[0].role).toBe("system");
    expect(convo.messages[0].content).toContain("Smith");
  });

  it("ends with a system message", () => {
    const profile = createDemoProfile();
    const convo = generateAgentConversation(profile);
    const last = convo.messages[convo.messages.length - 1];
    expect(last.role).toBe("system");
    expect(last.content).toContain("complete");
  });

  it("includes messages from both scout and strategist agents", () => {
    const profile = createDemoProfile();
    const convo = generateAgentConversation(profile);
    const roles = new Set(convo.messages.map((m) => m.role));
    expect(roles.has("scout")).toBe(true);
    expect(roles.has("strategist")).toBe(true);
  });

  it("assigns correct agent names", () => {
    const profile = createDemoProfile();
    const convo = generateAgentConversation(profile);
    for (const msg of convo.messages) {
      if (msg.role === "scout") expect(msg.agentName).toBe("Scout");
      if (msg.role === "strategist") expect(msg.agentName).toBe("Strategist");
      if (msg.role === "system") expect(msg.agentName).toBe("System");
    }
  });

  it("has unique message IDs", () => {
    const profile = createDemoProfile();
    const convo = generateAgentConversation(profile);
    const ids = convo.messages.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has increasing delays for animation", () => {
    const profile = createDemoProfile();
    const convo = generateAgentConversation(profile);
    for (let i = 1; i < convo.messages.length; i++) {
      expect(convo.messages[i].delay).toBeGreaterThan(
        convo.messages[i - 1].delay
      );
    }
  });

  it("generates at least 8 messages for a complete conversation", () => {
    const profile = createDemoProfile();
    const convo = generateAgentConversation(profile);
    // System open + scout overview + scout affiliation + strategist reaction
    // + scout prescribing + scout digital + strategist persona + strategist channels
    // + scout insight + strategist messaging + strategist cadence + strategist objections
    // + system close = ~13
    expect(convo.messages.length).toBeGreaterThanOrEqual(8);
  });

  it("mentions the HCP specialty in scout messages", () => {
    const profile = createDemoProfile({ primarySpecialty: "Oncology" });
    const convo = generateAgentConversation(profile);
    const scoutMessages = convo.messages.filter((m) => m.role === "scout");
    const mentionsSpecialty = scoutMessages.some((m) =>
      m.content.includes("Oncology")
    );
    expect(mentionsSpecialty).toBe(true);
  });

  it("mentions the therapeutic area in strategy", () => {
    const profile = createDemoProfile({
      prescribingProfile: {
        topTherapeuticArea: "Breast Cancer",
        prescribingVolume: "medium",
        brandVsGeneric: "balanced",
      },
    });
    const convo = generateAgentConversation(profile);
    const allContent = convo.messages.map((m) => m.content).join(" ");
    expect(allContent).toContain("Breast Cancer");
  });

  it("identifies KOLs in the conversation", () => {
    const profile = createDemoProfile({
      digitalPresence: {
        hasLinkedIn: true,
        hasTwitter: true,
        hasDoximity: true,
        publicationCount: 30,
        isKol: true,
      },
    });
    const convo = generateAgentConversation(profile);
    const allContent = convo.messages.map((m) => m.content).join(" ");
    expect(allContent).toContain("Key Opinion Leader");
  });

  it("adapts persona classification for different profiles", () => {
    const academic = createDemoProfile({
      digitalPresence: {
        hasLinkedIn: true,
        hasTwitter: true,
        hasDoximity: true,
        publicationCount: 30,
        isKol: true,
      },
      affiliation: {
        organizationName: "Harvard",
        type: "academic",
        role: "Professor",
      },
    });
    const community = createDemoProfile({
      primarySpecialty: "Family Medicine",
      digitalPresence: {
        hasLinkedIn: false,
        hasTwitter: false,
        hasDoximity: false,
        publicationCount: 0,
        isKol: false,
      },
      affiliation: {
        organizationName: "Main St Clinic",
        type: "group_practice",
        role: "Attending Physician",
      },
    });

    const academicConvo = generateAgentConversation(academic);
    const communityConvo = generateAgentConversation(community);

    // Personas should differ
    const academicContent = academicConvo.messages.map((m) => m.content).join(" ");
    const communityContent = communityConvo.messages.map((m) => m.content).join(" ");

    // Academic should get evidence-heavy language
    expect(
      academicContent.includes("Key Opinion Leader") ||
      academicContent.includes("Academic Researcher")
    ).toBe(true);

    // Community should get practical language
    expect(
      communityContent.includes("Community Practitioner") ||
      communityContent.includes("practical") ||
      communityContent.includes("patient outcomes")
    ).toBe(true);
  });

  it("handles profiles with minimal digital presence", () => {
    const profile = createDemoProfile({
      digitalPresence: {
        hasLinkedIn: false,
        hasTwitter: false,
        hasDoximity: false,
        publicationCount: 0,
        isKol: false,
      },
    });
    const convo = generateAgentConversation(profile);
    // Should still generate a valid conversation
    expect(convo.messages.length).toBeGreaterThanOrEqual(8);
    const allContent = convo.messages.map((m) => m.content).join(" ");
    expect(allContent).toContain("None detected");
  });

  it("includes channel recommendations from strategist", () => {
    const profile = createDemoProfile();
    const convo = generateAgentConversation(profile);
    const stratMessages = convo.messages.filter(
      (m) => m.role === "strategist"
    );
    const hasChannelRec = stratMessages.some(
      (m) =>
        m.content.includes("primary channel") ||
        m.content.includes("secondary channel")
    );
    expect(hasChannelRec).toBe(true);
  });

  it("includes objection handling from strategist", () => {
    const profile = createDemoProfile();
    const convo = generateAgentConversation(profile);
    const stratMessages = convo.messages.filter(
      (m) => m.role === "strategist"
    );
    const hasObjections = stratMessages.some(
      (m) =>
        m.content.includes("objection") || m.content.includes("current approach")
    );
    expect(hasObjections).toBe(true);
  });

  it("includes cadence recommendation from strategist", () => {
    const profile = createDemoProfile();
    const convo = generateAgentConversation(profile);
    const stratMessages = convo.messages.filter(
      (m) => m.role === "strategist"
    );
    const hasCadence = stratMessages.some(
      (m) =>
        m.content.includes("weekly") ||
        m.content.includes("Weekly") ||
        m.content.includes("Bi-weekly") ||
        m.content.includes("Monthly")
    );
    expect(hasCadence).toBe(true);
  });
});
