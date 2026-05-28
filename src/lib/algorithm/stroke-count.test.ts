import { describe, it, expect } from "vitest";
import { computeStrokeScore, getStrokes } from "./stroke-count";

describe("algorithm/stroke-count", () => {
  // L1-5: 범위 검증
  it("computeStrokeScore: 결과는 1-99 범위 (clamp)", () => {
    const samples = [
      ["가", "나"],
      ["홍길동", "김민지"],
      ["박혁철", "이서연"],
      ["최강희", "이지윤"],
    ];
    for (const [a, b] of samples) {
      const score = computeStrokeScore(a, b);
      expect(score).toBeGreaterThanOrEqual(1);
      expect(score).toBeLessThanOrEqual(99);
    }
  });

  it("getStrokes: 모든 자모 획수는 양수", () => {
    const strokes = getStrokes("홍길동");
    expect(strokes.length).toBeGreaterThan(0);
    for (const s of strokes) {
      expect(s).toBeGreaterThan(0);
    }
  });

  it("computeStrokeScore: 결정론 (동일 입력 = 동일 출력)", () => {
    const a = computeStrokeScore("홍길동", "김민지");
    for (let i = 0; i < 50; i++) {
      expect(computeStrokeScore("홍길동", "김민지")).toBe(a);
    }
  });
});
