/**
 * Server-side utilities for checking and managing demo mode.
 */

import { prisma } from "@/lib/db";

/**
 * Returns true if demo mode is currently active.
 */
export async function isDemoMode(): Promise<boolean> {
  const settings = await prisma.appSettings.findUnique({
    where: { id: "singleton" },
  });
  return settings?.demoMode ?? false;
}

/**
 * Returns the count of demo HCP profiles in the database.
 */
export async function getDemoHcpCount(): Promise<number> {
  return prisma.hcpProfile.count({ where: { isDemo: true } });
}

/**
 * Returns the full demo mode status.
 */
export async function getDemoStatus(): Promise<{
  active: boolean;
  demoHcpCount: number;
}> {
  const [active, demoHcpCount] = await Promise.all([
    isDemoMode(),
    getDemoHcpCount(),
  ]);
  return { active, demoHcpCount };
}
