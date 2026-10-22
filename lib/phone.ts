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
 * Normalizes input to E.164 international standard format
 * e.g., countryCode "+91", raw "9876543210" => "+919876543210"
 */
export function formatToE164(countryCode: string, raw: string): string {
  if (!raw) return "";

  // Strip all non-digit characters
  let digits = raw.replace(/\D/g, "");

  // If user included country code digits at the start, remove them from national part
  const cleanCode = countryCode.replace(/\D/g, "");
  if (digits.startsWith(cleanCode) && digits.length > cleanCode.length) {
    digits = digits.slice(cleanCode.length);
  }

  // Remove leading zeros
  digits = digits.replace(/^0+/, "");

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

  // Strip non-digit characters
  let digits = raw.replace(/\D/g, "");

  // Strip country code if included
  const cleanCode = countryCode.replace(/\D/g, "");
  if (digits.startsWith(cleanCode) && digits.length > cleanCode.length) {
    digits = digits.slice(cleanCode.length);
  }
  digits = digits.replace(/^0+/, "");

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
    if (digits.length < 7 || digits.length > 14) {
      return {
        isValid: false,
        error: "Phone number must be between 7 and 14 digits",
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
 * e.g., "+919876543210" => "+91 98*** **210"
 */
export function maskPhoneNumber(phoneNumber: string): string {
  if (!phoneNumber) return "";

  const trimmed = phoneNumber.trim();

  // Extract country code if present
  let prefix = "";
  let body = trimmed;

  if (trimmed.startsWith("+")) {
    const match = trimmed.match(/^(\+\d{1,3})/);
    if (match) {
      prefix = match[1] + " ";
      body = trimmed.slice(match[1].length).replace(/\D/g, "");
    }
  } else {
    body = trimmed.replace(/\D/g, "");
  }

  if (body.length <= 4) {
    return `${prefix}${body}`;
  }

  const start = body.slice(0, 2);
  const end = body.slice(-3);
  return `${prefix}${start}*** **${end}`;
}
