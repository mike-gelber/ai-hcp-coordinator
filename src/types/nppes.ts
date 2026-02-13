/**
 * Type definitions for the NPPES NPI Registry API (v2.1).
 * API docs: https://npiregistry.cms.hhs.gov/api-page
 */

// ─── NPPES API Response Types ───────────────────────────────────────────────

export interface NppesApiResponse {
  result_count: number;
  results: NppesResult[] | null;
  Errors?: NppesError[];
}

export interface NppesError {
  description: string;
  field: string;
  number: string;
}

export interface NppesResult {
  /** NPI number (10 digits) */
  number: number;
  /** Enumeration type: "NPI-1" (individual) or "NPI-2" (organization) */
  enumeration_type: "NPI-1" | "NPI-2";
  created_epoch: number;
  last_updated_epoch: number;
  /** Date first assigned, e.g. "2005-07-08" */
  enumeration_date: string;
  /** Date last updated */
  last_updated: string;
  /** "A" = active, "D" = deactivated */
  status: "A" | "D";
  /** For individuals (NPI-1) */
  basic: NppesBasicInfo;
  /** Addresses (mailing + practice) */
  addresses: NppesAddress[];
  /** Taxonomy classifications (specialties) */
  taxonomies: NppesTaxonomy[];
  /** Practice identifiers (legacy) */
  practiceLocations: NppesPracticeLocation[];
  /** Other identifiers */
  identifiers: NppesIdentifier[];
  /** Endpoints (Direct addresses, etc.) */
  endpoints: NppesEndpoint[];
  /** Other names */
  other_names: NppesOtherName[];
}

export interface NppesBasicInfo {
  /** For individuals */
  first_name?: string;
  last_name?: string;
  middle_name?: string;
  credential?: string;
  sole_proprietor?: string;
  gender?: string;
  name_prefix?: string;
  name_suffix?: string;
  /** For organizations */
  organization_name?: string;
  organizational_subpart?: string;
  authorized_official_first_name?: string;
  authorized_official_last_name?: string;
  authorized_official_middle_name?: string;
  authorized_official_credential?: string;
  authorized_official_title_or_position?: string;
  authorized_official_telephone_number?: string;
  /** Deactivation info */
  deactivation_date?: string;
  deactivation_reason_code?: string;
  /** Reactivation info */
  reactivation_date?: string;
  /** NPI status: "A" for active */
  status: string;
  /** Enumeration date */
  enumeration_date: string;
  /** Last updated */
  last_updated: string;
  /** Name (for display) */
  name?: string;
  /** Name prefix */
  name_prefix_text?: string;
}

export interface NppesAddress {
  country_code: string;
  country_name: string;
  address_purpose: "LOCATION" | "MAILING";
  address_type: string;
  address_1: string;
  address_2?: string;
  city: string;
  state: string;
  postal_code: string;
  telephone_number?: string;
  fax_number?: string;
}

export interface NppesTaxonomy {
  code: string;
  taxonomy_group: string;
  desc: string;
  state: string;
  license: string;
  primary: boolean;
}

export interface NppesPracticeLocation {
  country_code: string;
  country_name: string;
  address_purpose: string;
  address_type: string;
  address_1: string;
  address_2?: string;
  city: string;
  state: string;
  postal_code: string;
  telephone_number?: string;
  fax_number?: string;
}

export interface NppesIdentifier {
  code: string;
  desc: string;
  identifier: string;
  issuer: string;
  state: string;
}

export interface NppesEndpoint {
  endpointType: string;
  endpointTypeDescription: string;
  endpoint: string;
  affiliation: string;
  affiliationName: string;
  use: string;
  useDescription: string;
  contentType: string;
  contentTypeDescription: string;
  contentOtherDescription: string;
  country_code: string;
  country_name: string;
  address_1: string;
  address_2?: string;
  city: string;
  state: string;
  postal_code: string;
}

export interface NppesOtherName {
  type: string;
  code: string;
  first_name?: string;
  last_name?: string;
  middle_name?: string;
  prefix?: string;
  suffix?: string;
  credential?: string;
  organization_name?: string;
}

// ─── Parsed Provider Info ───────────────────────────────────────────────────

export interface NppesProviderInfo {
  npi: string;
  enumerationType: "individual" | "organization";
  status: "active" | "deactivated";

  // Identity (individual)
  firstName?: string;
  lastName?: string;
  middleName?: string;
  credential?: string;
  gender?: string;
  namePrefix?: string;
  nameSuffix?: string;

  // Identity (organization)
  organizationName?: string;

  // Specialty / taxonomy
  primaryTaxonomy?: {
    code: string;
    description: string;
    license: string;
    state: string;
  };
  taxonomies: Array<{
    code: string;
    description: string;
    primary: boolean;
    license: string;
    state: string;
  }>;

  // Addresses
  practiceAddresses: Array<{
    address1: string;
    address2?: string;
    city: string;
    state: string;
    postalCode: string;
    phone?: string;
    fax?: string;
  }>;
  mailingAddresses: Array<{
    address1: string;
    address2?: string;
    city: string;
    state: string;
    postalCode: string;
    phone?: string;
    fax?: string;
  }>;

  // Dates
  enumerationDate: string;
  lastUpdated: string;

  // Deactivation
  deactivationDate?: string;
  deactivationReasonCode?: string;
  reactivationDate?: string;
}

// ─── NPI Validation Result ──────────────────────────────────────────────────

export type NpiValidationStatus =
  | "validated"
  | "invalid"
  | "deactivated"
  | "organization";

export interface NpiValidationResult {
  npi: string;
  status: NpiValidationStatus;
  /** Human-readable reason for the status */
  reason: string;
  /** Provider info (present when status is "validated", "deactivated", or "organization") */
  provider?: NppesProviderInfo;
  /** Timestamp of when validation was performed */
  validatedAt: string;
  /** Whether the result was served from cache */
  cached: boolean;
}

// ─── Batch Validation ───────────────────────────────────────────────────────

export interface BatchValidationOptions {
  /** Max concurrent requests (default: 2 to respect rate limits) */
  concurrency?: number;
}

export interface BatchValidationResult {
  results: NpiValidationResult[];
  summary: {
    total: number;
    validated: number;
    invalid: number;
    deactivated: number;
    organization: number;
  };
}
