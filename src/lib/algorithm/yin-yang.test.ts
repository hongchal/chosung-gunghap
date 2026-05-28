import { describe, it, expect } from "vitest";
import { classifyYinYang, computeYinYangScore } from "./yin-yang";

describe("algorithm/yin-yang", () => {
  it("classifyYinYang: 'ㅏ' → yang (양성 모음)", () => {
    expect(classifyYinYang("ㅏ")).toBe("yang");
  });

  it("classifyYinYang: 'ㅓ' → yin (음성 모음)", () => {
    expect(classifyYinYang("ㅓ")).toBe("yin");
  });

  it("classifyYinYang: 'ㅡ' → neutral", () => {
    expect(classifyYinYang("ㅡ")).toBe("neutral");
  });

  // L1-5: 범위 검증
  it("computeYinYangScore: 결과는 20-95 범위", () => {
    const score = computeYinYangScore("홍길동", "김민지");
    expect(score).toBeGreaterThanOrEqual(20);
    expect(score).toBeLessThanOrEqual(95);
  });
});
