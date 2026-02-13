Introduces two AI-powered field force agents (Strategist and Outreach Specialist) within each HCP profile view, addressing HCP-35. The agents collaborate in a contextual dialogue tailored to each HCP's profile data.

## What's New

### AI Field Force Agents
- **Strategist (Dr. Strategy)**: Analyzes HCP data — prescribing patterns, digital footprint, affiliations, KOL status — to craft the optimal engagement strategy
- **Outreach Specialist (Alex Outreach)**: Plans and executes multi-channel outreach campaigns, drafts personalized messages, reports on engagement results

### Features
- Contextual 8-message dialogue customized to each HCP's profile (specialty, prescribing volume, digital presence, etc.)
- Animated message appearance with typing indicators for a real-time collaboration feel
- Metadata badges (analysis, recommendation, action, report) and tags on each message
- Compliance guardrails and engagement probability assessments built into the conversation
- Integrated as a new "AI Field Force" tab in the existing HCP profile detail page
- "AI Agents: 2 Active" badge in the HCP table

## Screenshots

### Dashboard — HCP Table with AI Agents Column
![Dashboard](https://raw.githubusercontent.com/mike-gelber/ai-hcp-coordinator/cursor/HCP-35-hcp-ai-field-force-agents-6a6e/docs/screenshots/dashboard.png)

### HCP Profile Detail — Professional Tab with AI Field Force Tab
![HCP Detail](https://raw.githubusercontent.com/mike-gelber/ai-hcp-coordinator/cursor/HCP-35-hcp-ai-field-force-agents-6a6e/docs/screenshots/hcp-detail.png)

### AI Field Force Tab — Agent Dialogue
The Strategist and Outreach Specialist collaborate on channel strategy, timing, and messaging:
![AI Field Force Tab](https://raw.githubusercontent.com/mike-gelber/ai-hcp-coordinator/cursor/HCP-35-hcp-ai-field-force-agents-6a6e/docs/screenshots/ai-field-force-tab.png)

### Agent Dialogue — Final Status & Deployment
The agents finalize outreach, review compliance, and confirm campaign deployment:
![Agent Dialogue](https://raw.githubusercontent.com/mike-gelber/ai-hcp-coordinator/cursor/HCP-35-hcp-ai-field-force-agents-6a6e/docs/screenshots/agent-dialogue.png)

## Files Changed
- `src/types/agents.ts` — Agent type definitions and persona constants
- `src/lib/agent-conversation.ts` — Contextual dialogue generator based on HCP profile data
- `src/app/api/agents/dialogue/route.ts` — API endpoint for fetching agent dialogues
- `src/components/AgentDialogue.tsx` — Animated conversation UI component
- `src/components/hcp-profile/AiFieldForceTab.tsx` — Tab wrapper integrating agents into HCP detail view
- `src/app/hcp/[npi]/page.tsx` — Added "AI Field Force" tab
- `src/components/HcpTable.tsx` — Added AI Agents column and navigation

---
Linear Issue: [HCP-35](https://linear.app/mike-gelber/issue/HCP-35/hcp-level-ai-field-force)
