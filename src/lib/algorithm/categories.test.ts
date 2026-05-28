import { describe, it, expect } from "vitest";
import { computeCategoryScores } from "./categories";

describe("algorithm/categories", () => {
  // L1-13: 분야별 점수
  it("computeCategoryScores: 모든 분야 1-99 범위", () => {
    const dim = {
      stroke: 75,
      ohaeng: 60,
      yinYang: 80,
      vowel: 70,
      characterBonus: 5,
    };
    const cats = computeCategoryScores(dim);

    for (const score of Object.values(cats)) {
      expect(score).toBeGreaterThanOrEqual(1);
      expect(score).toBeLessThanOrEqual(99);
    }
    expect(cats).toHaveProperty("romance");
    expect(cats).toHaveProperty("friendship");
    expect(cats).toHaveProperty("chemistry");
    expect(cats).toHaveProperty("daily");
  });

  it("computeCategoryScores: 결정론", () => {
    const dim = {
      stroke: 50,
      ohaeng: 50,
      yinYang: 50,
      vowel: 50,
      characterBonus: 0,
    };
    const a = computeCategoryScores(dim);
    const b = computeCategoryScores(dim);
    expect(a).toEqual(b);
  });
});
