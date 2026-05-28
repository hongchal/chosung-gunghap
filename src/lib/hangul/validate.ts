const HANGUL_SYLLABLE_RE = /^[가-힣]+$/;

export type ValidationErrorCode =
  | "INVALID_INPUT_NON_HANGUL"
  | "INVALID_INPUT_LENGTH"
  | "INVALID_INPUT_PROFANITY";

export class HangulValidationError extends Error {
  constructor(
    public code: ValidationErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "HangulValidationError";
  }
}

export interface ValidationOptions {
  minLength?: number;
  maxLength?: number;
}

const DEFAULTS: Required<ValidationOptions> = {
  minLength: 1,
  maxLength: 4,
};

export function isHangul(input: string): boolean {
  if (input.length === 0) return false;
  return HANGUL_SYLLABLE_RE.test(input.normalize("NFC"));
}

/**
 * 한글 이름 입력값 검증. 위반 시 HangulValidationError throw.
 */
export function validateHangul(input: string, options: ValidationOptions = {}): void {
  const { minLength, maxLength } = { ...DEFAULTS, ...options };
  const normalized = input.normalize("NFC");

  if (normalized.length < minLength || normalized.length > maxLength) {
    throw new HangulValidationError(
      "INVALID_INPUT_LENGTH",
      `Name length must be ${minLength}-${maxLength}, got ${normalized.length}`,
    );
  }

  if (!isHangul(normalized)) {
    throw new HangulValidationError(
      "INVALID_INPUT_NON_HANGUL",
      `Name must be Hangul only, got "${normalized}"`,
    );
  }
}
