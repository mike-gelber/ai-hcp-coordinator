/**
 * Demo seed script — reads data/demo-npis.json and upserts HcpProfile records
 * with isDemo: true. Idempotent: skips NPIs that already exist.
 *
 * Usage:  npx tsx prisma/seed.ts
 *         npm run db:seed
 */

import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

interface DemoNpiEntry {
  npi: string;
  firstName: string;
  lastName: string;
  specialty: string;
  state: string;
}

const prisma = new PrismaClient();

async function main() {
  const dataPath = path.resolve(__dirname, "../data/demo-npis.json");
  const raw = fs.readFileSync(dataPath, "utf-8");
  const entries: DemoNpiEntry[] = JSON.parse(raw);

  console.log(`📋 Loaded ${entries.length} demo NPI entries`);

  // Fetch existing NPIs so we can skip duplicates
  const existingNpis = new Set(
    (await prisma.hcpProfile.findMany({ select: { npi: true } })).map((r) => r.npi),
  );

  const toInsert = entries.filter((e) => !existingNpis.has(e.npi));
  console.log(`⏭️  Skipping ${entries.length - toInsert.length} already-existing NPIs`);
  console.log(`➕ Inserting ${toInsert.length} new demo HCP profiles…`);

  // Batch insert in chunks for performance
  const BATCH_SIZE = 100;
  let inserted = 0;

  for (let i = 0; i < toInsert.length; i += BATCH_SIZE) {
    const batch = toInsert.slice(i, i + BATCH_SIZE);

    await prisma.hcpProfile.createMany({
      data: batch.map((entry) => ({
        npi: entry.npi,
        firstName: entry.firstName,
        lastName: entry.lastName,
        primarySpecialty: entry.specialty,
        npiStatus: "validated",
        enrichmentStatus: "pending",
        isDemo: true,
      })),
      skipDuplicates: true,
    });

    inserted += batch.length;
    if (inserted % 200 === 0 || inserted === toInsert.length) {
      console.log(`   … ${inserted}/${toInsert.length} inserted`);
    }
  }

  // Ensure AppSettings singleton exists with demoMode = true
  await prisma.appSettings.upsert({
    where: { id: "singleton" },
    update: { demoMode: true },
    create: { id: "singleton", demoMode: true },
  });

  console.log(`✅ Demo seed complete — ${inserted} profiles inserted, demo mode activated`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
