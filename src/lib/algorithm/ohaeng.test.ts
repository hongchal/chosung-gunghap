import { describe, it, expect } from "vitest";
import {
  computeOhaengScore,
  getFirstOhaeng,
  getOhaengRelation,
} from "./ohaeng";

describe("algorithm/ohaeng", () => {
  // L1-8: 상생/상극 판정 정확성
  it("getOhaengRelation: 木→火 = sangsaeng (상생)", () => {
    expect(getOhaengRelation("wood", "fire")).toBe("sangsaeng");
  });

  it("getOhaengRelation: 木↔土 = sangkuk (상극)", () => {
    expect(getOhaengRelation("wood", "earth")).toBe("sangkuk");
    expect(getOhaengRelation("earth", "wood")).toBe("sangkuk");
  });

  it("getOhaengRelation: 같은 오행 = neutral", () => {
    expect(getOhaengRelation("water", "water")).toBe("neutral");
  });

  it("getFirstOhaeng: '강희' (ㄱ) → wood", () => {
    expect(getFirstOhaeng("강희")).toBe("wood");
  });

  it("getFirstOhaeng: '홍철' (ㅎ) → water", () => {
    expect(getFirstOhaeng("홍철")).toBe("water");
  });

  it("computeOhaengScore: 결과는 15-95 범위", () => {
    const score = computeOhaengScore("홍길동", "김민지");
    expect(score).toBeGreaterThanOrEqual(15);
    expect(score).toBeLessThanOrEqual(95);
  });
});
