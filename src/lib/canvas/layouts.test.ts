import { describe, it, expect } from "vitest";
import { CARD_W, CARD_H, getCardGradient } from "./layouts";
import type { OhaengRelation } from "@/types/algorithm";

describe("canvas/layouts", () => {
  it("카드 비율은 9:16", () => {
    expect(CARD_W / CARD_H).toBeCloseTo(9 / 16, 3);
  });

  it("getCardGradient: 모든 관계에서 [시작색, 끝색] 반환", () => {
    const relations: OhaengRelation[] = ["sangsaeng", "neutral", "sangkuk"];
    for (const r of relations) {
      const [c1, c2] = getCardGradient(r);
      expect(c1).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(c2).toMatch(/^#[0-9A-Fa-f]{6}$/);
    }
  });

  it("getCardGradient: 관계별로 다른 색", () => {
    expect(getCardGradient("sangsaeng")).not.toEqual(getCardGradient("sangkuk"));
  });
});
