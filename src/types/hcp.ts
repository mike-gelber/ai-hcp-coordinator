/**
 * Core HCP (Healthcare Professional) types used throughout the application.
 */

export interface HcpIdentity {
  npi: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  credentials?: string;
  gender?: string;
  photoUrl?: string;
}

export interface HcpLocation {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  phone?: string;
  fax?: string;
  isPrimary: boolean;
}

export interface HcpProfessional {
  primarySpecialty?: string;
  subSpecialty?: string;
  boardCertifications: string[];
  yearsInPractice?: number;
  medicalSchool?: string;
  residency?: string;
  enumerationDate?: string;
}

export interface HcpAffiliation {
  organizationName: string;
  type: "hospital" | "group_practice" | "academic" | "other";
  role?: string;
  isPrimary: boolean;
}

export interface NpiUploadResult {
  uploadId: string;
  fileName: string;
  totalRows: number;
  validNpis: number;
  invalidNpis: number;
  duplicates: number;
  errors: Array<{
    row: number;
    npi: string;
    error: string;
  }>;
}

export interface NpesProviderResult {
  npi: string;
  active: boolean;
  type: "individual" | "organization";
  firstName?: string;
  lastName?: string;
  credential?: string;
  gender?: string;
  primarySpecialty?: string;
  addresses: HcpLocation[];
  enumerationDate?: string;
  lastUpdated?: string;
  deactivationDate?: string;
  deactivationReasonCode?: string;
}

export type EnrichmentStage = "nppes" | "web_scrape" | "publications" | "prescribing" | "social";

export type EnrichmentStatus = "pending" | "in_progress" | "complete" | "failed";

export type NpiValidationStatus = "pending" | "validated" | "invalid" | "deactivated";
