/**
 * Search, filter, and pagination types for HCP queries.
 */

export interface HcpSearchFilters {
  /** Filter by primary specialty (exact match) */
  specialty?: string;
  /** Filter by state (matches any location) */
  state?: string;
  /** Filter by enrichment status: pending, in_progress, complete, failed */
  enrichmentStatus?: string;
  /** Filter by NPI validation status: pending, validated, invalid, deactivated */
  npiStatus?: string;
  /** Filter by demo flag */
  isDemo?: boolean;
  /** Page number (1-based, default 1) */
  page?: number;
  /** Number of results per page (default 20) */
  pageSize?: number;
  /** Field to sort by */
  sortBy?: "lastName" | "createdAt" | "updatedAt" | "primarySpecialty";
  /** Sort direction */
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface HcpStats {
  total: number;
  byEnrichmentStatus: Record<string, number>;
  byNpiStatus: Record<string, number>;
  bySpecialty: Record<string, number>;
  demoCount: number;
}
