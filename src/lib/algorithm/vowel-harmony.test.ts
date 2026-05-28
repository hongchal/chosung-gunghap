import { describe, it, expect } from "vitest";
import { computeVowelHarmonyScore } from "./vowel-harmony";

describe("algorithm/vowel-harmony", () => {
  it("computeVowelHarmonyScore: 결과는 25-95 범위", () => {
    const samples: [string, string][] = [
      ["홍길동", "김민지"],
      ["가나다", "라마바"],
      ["서연", "민호"],
    ];
    for (const [a, b] of samples) {
      const score = computeVowelHarmonyScore(a, b);
      expect(score).toBeGreaterThanOrEqual(25);
      expect(score).toBeLessThanOrEqual(95);
    }
  });

  it("computeVowelHarmonyScore: 같은 이름끼리 = 양/음 비율 0차이 → 90점", () => {
    expect(computeVowelHarmonyScore("가나", "가나")).toBe(90);
  });
});
