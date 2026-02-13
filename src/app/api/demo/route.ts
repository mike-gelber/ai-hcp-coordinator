/**
 * Demo mode API endpoint.
 *
 * GET    — Returns current demo mode status and count of demo HCPs.
 * POST   — Activates demo mode: seeds demo NPIs, sets demoMode = true.
 * DELETE — Deactivates demo mode: removes all demo HCPs, sets demoMode = false.
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getDemoStatus } from "@/lib/demo";
import * as fs from "fs";
import * as path from "path";

interface DemoNpiEntry {
  npi: string;
  firstName: string;
  lastName: string;
  specialty: string;
  state: string;
}

// ─── GET: Demo mode status ──────────────────────────────────────────

export async function GET() {
  try {
    const status = await getDemoStatus();
    return NextResponse.json(status);
  } catch (error) {
    console.error("Failed to get demo status:", error);
    return NextResponse.json(
      { error: "Failed to get demo status" },
      { status: 500 },
    );
  }
}

// ─── POST: Activate demo mode ───────────────────────────────────────

export async function POST() {
  try {
    // Load seed data
    const dataPath = path.resolve(process.cwd(), "data/demo-npis.json");
    const raw = fs.readFileSync(dataPath, "utf-8");
    const entries: DemoNpiEntry[] = JSON.parse(raw);

    // Find which NPIs already exist
    const existingNpis = new Set(
      (await prisma.hcpProfile.findMany({ select: { npi: true } })).map(
        (r) => r.npi,
      ),
    );

    const toInsert = entries.filter((e) => !existingNpis.has(e.npi));

    // Batch insert
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
    }

    // Activate demo mode
    await prisma.appSettings.upsert({
      where: { id: "singleton" },
      update: { demoMode: true },
      create: { id: "singleton", demoMode: true },
    });

    const status = await getDemoStatus();

    return NextResponse.json({
      message: "Demo mode activated",
      inserted,
      skipped: entries.length - toInsert.length,
      ...status,
    });
  } catch (error) {
    console.error("Failed to activate demo mode:", error);
    return NextResponse.json(
      { error: "Failed to activate demo mode" },
      { status: 500 },
    );
  }
}

// ─── DELETE: Deactivate demo mode ───────────────────────────────────

export async function DELETE() {
  try {
    // Delete all demo HCP profiles (cascades to related records)
    const deleted = await prisma.hcpProfile.deleteMany({
      where: { isDemo: true },
    });

    // Deactivate demo mode
    await prisma.appSettings.upsert({
      where: { id: "singleton" },
      update: { demoMode: false },
      create: { id: "singleton", demoMode: false },
    });

    return NextResponse.json({
      message: "Demo mode deactivated",
      deletedProfiles: deleted.count,
      active: false,
      demoHcpCount: 0,
    });
  } catch (error) {
    console.error("Failed to deactivate demo mode:", error);
    return NextResponse.json(
      { error: "Failed to deactivate demo mode" },
      { status: 500 },
    );
  }
}
