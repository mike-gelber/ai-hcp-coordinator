# AI HCP Field Force

AI-powered pharma field force for engaging Healthcare Professionals (HCPs). Ingests NPI target lists, enriches HCP profiles with web-scraped and proprietary data, and deploys personalized AI agents that craft ultra-customized multi-channel outreach plans.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL 16 + Prisma ORM
- **Cache/Queue**: Redis + BullMQ
- **AI**: OpenAI API
- **Styling**: Tailwind CSS v4
- **Containerization**: Docker Compose

## Getting Started

### Prerequisites

- Node.js 20+
- Docker & Docker Compose
- An OpenAI API key (for AI agent features)

### Setup

```bash
# Clone the repo
git clone https://github.com/mike-gelber/ai-hcp-coordinator.git
cd ai-hcp-coordinator

# Copy environment variables
cp .env.example .env
# Edit .env with your actual values

# Start infrastructure (Postgres + Redis)
docker compose up -d

# Install dependencies
npm install

# Generate Prisma client and run migrations
npx prisma generate
npx prisma db push

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Demo Mode

Click "Enter Demo Mode" on the home page to load ~1,000 sample NPI numbers and see the full pipeline in action.

## Project Structure

```
ai-hcp-coordinator/
├── prisma/              # Database schema & migrations
│   ├── schema.prisma    # Prisma schema
│   └── seed.ts          # Demo data seeder
├── src/
│   ├── app/             # Next.js App Router pages & API routes
│   │   ├── api/         # REST API endpoints
│   │   │   ├── demo/    # Demo mode endpoints
│   │   │   └── npi/     # NPI upload & validation
│   │   ├── layout.tsx   # Root layout
│   │   └── page.tsx     # Home page
│   ├── components/      # React components
│   ├── lib/             # Shared utilities
│   │   ├── db.ts        # Prisma client singleton
│   │   ├── npi.ts       # NPI validation utilities
│   │   └── utils.ts     # General utilities
│   ├── services/        # Business logic services
│   └── types/           # TypeScript type definitions
├── data/                # Static data files (seed NPIs, taxonomy codes)
├── tests/               # Test files
├── docker-compose.yml   # Local infrastructure
└── package.json
```

## Linear Project

This project is tracked in Linear under the **AI HCP Field Force** project in the `ai-hcp-coordinator` team.
