/**
 * Database utility functions for HCP profile operations.
 */

import { prisma } from "./db";
import type { HcpSearchFilters, PaginatedResult, HcpStats } from "@/types/search";
import type { Prisma, HcpProfile } from "@prisma/client";

/** All relations to include when loading a full HCP profile */
const allHcpRelations = {
  locations: true,
  affiliations: true,
  publications: true,
  socialProfiles: true,
  prescribingData: true,
  outreachPlans: true,
  enrichmentLogs: true,
  clinicalTrials: true,
  conversationLogs: true,
  proprietaryData: true,
} satisfies Prisma.HcpProfileInclude;

/**
 * Fetch an HCP profile by NPI number with all relations.
 */
export async function getHcpByNpi(npi: string) {
  return prisma.hcpProfile.findUnique({
    where: { npi },
    include: allHcpRelations,
  });
}

/**
 * Fetch an HCP profile by ID with all related data.
 */
export async function getHcpWithRelations(id: string) {
  return prisma.hcpProfile.findUnique({
    where: { id },
    include: allHcpRelations,
  });
}

/**
 * Search HCP profiles with filters and pagination.
 */
export async function searchHcps(
  filters: HcpSearchFilters = {},
): Promise<PaginatedResult<HcpProfile>> {
  const {
    specialty,
    state,
    enrichmentStatus,
    npiStatus,
    isDemo,
    page = 1,
    pageSize = 20,
    sortBy = "lastName",
    sortOrder = "asc",
  } = filters;

  const where: Prisma.HcpProfileWhereInput = {};

  if (specialty) {
    where.primarySpecialty = specialty;
  }

  if (enrichmentStatus) {
    where.enrichmentStatus = enrichmentStatus;
  }

  if (npiStatus) {
    where.npiStatus = npiStatus;
  }

  if (isDemo !== undefined) {
    where.isDemo = isDemo;
  }

  if (state) {
    where.locations = {
      some: { state },
    };
  }

  const [data, total] = await Promise.all([
    prisma.hcpProfile.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.hcpProfile.count({ where }),
  ]);

  return {
    data,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

/**
 * Return aggregate stats about HCP profiles.
 */
export async function getHcpStats(): Promise<HcpStats> {
  const [total, enrichmentGroups, npiGroups, specialtyGroups, demoCount] = await Promise.all([
    prisma.hcpProfile.count(),
    prisma.hcpProfile.groupBy({
      by: ["enrichmentStatus"],
      _count: { _all: true },
    }),
    prisma.hcpProfile.groupBy({
      by: ["npiStatus"],
      _count: { _all: true },
    }),
    prisma.hcpProfile.groupBy({
      by: ["primarySpecialty"],
      _count: { _all: true },
    }),
    prisma.hcpProfile.count({ where: { isDemo: true } }),
  ]);

  const byEnrichmentStatus: Record<string, number> = {};
  for (const g of enrichmentGroups) {
    byEnrichmentStatus[g.enrichmentStatus] = g._count._all;
  }

  const byNpiStatus: Record<string, number> = {};
  for (const g of npiGroups) {
    byNpiStatus[g.npiStatus] = g._count._all;
  }

  const bySpecialty: Record<string, number> = {};
  for (const g of specialtyGroups) {
    const key = g.primarySpecialty ?? "unknown";
    bySpecialty[key] = g._count._all;
  }

  return {
    total,
    byEnrichmentStatus,
    byNpiStatus,
    bySpecialty,
    demoCount,
  };
}

/**
 * Update the enrichment status of an HCP profile.
 */
export async function updateHcpEnrichmentStatus(hcpId: string, status: string) {
  return prisma.hcpProfile.update({
    where: { id: hcpId },
    data: { enrichmentStatus: status },
  });
}
