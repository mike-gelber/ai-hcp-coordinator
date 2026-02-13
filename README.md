# AI HCP Field Force

AI-powered pharma field force for engaging Healthcare Professionals (HCPs). Ingests NPI target lists, enriches HCP profiles with web-scraped and proprietary data, and deploys personalized AI agents that craft ultra-customized multi-channel outreach plans (email, SMS, direct mail, social) based on each HCP's demographics, professional background, and prescribing behavior.

## Tech Stack

| Layer         | Technology                 |
| ------------- | -------------------------- |
| Framework     | Next.js 15 (App Router)    |
| Language      | TypeScript 5               |
| Database      | PostgreSQL 16 + Prisma ORM |
| Cache / Queue | Redis 7 + BullMQ           |
| AI            | OpenAI API                 |
| Styling       | Tailwind CSS v4            |
| Linting       | ESLint 9 + Prettier        |
| Testing       | Jest + ts-jest             |
| CI/CD         | GitHub Actions             |
| Containers    | Docker & Docker Compose    |

## Prerequisites

- **Node.js** 20+ (recommended: use [nvm](https://github.com/nvm-sh/nvm))
- **Docker** & **Docker Compose** v2+
- **npm** 10+ (ships with Node.js 20)
- An **OpenAI API key** (optional for demo mode)

## Quick Start

### Option A: Docker Compose (recommended)

The fastest way to get a fully working local environment:

```bash
# 1. Clone the repo
git clone https://github.com/mike-gelber/ai-hcp-coordinator.git
cd ai-hcp-coordinator

# 2. Copy and configure environment variables
cp .env.example .env
# Edit .env with your actual values (OpenAI key, etc.)

# 3. Start the full stack (app + Postgres + Redis)
docker compose up
```

This will:

- Build the Next.js development server
- Start PostgreSQL 16 and Redis 7
- The app will be available at [http://localhost:3000](http://localhost:3000)

### Option B: Local Development (without Docker for the app)

```bash
# 1. Clone the repo
git clone https://github.com/mike-gelber/ai-hcp-coordinator.git
cd ai-hcp-coordinator

# 2. Copy and configure environment variables
cp .env.example .env

# 3. Start infrastructure only (Postgres + Redis)
docker compose up -d db redis

# 4. Install dependencies
npm install

# 5. Generate Prisma client
npx prisma generate

# 6. Run database migrations
npx prisma migrate dev

# 7. (Optional) Seed the database with demo data
npm run db:seed

# 8. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Environment Variables

All environment variables are documented in `.env.example` and validated at runtime using Zod (see `src/lib/env.ts`).

| Variable              | Required | Default                                                            | Description                      |
| --------------------- | -------- | ------------------------------------------------------------------ | -------------------------------- |
| `DATABASE_URL`        | Yes      | `postgresql://postgres:postgres@localhost:5432/ai_hcp_coordinator` | PostgreSQL connection string     |
| `REDIS_URL`           | Yes      | `redis://localhost:6379`                                           | Redis connection string          |
| `OPENAI_API_KEY`      | No       | —                                                                  | OpenAI API key (for AI features) |
| `NPPES_API_URL`       | No       | `https://npiregistry.cms.hhs.gov/api/`                             | CMS NPI Registry endpoint        |
| `NEXT_PUBLIC_APP_URL` | No       | `http://localhost:3000`                                            | Public app URL                   |
| `DEMO_MODE`           | No       | `false`                                                            | Enable demo mode                 |
| `NODE_ENV`            | No       | `development`                                                      | Node environment                 |

## Available Scripts

| Command                | Description                            |
| ---------------------- | -------------------------------------- |
| `npm run dev`          | Start Next.js development server       |
| `npm run build`        | Build for production                   |
| `npm run start`        | Start production server                |
| `npm run lint`         | Run ESLint                             |
| `npm run lint:fix`     | Run ESLint with auto-fix               |
| `npm run format`       | Format code with Prettier              |
| `npm run format:check` | Check code formatting                  |
| `npm run typecheck`    | Run TypeScript type checking           |
| `npm run test`         | Run tests                              |
| `npm run test:watch`   | Run tests in watch mode                |
| `npm run test:ci`      | Run tests with coverage (CI mode)      |
| `npm run db:generate`  | Generate Prisma client                 |
| `npm run db:migrate`   | Run database migrations (dev)          |
| `npm run db:push`      | Push schema to database (no migration) |
| `npm run db:seed`      | Seed database with demo data           |
| `npm run db:studio`    | Open Prisma Studio GUI                 |

## Project Structure

```
ai-hcp-coordinator/
├── .github/
│   └── workflows/
│       └── ci.yml            # GitHub Actions CI pipeline
├── prisma/
│   ├── migrations/           # Database migrations
│   ├── schema.prisma         # Prisma schema definition
│   └── seed.ts               # Demo data seeder
├── src/
│   ├── app/                  # Next.js App Router pages & API routes
│   │   ├── api/              # REST API endpoints
│   │   │   ├── demo/         # Demo mode endpoints
│   │   │   └── npi/          # NPI upload & validation
│   │   ├── dashboard/        # Dashboard page
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Home page
│   ├── components/           # React components
│   ├── lib/                  # Shared utilities
│   │   ├── db.ts             # Prisma client singleton
│   │   ├── db-utils.ts       # Database utility functions
│   │   ├── env.ts            # Environment variable validation
│   │   ├── npi.ts            # NPI validation utilities
│   │   └── utils.ts          # General utilities
│   ├── services/             # Business logic services
│   └── types/                # TypeScript type definitions
├── tests/                    # Test files
├── data/                     # Static data files
├── docker-compose.yml        # Full local dev stack
├── Dockerfile                # Production Docker image
├── Dockerfile.dev            # Development Docker image
├── .env.example              # Environment variable template
├── .prettierrc               # Prettier configuration
├── eslint.config.mjs         # ESLint configuration
├── jest.config.js            # Jest configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Dependencies & scripts
```

## CI/CD

GitHub Actions runs automatically on every pull request and push to `main`:

1. **Lint & Format** — ESLint, Prettier check, TypeScript type check
2. **Test** — Jest unit tests with PostgreSQL and Redis service containers
3. **Build** — Next.js production build
4. **Docker** — Docker image build verification

See `.github/workflows/ci.yml` for the full pipeline configuration.

## Database Migrations

We use Prisma Migrate for database schema management:

```bash
# Create a new migration after editing prisma/schema.prisma
npx prisma migrate dev --name describe_your_change

# Apply migrations in production
npx prisma migrate deploy

# Reset the database (caution: destroys all data)
npx prisma migrate reset
```

## Demo Mode

Click "Enter Demo Mode" on the home page to load ~1,000 sample NPI numbers and see the full pipeline in action. You can also set `DEMO_MODE=true` in your `.env` file.

## Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Ensure `npm run lint`, `npm run format:check`, and `npm run test` pass
4. Open a pull request — CI will run automatically

Pre-commit hooks (Husky + lint-staged) will automatically lint and format staged files on commit.

## Linear Project

This project is tracked in Linear under the **AI HCP Field Force** project.
