"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  X,
  Clock,
  MessageSquare,
  Mail,
  Globe,
  Phone,
  Headphones,
  Radio,
  Send,
  Package,
  Brain,
  Zap,
  Target,
  User,
  MapPin,
  Briefcase,
  GraduationCap,
  Stethoscope,
  TrendingUp,
  FileText,
  ArrowRight,
  Bot,
} from "lucide-react";

const c = {
  bg: "#090b0f",
  card: "#0c0e12",
  textPrimary: "#f7f7f7",
  textSecondary: "#94969c",
  textMuted: "#85888e",
  accent: "#0deefd",
  green: "#75dfa6",
  pink: "#d73371",
  orange: "#f79009",
  divider: "#1e2028",
  cardBorder: "#131720",
};

type PaneTab = "engagements" | "agentic" | "persona";

interface HcpEngagement {
  hcp: string;
  specialty: string;
  npi: string;
}

/* ─── touchpoint data ─── */

interface Touchpoint {
  channel: string;
  icon: React.ElementType;
  direction: "Inbound" | "Outbound";
  summary: string;
  time: string;
  outcome: string;
}

const touchpointsByNpi: Record<string, Touchpoint[]> = {
  "1234567890": [
    { channel: "SMS", icon: MessageSquare, direction: "Outbound", summary: "Stelazio dosing reminder — replied with titration question", time: "2m ago", outcome: "Routed to medical affairs" },
    { channel: "Email", icon: Mail, direction: "Outbound", summary: "Stelazio Phase III results email — opened, clicked full study link", time: "2d ago", outcome: "Content engaged" },
    { channel: "Concierge", icon: Headphones, direction: "Inbound", summary: "Called about sample availability for new patient starts", time: "5d ago", outcome: "Samples shipped" },
    { channel: "Direct Mail", icon: Send, direction: "Outbound", summary: "Stelazio clinical evidence portfolio mailed", time: "8d ago", outcome: "Delivered — QR scanned" },
    { channel: "AI Assistant", icon: Radio, direction: "Inbound", summary: "Asked about Stelazio drug interactions with existing statin regimen", time: "12d ago", outcome: "Resolved in-session" },
    { channel: "SMS", icon: MessageSquare, direction: "Outbound", summary: "7-day post-sample check-in — opened, no reply", time: "14d ago", outcome: "No response" },
    { channel: "Samples", icon: Package, direction: "Outbound", summary: "2 starter packs delivered to office", time: "20d ago", outcome: "Delivery confirmed" },
  ],
  "2345678901": [
    { channel: "Intelligent Media", icon: Globe, direction: "Inbound", summary: "Scanned QR at AAN 2026 — viewed Phase III data and MOA module", time: "5m ago", outcome: "Certificate generated" },
    { channel: "Email", icon: Mail, direction: "Outbound", summary: "Neurovia clinical update — opened, downloaded PDF", time: "3d ago", outcome: "Resource accessed" },
    { channel: "P2P Calling", icon: Phone, direction: "Outbound", summary: "MSL discussed long-term efficacy data from extension study", time: "7d ago", outcome: "F2F meeting requested" },
    { channel: "AI Assistant", icon: Radio, direction: "Inbound", summary: "Queried Neurovia drug interaction with existing regimen", time: "10d ago", outcome: "Interaction guide sent" },
    { channel: "SMS", icon: MessageSquare, direction: "Outbound", summary: "Welcome sequence — initial outreach", time: "18d ago", outcome: "Link clicked" },
  ],
  "3456789012": [
    { channel: "SMS", icon: MessageSquare, direction: "Outbound", summary: "Post-webinar follow-up — replied requesting subgroup data", time: "12m ago", outcome: "Data package queued" },
    { channel: "AI Assistant", icon: Radio, direction: "Inbound", summary: "Asked about Oncurel dose adjustment in renal impairment", time: "1d ago", outcome: "Resolved with PI guidance" },
    { channel: "Intelligent Media", icon: Globe, direction: "Inbound", summary: "Completed MOA interactive module (score: 92%)", time: "2d ago", outcome: "Certificate generated" },
    { channel: "Email", icon: Mail, direction: "Outbound", summary: "Oncurel webinar invitation — RSVP'd and attended", time: "5d ago", outcome: "Full attendance (45min)" },
    { channel: "P2P Calling", icon: Phone, direction: "Outbound", summary: "Rep coordinated Oncurel lunch-and-learn logistics", time: "8d ago", outcome: "Event confirmed" },
    { channel: "Concierge", icon: Headphones, direction: "Inbound", summary: "Requested head-to-head data vs. competitor", time: "15d ago", outcome: "Medical affairs referral" },
  ],
  "4567890123": [
    { channel: "Concierge", icon: Headphones, direction: "Inbound", summary: "PA denial for Cardiovex — appeal initiated", time: "18m ago", outcome: "Appeal submitted, P2P scheduled" },
    { channel: "SMS", icon: MessageSquare, direction: "Outbound", summary: "Cardiovex dosing guide link — no reply", time: "5d ago", outcome: "No response" },
    { channel: "Email", icon: Mail, direction: "Outbound", summary: "Cardiovex clinical evidence email — opened", time: "10d ago", outcome: "Content viewed" },
    { channel: "Samples", icon: Package, direction: "Outbound", summary: "Cardiovex starter kit shipped", time: "18d ago", outcome: "Delivery confirmed" },
  ],
  "5678901234": [
    { channel: "Intelligent Media", icon: Globe, direction: "Inbound", summary: "QR scan from physician lounge — used dosing calculator", time: "25m ago", outcome: "High-intent signal flagged" },
    { channel: "AI Assistant", icon: Radio, direction: "Inbound", summary: "Used Oncurel dosing calculator for 2 patient scenarios", time: "1d ago", outcome: "Clinical tool engaged" },
    { channel: "Email", icon: Mail, direction: "Outbound", summary: "Oncurel formulary coverage tool CTA — clicked", time: "3d ago", outcome: "Access tool opened" },
    { channel: "P2P Calling", icon: Phone, direction: "Outbound", summary: "Rep intro call — discussed patient selection criteria", time: "8d ago", outcome: "Samples requested" },
    { channel: "Direct Mail", icon: Send, direction: "Outbound", summary: "Oncurel patient brochure with QR code", time: "12d ago", outcome: "QR code scanned" },
  ],
  "6789012345": [
    { channel: "SMS", icon: MessageSquare, direction: "Outbound", summary: "Welcome SMS — delivered, awaiting response", time: "32m ago", outcome: "Pending" },
    { channel: "Email", icon: Mail, direction: "Outbound", summary: "Neurovia clinical summary — opened", time: "2d ago", outcome: "Content viewed" },
  ],
  "7890123456": [
    { channel: "Direct Mail", icon: Send, direction: "Outbound", summary: "Respira clinical evidence portfolio + sample request card", time: "1h ago", outcome: "Delivered" },
    { channel: "SMS", icon: MessageSquare, direction: "Outbound", summary: "Respira re-engagement — no reply (2 attempts)", time: "3d ago", outcome: "No response" },
    { channel: "Email", icon: Mail, direction: "Outbound", summary: "Forwarded Respira dosing guide to colleague", time: "5d ago", outcome: "Viral share detected" },
    { channel: "Concierge", icon: Headphones, direction: "Inbound", summary: "Requested speaker program details for regional event", time: "10d ago", outcome: "Speaker deck sent" },
    { channel: "P2P Calling", icon: Phone, direction: "Outbound", summary: "Rep reviewed Respira titration protocol with office", time: "15d ago", outcome: "Samples requested" },
    { channel: "AI Assistant", icon: Radio, direction: "Inbound", summary: "Queried Respira in elderly patients with CKD", time: "20d ago", outcome: "Escalated to medical affairs" },
  ],
  "8901234567": [
    { channel: "AI Assistant", icon: Radio, direction: "Inbound", summary: "Asked about Respira in special populations", time: "1.5h ago", outcome: "Follow-up data sent" },
    { channel: "Email", icon: Mail, direction: "Outbound", summary: "Respira webinar invitation — replied asking about dates", time: "2d ago", outcome: "Webinar invite sent" },
    { channel: "SMS", icon: MessageSquare, direction: "Outbound", summary: "Respira awareness — opened link", time: "7d ago", outcome: "Link clicked" },
    { channel: "P2P Calling", icon: Phone, direction: "Outbound", summary: "MSL discussed Respira special populations data", time: "12d ago", outcome: "Follow-up package sent" },
  ],
};

/* ─── agent conversation data ─── */

interface AgentMessage {
  agent: "strategist" | "engagement";
  text: string;
}

const agentConversationsByNpi: Record<string, AgentMessage[]> = {
  "1234567890": [
    { agent: "strategist", text: "Dr. Chen has 14 touchpoints and is highly active. She just asked a clinical question about Stelazio titration after receiving samples 20 days ago. This signals she's actively considering prescribing but has a knowledge gap we need to close." },
    { agent: "engagement", text: "Agreed. The titration question is a strong intent signal. I recommend we route this to the MSL team for a callback within 4 hours and simultaneously send the titration guide PDF via the channel she's most responsive to — SMS has a 100% open rate with her." },
    { agent: "strategist", text: "Good call. Looking at her engagement pattern, she responds best to clinical data delivered via SMS with supporting detail in email. She's also engaged with the AI Assistant for drug interaction questions. We should position her for the upcoming Stelazio speaker program — she fits the KOL profile." },
    { agent: "engagement", text: "I'll draft a multi-touch sequence: (1) MSL callback today addressing titration, (2) follow-up SMS in 48h with real-world outcomes data, (3) email with the full speaker program invitation next week. We should avoid direct mail — she hasn't engaged with physical materials." },
    { agent: "strategist", text: "Approved. Let's also flag her for the cardiology advisory board. With 14 touches and increasing clinical depth in her questions, she's transitioning from evaluator to potential advocate. Set a checkpoint at 30 days to assess prescribing behavior change." },
  ],
  "2345678901": [
    { agent: "strategist", text: "Dr. Wilson scanned our QR code at AAN 2026, viewed Phase III data, and completed the MOA module. He's in active research mode and already requested a face-to-face after the MSL call. This is a high-conversion opportunity." },
    { agent: "engagement", text: "The conference engagement is extremely valuable. He self-selected into our content through the QR scan, which means his interest is organic. I recommend prioritizing the F2F meeting with the MSL and preparing a personalized evidence package focused on the long-term extension study data he was discussing." },
    { agent: "strategist", text: "He's a neurology KOL with conference engagement. Let's accelerate the relationship — schedule the F2F within 5 business days, have the MSL bring the full Phase III + extension data set, and open a conversation about our upcoming advisory board." },
    { agent: "engagement", text: "I'll coordinate with the field team for scheduling. In parallel, I'll send a personalized follow-up email referencing his AAN session and the specific data points he viewed on the Intelligent Media portal. This shows we understand his interests without being intrusive." },
  ],
  "3456789012": [
    { agent: "strategist", text: "Dr. Garcia is our most engaged HCP with 22 touchpoints. She attended the full webinar, scored 92% on the MOA module, and is now asking about renal impairment subgroup data. She's deeply evaluating Oncurel for her patient population." },
    { agent: "engagement", text: "The renal impairment question is specific and clinical — this isn't casual browsing, she has patients in mind. I recommend fast-tracking the subgroup analysis delivery via secure link within 2 hours, and having medical affairs prepare for a potential follow-up discussion." },
    { agent: "strategist", text: "Agreed. She's also eligible for the regional speaker program based on her engagement depth. After the data delivery, let's wait 72 hours for her to digest the material, then have the rep coordinate the lunch-and-learn she already agreed to. That event will be the inflection point." },
    { agent: "engagement", text: "Perfect sequencing. I'll ensure the data package includes both the renal subgroup analysis and the broader Phase III safety data for context. For the lunch-and-learn, I'll prepare talking points that bridge from the subgroup data to real-world patient selection. She responds well to data-driven narratives." },
    { agent: "strategist", text: "One more thing — her engagement pattern shows she's a digital-first HCP. AI Assistant and Intelligent Media are her preferred channels for clinical queries. Let's make sure the Oncurel content hub has the renal impairment data prominently featured so she can self-serve follow-up questions." },
  ],
  "4567890123": [
    { agent: "strategist", text: "Dr. Kim is in a difficult position — his patient was denied PA for Cardiovex despite failing two prior agents. He reached out to concierge for help, which shows he's committed to this patient but frustrated with the access barrier." },
    { agent: "engagement", text: "The concierge team handled the immediate need well — appeal filed and P2P scheduled. But we need to use this moment to build trust. I recommend a proactive follow-up from the rep once the P2P is scheduled to show we're invested in his patient outcomes, not just the sale." },
    { agent: "strategist", text: "Good instinct. He's been relatively low-touch (5 touchpoints, Cooling Off status) because access barriers are creating friction. If we can help resolve this PA issue, it could be a relationship turning point. Let's also proactively prepare step therapy exception documentation for his other patients." },
    { agent: "engagement", text: "I'll have the access team prepare a Cardiovex coverage guide specific to his top 5 payers, so he doesn't face this again. We should deliver this via email post-P2P as a value-add. For channel strategy — he responds to concierge and email, so let's lean into those." },
  ],
  "5678901234": [
    { agent: "strategist", text: "Dr. Zhang is showing strong digital engagement — QR scans, dosing calculator usage, formulary lookups. She ran 2 patient scenarios in the calculator, which is a strong prescribing intent signal. She's likely evaluating Oncurel for specific patients right now." },
    { agent: "engagement", text: "The dosing calculator usage is the highest intent signal we track. Combined with her QR scan from the physician lounge (organic discovery), she's self-educating before prescribing. I recommend we don't over-engage — let her continue the self-directed journey but ensure she has concierge access if she hits an access barrier." },
    { agent: "strategist", text: "Smart approach. However, let's make sure the high-intent flag triggers a concierge warm handoff. If she encounters any formulary or PA issues with the patients she's calculating for, we want frictionless access to help. The rep intro call went well — samples were requested — so the relationship is established." },
    { agent: "engagement", text: "I'll set up an intelligent trigger: if she visits the formulary tool again or starts a new dosing scenario, we auto-send a SMS with direct concierge line. Passive but available. Also, her physician lounge QR discovery suggests we should increase our presence at Cedar Sinai — she might refer colleagues." },
  ],
  "6789012345": [
    { agent: "strategist", text: "Dr. Park is a brand new HCP with only 2 touchpoints. He's in the welcome sequence for Neurovia and hasn't responded to the initial SMS yet. It's too early to draw conclusions — we need to give the sequence time to work." },
    { agent: "engagement", text: "Agreed. The welcome sequence has a 48-hour nudge built in. If he doesn't respond by Feb 22, we'll pivot to email as a fallback channel. His NPI was just validated yesterday, so this is day 1 of engagement. Let's not over-saturate." },
    { agent: "strategist", text: "For new neurology targets, our data shows email + AI Assistant is the highest-converting channel mix after initial SMS. If he engages with the email, we should surface the Neurovia content hub as a next step. Let's reconvene after the 7-day mark to assess." },
  ],
  "7890123456": [
    { agent: "strategist", text: "Dr. Thompson is an interesting case — she hasn't responded to SMS (2 attempts) but has high engagement through other channels. She forwarded our dosing guide to a colleague (viral share), engaged with concierge for speaker programs, and the direct mail just delivered. She's engaged but SMS isn't her channel." },
    { agent: "engagement", text: "Clear signal to deprioritize SMS and lean into the channels she actually responds to: email, concierge, and face-to-face via P2P calling. The direct mail delivery should trigger a follow-up via email — not SMS — asking if she received the materials and linking to the digital portal." },
    { agent: "strategist", text: "The viral share is a major opportunity. She forwarded to a colleague, which means she's an influencer in her practice. Let's identify who she forwarded to, add them to our target list, and position Dr. Thompson for the speaker program she asked about. Converting her into an advocate would multiply our reach." },
    { agent: "engagement", text: "I'll adjust her channel preferences in the system to prioritize email and concierge, suppress SMS, and flag the viral share for the field team. For the speaker program, I'll have the rep send a formal invitation via email with logistics within 48 hours." },
  ],
  "8901234567": [
    { agent: "strategist", text: "Dr. Brown is in Cooling Off status with 7 touchpoints. His last meaningful engagement was asking the AI Assistant about Respira in special populations. He also asked about webinar dates via email, which shows interest but he hasn't committed to deeper engagement." },
    { agent: "engagement", text: "Cooling Off doesn't mean disengaged — it means we need to re-engage smartly. His special populations question suggests he has patients who could benefit but wants more confidence in the data. I recommend we send him the follow-up data package from the MSL call and invite him to the next webinar focused specifically on special populations." },
    { agent: "strategist", text: "Good plan. Let's make the webinar invitation personal — reference his previous questions and let him know the webinar directly addresses his concerns. If he attends, we should have the MSL available for a 1:1 Q&A after. That personal attention could be the tipping point." },
  ],
};

/* ─── persona data ─── */

interface HcpPersona {
  fullName: string;
  credentials: string;
  specialty: string;
  subSpecialty: string;
  npi: string;
  affiliations: string[];
  location: string;
  yearsInPractice: number;
  patientVolume: string;
  prescribingBehavior: string;
  topTherapies: string[];
  communicationPrefs: string[];
  decisionDrivers: string[];
  recentPublications: string[];
  influence: string;
  engagementScore: number;
}

const personasByNpi: Record<string, HcpPersona> = {
  "1234567890": {
    fullName: "Dr. Sarah Chen, MD, FACC",
    credentials: "Board Certified — Cardiovascular Disease",
    specialty: "Cardiology",
    subSpecialty: "Interventional Cardiology",
    npi: "1234567890",
    affiliations: ["NYU Langone Health", "American College of Cardiology"],
    location: "New York, NY",
    yearsInPractice: 14,
    patientVolume: "~180 patients/month",
    prescribingBehavior: "Early adopter — frequently tries new therapies with strong clinical evidence. Prefers data from large RCTs over real-world evidence alone.",
    topTherapies: ["Atorvastatin", "Ezetimibe", "PCSK9 inhibitors"],
    communicationPrefs: ["SMS (highest response)", "AI Assistant (clinical queries)", "Email (supporting detail)"],
    decisionDrivers: ["Efficacy data from Phase III trials", "Safety profile in comorbid patients", "Patient affordability & access"],
    recentPublications: ["LDL-C Management in High-Risk Populations (JACC, 2025)", "Novel Approaches to Residual CV Risk (Circulation, 2025)"],
    influence: "Regional KOL — speaks at 3-4 conferences/year, active on medical Twitter",
    engagementScore: 87,
  },
  "2345678901": {
    fullName: "Dr. James Wilson, MD, PhD",
    credentials: "Board Certified — Neurology",
    specialty: "Neurology",
    subSpecialty: "Multiple Sclerosis & Neuroimmunology",
    npi: "2345678901",
    affiliations: ["UCSD Medical Center", "American Academy of Neurology"],
    location: "San Diego, CA",
    yearsInPractice: 18,
    patientVolume: "~120 patients/month",
    prescribingBehavior: "Evidence-driven — waits for long-term data before switching established patients. Open to new therapies for treatment-naive patients.",
    topTherapies: ["Ocrelizumab", "Natalizumab", "Dimethyl fumarate"],
    communicationPrefs: ["Conference engagement", "MSL meetings", "Intelligent Media portals"],
    decisionDrivers: ["Long-term efficacy data", "Safety in immunocompromised", "Patient convenience (oral vs. infusion)"],
    recentPublications: ["Oral DMTs in Relapsing MS: A Systematic Review (Ann Neurol, 2025)", "Biomarkers for Treatment Response in MS (Lancet Neurol, 2025)"],
    influence: "National KOL — AAN faculty, journal reviewer, advisory board participant",
    engagementScore: 72,
  },
  "3456789012": {
    fullName: "Dr. Maria Garcia, MD",
    credentials: "Board Certified — Medical Oncology",
    specialty: "Oncology",
    subSpecialty: "Solid Tumors — GI & GU",
    npi: "3456789012",
    affiliations: ["Memorial Sloan Kettering (community affiliate)", "ASCO"],
    location: "Houston, TX",
    yearsInPractice: 11,
    patientVolume: "~90 patients/month",
    prescribingBehavior: "Aggressive adopter — among first in region to use new approvals. Relies heavily on subgroup analyses for patient selection.",
    topTherapies: ["Pembrolizumab", "Enfortumab vedotin", "Avelumab"],
    communicationPrefs: ["AI Assistant (quick queries)", "Webinars (deep dives)", "Intelligent Media (self-paced learning)"],
    decisionDrivers: ["Subgroup analysis data", "Real-world evidence", "Biomarker-guided patient selection"],
    recentPublications: ["Biomarker-Driven Therapy Selection in GU Cancers (JCO, 2025)"],
    influence: "Rising regional opinion leader — increasing speaker program invitations",
    engagementScore: 94,
  },
  "4567890123": {
    fullName: "Dr. Robert Kim, MD",
    credentials: "Board Certified — Cardiovascular Disease",
    specialty: "Cardiology",
    subSpecialty: "Heart Failure & Transplant",
    npi: "4567890123",
    affiliations: ["Cleveland Clinic Florida", "Heart Failure Society of America"],
    location: "Fort Lauderdale, FL",
    yearsInPractice: 9,
    patientVolume: "~100 patients/month",
    prescribingBehavior: "Conservative — prefers established therapies unless new data is compelling. Frustrated by access barriers.",
    topTherapies: ["Sacubitril/Valsartan", "Dapagliflozin", "Ivabradine"],
    communicationPrefs: ["Concierge (access help)", "Email (clinical evidence)", "Rep meetings"],
    decisionDrivers: ["Payer coverage & access", "Guideline recommendations", "Ease of prior authorization"],
    recentPublications: [],
    influence: "Community practice leader — manages large HF patient population",
    engagementScore: 38,
  },
  "5678901234": {
    fullName: "Dr. Emily Zhang, MD, FAAD",
    credentials: "Board Certified — Dermatology",
    specialty: "Dermatology",
    subSpecialty: "Dermato-oncology",
    npi: "5678901234",
    affiliations: ["Cedar Sinai Medical Center", "American Academy of Dermatology"],
    location: "Los Angeles, CA",
    yearsInPractice: 7,
    patientVolume: "~200 patients/month",
    prescribingBehavior: "Digital-first evaluator — extensively uses online tools and calculators before prescribing. Values dosing precision.",
    topTherapies: ["Cemiplimab", "Pembrolizumab (cutaneous)", "Sonidegib"],
    communicationPrefs: ["Intelligent Media (digital tools)", "AI Assistant", "QR/mobile-first content"],
    decisionDrivers: ["Dosing calculators & patient selection tools", "Formulary coverage in LA market", "Real-world tolerability data"],
    recentPublications: ["Digital Health Tools in Dermato-oncology Practice (JAAD, 2025)"],
    influence: "Digital influencer — active on medical education platforms, high referral network at Cedar Sinai",
    engagementScore: 76,
  },
  "6789012345": {
    fullName: "Dr. David Park, MD",
    credentials: "Board Certified — Neurology",
    specialty: "Neurology",
    subSpecialty: "General Neurology",
    npi: "6789012345",
    affiliations: ["Kaiser Permanente Mid-Atlantic"],
    location: "Bethesda, MD",
    yearsInPractice: 3,
    patientVolume: "~140 patients/month",
    prescribingBehavior: "New to practice — follows institutional formulary closely. Open to learning about new options.",
    topTherapies: ["Glatiramer acetate", "Interferon beta-1a", "Teriflunomide"],
    communicationPrefs: ["Email", "Digital content", "Webinars"],
    decisionDrivers: ["Institutional formulary", "Senior colleague recommendations", "Patient convenience"],
    recentPublications: [],
    influence: "Low — early career, building patient panel",
    engagementScore: 12,
  },
  "7890123456": {
    fullName: "Dr. Lisa Thompson, MD, FACC",
    credentials: "Board Certified — Cardiovascular Disease",
    specialty: "Cardiology",
    subSpecialty: "Preventive Cardiology",
    npi: "7890123456",
    affiliations: ["Cardiology Associates of Manhattan", "American Heart Association"],
    location: "New York, NY",
    yearsInPractice: 22,
    patientVolume: "~160 patients/month",
    prescribingBehavior: "Methodical — evaluates thoroughly before adopting. Once committed, becomes a strong advocate and shares with peers.",
    topTherapies: ["Rosuvastatin", "Bempedoic acid", "Icosapent ethyl"],
    communicationPrefs: ["Email (primary)", "Concierge (access)", "F2F meetings", "Does NOT respond to SMS"],
    decisionDrivers: ["Peer recommendations", "Long-term outcomes data", "Speaker program insights"],
    recentPublications: ["Preventive Cardiology in Women: Closing the Gap (AHJ, 2025)", "Statin Intolerance: Alternative Approaches (JAMA Cardiol, 2025)"],
    influence: "High — practice leader, influences 8-physician group, active in AHA regional chapters",
    engagementScore: 68,
  },
  "8901234567": {
    fullName: "Dr. Michael Brown, DO",
    credentials: "Board Certified — Pulmonary Medicine",
    specialty: "Pulmonology",
    subSpecialty: "COPD & Asthma",
    npi: "8901234567",
    affiliations: ["Johns Hopkins Community Physicians"],
    location: "Baltimore, MD",
    yearsInPractice: 12,
    patientVolume: "~130 patients/month",
    prescribingBehavior: "Cautious adopter — needs robust safety data, especially for special populations (elderly, CKD). Values MSL relationships.",
    topTherapies: ["Umeclidinium/Vilanterol", "Budesonide/Formoterol", "Dupilumab"],
    communicationPrefs: ["MSL meetings (preferred)", "Email", "AI Assistant (after-hours queries)"],
    decisionDrivers: ["Safety in special populations", "MSL relationship & trust", "Guideline alignment"],
    recentPublications: ["Managing COPD in Patients with CKD: A Practical Guide (Chest, 2025)"],
    influence: "Moderate — respected in regional pulmonology community, Hopkins affiliation adds credibility",
    engagementScore: 45,
  },
};

/* ─── component ─── */

export default function HcpDetailPane({ engagement, onClose, initialTab }: { engagement: HcpEngagement; onClose: () => void; initialTab?: PaneTab }) {
  const [activeTab, setActiveTab] = useState<PaneTab>(initialTab || "engagements");

  useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
  }, [initialTab]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  }, [onClose]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const touchpoints = touchpointsByNpi[engagement.npi] || [];
  const agentConvo = agentConversationsByNpi[engagement.npi] || [];
  const persona = personasByNpi[engagement.npi];

  const tabs: { id: PaneTab; label: string; icon: React.ElementType }[] = [
    { id: "engagements", label: "Previous Engagements", icon: Clock },
    { id: "agentic", label: "Agentic Field Force", icon: Brain },
    { id: "persona", label: "HCP Persona", icon: User },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end" style={{ background: "rgba(0,0,0,0.5)" }} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div
        data-demo="hcp-detail-pane"
        className="h-full w-full max-w-2xl flex flex-col border-l"
        style={{ background: c.bg, borderColor: c.divider, animation: "slideIn 0.2s ease-out" }}
      >
        {/* Header */}
        <div className="shrink-0 px-6 pt-5 pb-0" style={{ borderBottom: `1px solid ${c.divider}` }}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold" style={{ color: c.textPrimary }}>{engagement.hcp}</h2>
              <p className="text-sm" style={{ color: c.textSecondary }}>{engagement.specialty} · NPI {engagement.npi}</p>
            </div>
            <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-white/5 cursor-pointer" style={{ color: c.textSecondary }}>
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-0">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold transition-colors relative"
                  style={{ color: isActive ? c.accent : c.textSecondary }}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {tab.label}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background: c.accent }} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {activeTab === "engagements" && <PreviousEngagementsTab touchpoints={touchpoints} />}
          {activeTab === "agentic" && <AgenticFieldForceTab hcpName={engagement.hcp} conversation={agentConvo} />}
          {activeTab === "persona" && persona && <HcpPersonaTab persona={persona} />}
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}

/* ─── Previous Engagements Tab ─── */

function PreviousEngagementsTab({ touchpoints }: { touchpoints: Touchpoint[] }) {
  return (
    <div className="space-y-0">
      {touchpoints.map((tp, i) => {
        const Icon = tp.icon;
        return (
          <div
            key={i}
            className="flex gap-3 py-3.5"
            style={{ borderBottom: i < touchpoints.length - 1 ? `1px solid ${c.divider}` : undefined }}
          >
            <div className="flex flex-col items-center pt-0.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ background: `${c.accent}10`, border: `1px solid ${c.accent}20` }}>
                <Icon className="h-4 w-4" style={{ color: c.accent }} />
              </div>
              {i < touchpoints.length - 1 && <div className="w-px flex-1 mt-2" style={{ background: c.divider }} />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-sm font-semibold" style={{ color: c.textPrimary }}>{tp.channel}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded" style={{
                  color: tp.direction === "Outbound" ? c.accent : c.green,
                  background: tp.direction === "Outbound" ? `${c.accent}10` : `${c.green}10`,
                }}>
                  {tp.direction}
                </span>
                <span className="text-xs ml-auto shrink-0" style={{ color: c.textMuted }}>{tp.time}</span>
              </div>
              <p className="text-sm" style={{ color: c.textSecondary }}>{tp.summary}</p>
              <div className="flex items-center gap-1 mt-1">
                <ArrowRight className="h-3 w-3" style={{ color: c.accent }} />
                <span className="text-xs font-medium" style={{ color: c.accent }}>{tp.outcome}</span>
              </div>
            </div>
          </div>
        );
      })}
      {touchpoints.length === 0 && (
        <p className="text-sm text-center py-8" style={{ color: c.textMuted }}>No previous engagements recorded</p>
      )}
    </div>
  );
}

/* ─── Agentic Field Force Tab ─── */

const WORD_DELAY = 30;
const PAUSE_BETWEEN_MESSAGES = 800;

type StreamPhase = "idle" | "typing" | "streaming" | "done";

function AgenticFieldForceTab({ hcpName, conversation }: { hcpName: string; conversation: AgentMessage[] }) {
  const agents = {
    strategist: { label: "Strategist", icon: Target, color: c.accent, desc: "Analyzes engagement patterns, identifies opportunities, and develops account strategy" },
    engagement: { label: "Engagement Expert", icon: Zap, color: c.green, desc: "Designs communication sequences, optimizes channel mix, and crafts outreach tactics" },
  };

  const [phase, setPhase] = useState<StreamPhase>("idle");
  const [msgIndex, setMsgIndex] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentMessage = msgIndex < conversation.length ? conversation[msgIndex] : null;
  const currentWords = currentMessage ? currentMessage.text.split(" ") : [];

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setPhase("idle");
    setMsgIndex(0);
    setWordIndex(0);
    if (conversation.length > 0) {
      timerRef.current = setTimeout(() => setPhase("typing"), 300);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [conversation]);

  useEffect(() => {
    if (phase === "typing") {
      timerRef.current = setTimeout(() => setPhase("streaming"), PAUSE_BETWEEN_MESSAGES);
      return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    }
  }, [phase, msgIndex]);

  useEffect(() => {
    if (phase !== "streaming" || !currentMessage) return;
    if (wordIndex >= currentWords.length) {
      const nextIdx = msgIndex + 1;
      if (nextIdx < conversation.length) {
        setMsgIndex(nextIdx);
        setWordIndex(0);
        setPhase("typing");
      } else {
        setMsgIndex(nextIdx);
        setPhase("done");
      }
      return;
    }
    timerRef.current = setTimeout(() => setWordIndex((prev) => prev + 1), WORD_DELAY);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [phase, wordIndex, currentWords.length, currentMessage, msgIndex, conversation.length]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [msgIndex, wordIndex, phase]);

  return (
    <div className="flex flex-col h-full -my-5 -mx-6">
      {/* Agent cards — fixed top */}
      <div className="shrink-0 px-6 pt-5 pb-4">
        <div className="grid grid-cols-2 gap-3">
          {(Object.entries(agents) as [keyof typeof agents, typeof agents[keyof typeof agents]][]).map(([key, agent]) => {
            const Icon = agent.icon;
            return (
              <div key={key} className="rounded-xl border p-3" style={{ background: c.card, borderColor: c.cardBorder }}>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: `${agent.color}15`, border: `1px solid ${agent.color}30` }}>
                    <Icon className="h-3.5 w-3.5" style={{ color: agent.color }} />
                  </div>
                  <div>
                    <span className="text-xs font-bold" style={{ color: agent.color }}>{agent.label}</span>
                    <div className="flex items-center gap-1">
                      <Bot className="h-2.5 w-2.5" style={{ color: c.textMuted }} />
                      <span className="text-[10px]" style={{ color: c.textMuted }}>AI Agent</span>
                    </div>
                  </div>
                </div>
                <p className="text-[11px] leading-relaxed" style={{ color: c.textSecondary }}>{agent.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="rounded-lg px-3 py-2 mt-3" style={{ background: `${c.accent}08`, border: `1px solid ${c.accent}15` }}>
          <p className="text-xs" style={{ color: c.textSecondary }}>
            <span style={{ color: c.accent }} className="font-semibold">Strategy session</span> for {hcpName} — analyzing engagement history and developing next-best-action plan
          </p>
        </div>
      </div>

      {/* Conversation — scrollable */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 pb-5 space-y-4">
        {/* Fully revealed messages */}
        {conversation.slice(0, msgIndex).map((msg, i) => {
          const agent = agents[msg.agent];
          const Icon = agent.icon;
          const isStrategist = msg.agent === "strategist";
          return (
            <div key={i} className="flex gap-3" style={{ animation: "fadeIn 0.3s ease-out" }}>
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full" style={{ background: `${agent.color}15`, border: `1px solid ${agent.color}30` }}>
                <Icon className="h-4 w-4" style={{ color: agent.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold" style={{ color: agent.color }}>{agent.label}</span>
                </div>
                <div className="rounded-xl px-3.5 py-2.5" style={{ background: c.card, border: `1px solid ${isStrategist ? `${c.accent}15` : `${c.green}15`}` }}>
                  <p className="text-sm leading-relaxed" style={{ color: c.textPrimary }}>{msg.text}</p>
                </div>
              </div>
            </div>
          );
        })}

        {/* Currently streaming message */}
        {phase === "streaming" && currentMessage && (() => {
          const agent = agents[currentMessage.agent];
          const Icon = agent.icon;
          const isStrategist = currentMessage.agent === "strategist";
          const visibleText = currentWords.slice(0, wordIndex).join(" ");
          return (
            <div className="flex gap-3" style={{ animation: "fadeIn 0.3s ease-out" }}>
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full" style={{ background: `${agent.color}15`, border: `1px solid ${agent.color}30` }}>
                <Icon className="h-4 w-4" style={{ color: agent.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold" style={{ color: agent.color }}>{agent.label}</span>
                </div>
                <div className="rounded-xl px-3.5 py-2.5" style={{ background: c.card, border: `1px solid ${isStrategist ? `${c.accent}15` : `${c.green}15`}` }}>
                  <p className="text-sm leading-relaxed" style={{ color: c.textPrimary }}>
                    {visibleText}
                    <span className="inline-block w-[2px] h-[14px] ml-0.5 align-middle" style={{ background: agent.color, animation: "blink 0.8s step-end infinite" }} />
                  </p>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Typing indicator */}
        {phase === "typing" && currentMessage && (() => {
          const agent = agents[currentMessage.agent];
          const Icon = agent.icon;
          return (
            <div className="flex gap-3" style={{ animation: "fadeIn 0.2s ease-out" }}>
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full" style={{ background: `${agent.color}15`, border: `1px solid ${agent.color}30` }}>
                <Icon className="h-4 w-4" style={{ color: agent.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold" style={{ color: agent.color }}>{agent.label}</span>
                </div>
                <div className="rounded-xl px-3.5 py-2.5 inline-flex items-center gap-1.5" style={{ background: c.card, border: `1px solid ${agent.color}15` }}>
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: agent.color, animation: "typingDot 1.2s ease-in-out infinite 0s" }} />
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: agent.color, animation: "typingDot 1.2s ease-in-out infinite 0.2s" }} />
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: agent.color, animation: "typingDot 1.2s ease-in-out infinite 0.4s" }} />
                </div>
              </div>
            </div>
          );
        })()}

        {conversation.length === 0 && (
          <p className="text-sm text-center py-8" style={{ color: c.textMuted }}>No strategy session available yet</p>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes blink {
          50% { opacity: 0; }
        }
        @keyframes typingDot {
          0%, 60%, 100% { opacity: 0.3; transform: scale(0.8); }
          30% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

/* ─── HCP Persona Tab ─── */

function HcpPersonaTab({ persona }: { persona: HcpPersona }) {
  const sections: { label: string; icon: React.ElementType; content: React.ReactNode }[] = [
    {
      label: "Professional Profile",
      icon: Briefcase,
      content: (
        <div className="space-y-2">
          <InfoRow label="Credentials" value={persona.credentials} />
          <InfoRow label="Sub-Specialty" value={persona.subSpecialty} />
          <InfoRow label="Location" value={persona.location} icon={<MapPin className="h-3 w-3" style={{ color: c.textMuted }} />} />
          <InfoRow label="Years in Practice" value={`${persona.yearsInPractice} years`} />
          <InfoRow label="Patient Volume" value={persona.patientVolume} />
          <InfoRow label="Affiliations" value={persona.affiliations.join(" · ")} />
        </div>
      ),
    },
    {
      label: "Prescribing Behavior",
      icon: Stethoscope,
      content: (
        <div className="space-y-3">
          <p className="text-sm leading-relaxed" style={{ color: c.textSecondary }}>{persona.prescribingBehavior}</p>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: c.textMuted }}>Current Top Therapies</p>
            <div className="flex flex-wrap gap-1.5">
              {persona.topTherapies.map((t) => (
                <span key={t} className="text-xs rounded-full px-2.5 py-0.5" style={{ color: c.textPrimary, border: `1px solid ${c.divider}`, background: c.card }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      label: "Communication Preferences",
      icon: MessageSquare,
      content: (
        <ul className="space-y-1.5">
          {persona.communicationPrefs.map((pref) => (
            <li key={pref} className="flex items-start gap-2 text-sm" style={{ color: c.textSecondary }}>
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full shrink-0" style={{ background: c.accent }} />
              {pref}
            </li>
          ))}
        </ul>
      ),
    },
    {
      label: "Decision Drivers",
      icon: TrendingUp,
      content: (
        <ul className="space-y-1.5">
          {persona.decisionDrivers.map((d) => (
            <li key={d} className="flex items-start gap-2 text-sm" style={{ color: c.textSecondary }}>
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full shrink-0" style={{ background: c.green }} />
              {d}
            </li>
          ))}
        </ul>
      ),
    },
    {
      label: "Influence & Publications",
      icon: GraduationCap,
      content: (
        <div className="space-y-2">
          <p className="text-sm" style={{ color: c.textSecondary }}>{persona.influence}</p>
          {persona.recentPublications.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: c.textMuted }}>Recent Publications</p>
              <ul className="space-y-1">
                {persona.recentPublications.map((pub) => (
                  <li key={pub} className="flex items-start gap-2 text-xs" style={{ color: c.textSecondary }}>
                    <FileText className="h-3 w-3 mt-0.5 shrink-0" style={{ color: c.accent }} />
                    {pub}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Engagement score */}
      <div className="flex items-center gap-4 rounded-xl border px-4 py-3" style={{ background: c.card, borderColor: c.cardBorder }}>
        <div className="relative flex h-14 w-14 items-center justify-center">
          <svg className="h-14 w-14 -rotate-90" viewBox="0 0 56 56">
            <circle cx="28" cy="28" r="24" fill="none" stroke={c.divider} strokeWidth="4" />
            <circle cx="28" cy="28" r="24" fill="none" stroke={persona.engagementScore >= 70 ? c.green : persona.engagementScore >= 40 ? c.orange : c.pink} strokeWidth="4" strokeDasharray={`${(persona.engagementScore / 100) * 150.8} 150.8`} strokeLinecap="round" />
          </svg>
          <span className="absolute text-sm font-bold" style={{ color: c.textPrimary }}>{persona.engagementScore}</span>
        </div>
        <div>
          <p className="text-sm font-semibold" style={{ color: c.textPrimary }}>Engagement Score</p>
          <p className="text-xs" style={{ color: c.textSecondary }}>
            {persona.engagementScore >= 70 ? "Highly engaged — strong conversion potential" : persona.engagementScore >= 40 ? "Moderately engaged — nurture recommended" : "Low engagement — early stage or cooling off"}
          </p>
        </div>
      </div>

      {/* Sections */}
      {sections.map((section) => {
        const Icon = section.icon;
        return (
          <div key={section.label} className="rounded-xl border p-4" style={{ background: c.card, borderColor: c.cardBorder }}>
            <div className="flex items-center gap-2 mb-3">
              <Icon className="h-4 w-4" style={{ color: c.accent }} />
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: c.textSecondary }}>{section.label}</span>
            </div>
            {section.content}
          </div>
        );
      })}
    </div>
  );
}

function InfoRow({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2">
      {icon}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: c.textMuted }}>{label}</p>
        <p className="text-sm" style={{ color: c.textPrimary }}>{value}</p>
      </div>
    </div>
  );
}
