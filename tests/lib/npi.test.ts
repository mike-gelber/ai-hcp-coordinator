import {
  isValidNpiFormat,
  isValidNpiCheckDigit,
  validateNpi,
} from "@/lib/npi";

describe("isValidNpiFormat", () => {
  it("accepts a valid 10-digit NPI", () => {
    expect(isValidNpiFormat("1234567893")).toBe(true);
  });

  it("rejects NPI shorter than 10 digits", () => {
    expect(isValidNpiFormat("123456789")).toBe(false);
  });

  it("rejects NPI longer than 10 digits", () => {
    expect(isValidNpiFormat("12345678901")).toBe(false);
  });

  it("rejects NPI with non-digit characters", () => {
    expect(isValidNpiFormat("123456789a")).toBe(false);
    expect(isValidNpiFormat("12345-6789")).toBe(false);
  });

  it("rejects empty string", () => {
    expect(isValidNpiFormat("")).toBe(false);
  });

  it("rejects NPI with spaces", () => {
    expect(isValidNpiFormat("1234 56789")).toBe(false);
    expect(isValidNpiFormat(" 1234567893")).toBe(false);
  });
});

describe("isValidNpiCheckDigit", () => {
  // Known valid NPIs (pass Luhn with 80840 prefix)
  it("returns true for a known valid NPI", () => {
    expect(isValidNpiCheckDigit("1234567893")).toBe(true);
  });

  it("returns true for another known valid NPI", () => {
    expect(isValidNpiCheckDigit("1245319599")).toBe(true);
  });

  it("returns true for NPI 1679576722", () => {
    expect(isValidNpiCheckDigit("1679576722")).toBe(true);
  });

  it("returns false for an invalid check digit", () => {
    // 1234567890 has wrong check digit (should be 3)
    expect(isValidNpiCheckDigit("1234567890")).toBe(false);
  });

  it("returns false for a different invalid check digit", () => {
    expect(isValidNpiCheckDigit("1234567891")).toBe(false);
  });

  it("returns false for invalid format (not 10 digits)", () => {
    expect(isValidNpiCheckDigit("12345")).toBe(false);
  });
});

describe("validateNpi", () => {
  it("returns valid for a correct NPI", () => {
    const result = validateNpi("1234567893");
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it("returns error for empty input", () => {
    const result = validateNpi("");
    expect(result.valid).toBe(false);
    expect(result.error).toBe("NPI is empty");
  });

  it("returns error for whitespace-only input", () => {
    const result = validateNpi("   ");
    expect(result.valid).toBe(false);
    expect(result.error).toBe("NPI is empty");
  });

  it("returns format error for non-10-digit string", () => {
    const result = validateNpi("12345");
    expect(result.valid).toBe(false);
    expect(result.error).toBe("NPI must be exactly 10 digits");
  });

  it("returns Luhn error for wrong check digit", () => {
    const result = validateNpi("1234567890");
    expect(result.valid).toBe(false);
    expect(result.error).toBe("NPI failed Luhn check digit validation");
  });

  it("trims whitespace before validating", () => {
    const result = validateNpi("  1234567893  ");
    expect(result.valid).toBe(true);
  });
});
