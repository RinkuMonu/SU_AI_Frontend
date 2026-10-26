/**
 * International Phone Number Utilities & E.164 Normalization
 */

export interface CountryCode {
  code: string;
  country: string;
  flag: string;
  digits: number;
}

export const COUNTRY_CODES: CountryCode[] = [
  { code: "+91", country: "India", flag: "🇮🇳", digits: 10 },
  { code: "+1", country: "United States", flag: "🇺🇸", digits: 10 },
  { code: "+1", country: "Canada", flag: "🇨🇦", digits: 10 },
  { code: "+44", country: "United Kingdom", flag: "🇬🇧", digits: 10 },
  { code: "+971", country: "UAE", flag: "🇦🇪", digits: 9 },
  { code: "+61", country: "Australia", flag: "🇦🇺", digits: 9 },
  { code: "+65", country: "Singapore", flag: "🇸🇬", digits: 8 },
  { code: "+966", country: "Saudi Arabia", flag: "🇸🇦", digits: 9 },
  { code: "+49", country: "Germany", flag: "🇩🇪", digits: 10 },
  { code: "+33", country: "France", flag: "🇫🇷", digits: 9 },
];

/**
 * Cleans user-entered national phone input:
 * - Strips non-digit characters
 * - Strips accidental country code if user typed or pasted it
 * - Strips leading zeros
 * - Limits national length according to selected country code (e.g. exactly 10 for India)
 */
export function sanitizeNationalNumber(countryCode: string, input: string): string {
  if (!input) return "";

  let cleaned = input.trim();

  // If user pasted with a '+', strip country code
  const cleanCode = countryCode.replace(/\D/g, "");
  if (cleaned.startsWith("+")) {
    const withoutPlus = cleaned.slice(1);
    if (withoutPlus.startsWith(cleanCode)) {
      cleaned = withoutPlus.slice(cleanCode.length);
    }
  }

  // Extract digits only
  let digits = cleaned.replace(/\D/g, "");

  // If user included country code digits at the start without '+', remove them
  if (digits.startsWith(cleanCode) && digits.length > cleanCode.length) {
    digits = digits.slice(cleanCode.length);
  }

  // Remove leading zeros
  digits = digits.replace(/^0+/, "");

  // Limit digits based on selected country
  const matched = COUNTRY_CODES.find((c) => c.code === countryCode);
  const maxDigits = matched ? matched.digits : 15;
  if (digits.length > maxDigits) {
    digits = digits.slice(0, maxDigits);
  }

  return digits;
}

/**
 * Normalizes input to E.164 international standard format
 * e.g., countryCode "+91", raw "9876543210" => "+919876543210"
 */
export function formatToE164(countryCode: string, raw: string): string {
  if (!raw) return "";

  const digits = sanitizeNationalNumber(countryCode, raw);
  if (!digits) return "";

  return `${countryCode}${digits}`;
}

/**
 * Validates national phone number based on selected country code
 */
export function validatePhoneNumber(
  countryCode: string,
  raw: string
): { isValid: boolean; error?: string; e164: string } {
  if (!raw || !raw.trim()) {
    return { isValid: false, error: "Phone number is required", e164: "" };
  }

  const digits = sanitizeNationalNumber(countryCode, raw);

  if (digits.length === 0) {
    return { isValid: false, error: "Please enter a valid phone number", e164: "" };
  }

  // Country specific validations
  if (countryCode === "+91") {
    if (digits.length !== 10) {
      return {
        isValid: false,
        error: "Indian phone numbers must be exactly 10 digits",
        e164: "",
      };
    }
    if (!/^[6-9]/.test(digits)) {
      return {
        isValid: false,
        error: "Indian mobile numbers must start with 6, 7, 8, or 9",
        e164: "",
      };
    }
  } else {
    // International standard: ITU-T E.164 recommends max 15 digits total, min 7
    const matched = COUNTRY_CODES.find((c) => c.code === countryCode);
    const expectedDigits = matched ? matched.digits : null;
    if (expectedDigits && digits.length !== expectedDigits) {
      return {
        isValid: false,
        error: `${matched?.country || "Phone"} numbers must be ${expectedDigits} digits`,
        e164: "",
      };
    }
    if (digits.length < 7 || digits.length > 15) {
      return {
        isValid: false,
        error: "Phone number must be between 7 and 15 digits",
        e164: "",
      };
    }
  }

  return {
    isValid: true,
    e164: `${countryCode}${digits}`,
  };
}

/**
 * Formats a phone number for secure display by masking intermediate digits
 * e.g., "+916261234655" => "+91 62*** **655"
 * Never absorbs the first national digit into the country code.
 */
export function maskPhoneNumber(phoneNumber: string, explicitCountryCode?: string): string {
  if (!phoneNumber) return "";

  const trimmed = phoneNumber.trim();

  let prefix = "";
  let body = trimmed;

  if (explicitCountryCode) {
    prefix = `${explicitCountryCode} `;
    if (trimmed.startsWith(explicitCountryCode)) {
      body = trimmed.slice(explicitCountryCode.length).replace(/\D/g, "");
    } else {
      body = trimmed.replace(/\D/g, "");
    }
  } else if (trimmed.startsWith("+")) {
    // Match against known country codes from longest to shortest to prevent greedy partial matching
    const sortedCodes = [...COUNTRY_CODES]
      .map((c) => c.code)
      .filter((v, i, a) => a.indexOf(v) === i)
      .sort((a, b) => b.length - a.length);

    let matchedCode = "";
    for (const code of sortedCodes) {
      if (trimmed.startsWith(code)) {
        matchedCode = code;
        break;
      }
    }

    if (matchedCode) {
      prefix = `${matchedCode} `;
      body = trimmed.slice(matchedCode.length).replace(/\D/g, "");
    } else {
      const fallbackMatch = trimmed.match(/^(\+\d{1,3})/);
      if (fallbackMatch) {
        prefix = fallbackMatch[1] + " ";
        body = trimmed.slice(fallbackMatch[1].length).replace(/\D/g, "");
      }
    }
  } else {
    body = trimmed.replace(/\D/g, "");
  }

  // Remove leading zeros from national body
  body = body.replace(/^0+/, "");

  if (body.length <= 4) {
    return `${prefix}${body}`;
  }

  const start = body.slice(0, 2);
  const end = body.slice(-3);
  return `${prefix}${start}*** **${end}`;
}
