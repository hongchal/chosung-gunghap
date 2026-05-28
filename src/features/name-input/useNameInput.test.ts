import { describe, it, expect } from "vitest";
import { isInputValid, hasNonHangul } from "./useNameInput";

describe("name-input/validation", () => {
  it("isInputValid: 한글 이름 2개 → true", () => {
    expect(isInputValid("홍길동", "김민지")).toBe(true);
    expect(isInputValid("가", "나")).toBe(true);
  });

  it("isInputValid: 빈 이름 → false", () => {
    expect(isInputValid("", "민지")).toBe(false);
    expect(isInputValid("홍길동", "")).toBe(false);
  });

  it("isInputValid: 영문 포함 → false", () => {
    expect(isInputValid("Hong", "민지")).toBe(false);
    expect(isInputValid("홍길동", "Kim")).toBe(false);
  });

  it("isInputValid: 5자 초과 → false", () => {
    expect(isInputValid("가나다라마", "민지")).toBe(false);
  });

  it("hasNonHangul: 영문/숫자 → true", () => {
    expect(hasNonHangul("Hong")).toBe(true);
    expect(hasNonHangul("홍1")).toBe(true);
  });

  it("hasNonHangul: 빈 문자열 → false (에러 표시 안 함)", () => {
    expect(hasNonHangul("")).toBe(false);
  });

  it("hasNonHangul: 정상 한글 → false", () => {
    expect(hasNonHangul("홍길동")).toBe(false);
  });
});
