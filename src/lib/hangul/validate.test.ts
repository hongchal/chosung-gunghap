import { describe, it, expect } from "vitest";
import { isHangul, validateHangul, HangulValidationError } from "./validate";

describe("hangul/validate", () => {
  // L1-10
  it("isHangul: 'Hong' → false (한글 외)", () => {
    expect(isHangul("Hong")).toBe(false);
  });

  it("isHangul: '홍길동' → true", () => {
    expect(isHangul("홍길동")).toBe(true);
  });

  it("isHangul: '' → false (빈 입력)", () => {
    expect(isHangul("")).toBe(false);
  });

  it("isHangul: '홍1' → false (한글 + 숫자 혼합)", () => {
    expect(isHangul("홍1")).toBe(false);
  });

  // L1-3: 비한글 입력
  it("validateHangul: 'Hong' → throw INVALID_INPUT_NON_HANGUL", () => {
    expect(() => validateHangul("Hong")).toThrowError(HangulValidationError);
    try {
      validateHangul("Hong");
    } catch (e) {
      expect((e as HangulValidationError).code).toBe("INVALID_INPUT_NON_HANGUL");
    }
  });

  // L1-4: 빈 입력
  it("validateHangul: '' → throw INVALID_INPUT_LENGTH", () => {
    expect(() => validateHangul("")).toThrowError(HangulValidationError);
    try {
      validateHangul("");
    } catch (e) {
      expect((e as HangulValidationError).code).toBe("INVALID_INPUT_LENGTH");
    }
  });

  it("validateHangul: 5글자 → throw INVALID_INPUT_LENGTH (default max 4)", () => {
    expect(() => validateHangul("가나다라마")).toThrowError(HangulValidationError);
  });

  it("validateHangul: '홍길동' → 통과", () => {
    expect(() => validateHangul("홍길동")).not.toThrow();
  });
});
