/**
 * NPI (National Provider Identifier) utility functions.
 * NPI is a 10-digit number with a Luhn check digit.
 */

/**
 * Validates NPI format: must be exactly 10 digits.
 */
export function isValidNpiFormat(npi: string): boolean {
  return /^\d{10}$/.test(npi);
}

/**
 * Validates NPI using the Luhn algorithm (ISO/IEC 7812).
 * The NPI is prefixed with "80840" before applying Luhn.
 */
export function isValidNpiCheckDigit(npi: string): boolean {
  if (!isValidNpiFormat(npi)) return false;

  // Prefix with 80840 per CMS specification
  const prefixed = "80840" + npi;
  const digits = prefixed.split("").map(Number);

  let sum = 0;
  let alternate = false;

  // Process from right to left (excluding check digit at the end)
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = digits[i];
    if (alternate) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alternate = !alternate;
  }

  return sum % 10 === 0;
}

/**
 * Full NPI validation: format + Luhn check.
 */
export function validateNpi(npi: string): {
  valid: boolean;
  error?: string;
} {
  const cleaned = npi.trim();

  if (!cleaned) {
    return { valid: false, error: "NPI is empty" };
  }

  if (!isValidNpiFormat(cleaned)) {
    return { valid: false, error: "NPI must be exactly 10 digits" };
  }

  if (!isValidNpiCheckDigit(cleaned)) {
    return { valid: false, error: "NPI failed Luhn check digit validation" };
  }

  return { valid: true };
}
