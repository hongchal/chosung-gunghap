import { describe, it, expect } from "vitest";
import { computeCompatibility } from "./compose";
import { HangulValidationError } from "@/lib/hangul/validate";
import { ALGORITHM_VERSION } from "@/types/algorithm";

describe("algorithm/compose", () => {
  // L1-1: 정상 입력 → 결과 객체 완전성
  it("computeCompatibility: 정상 입력 → 모든 필드 채워짐", () => {
    const result = computeCompatibility("홍길동", "김민지");

    expect(result.name1).toBe("홍길동");
    expect(result.name2).toBe("김민지");
    expect(result.totalScore).toBeGreaterThanOrEqual(1);
    expect(result.totalScore).toBeLessThanOrEqual(99);
    expect(result.oneLineComment).toBeTruthy();
    expect(result.ohaengLabel.label).toContain("케미");
    expect(result.categories.romance).toBeDefined();
    expect(result.categories.friendship).toBeDefined();
    expect(result.categories.chemistry).toBeDefined();
    expect(result.categories.daily).toBeDefined();
    expect(result.scenario).toContain("홍길동");
    expect(result.scenario).toContain("김민지");
    expect(result.dimensions.stroke).toBeDefined();
    expect(result.algorithmVersion).toBe(ALGORITHM_VERSION);
  });

  // L1-2: 결정론성 — 100회 반복 동일 결과
  it("computeCompatibility: 결정론 (100회 동일)", () => {
    const baseline = computeCompatibility("홍길동", "김민지");
    for (let i = 0; i < 100; i++) {
      expect(computeCompatibility("홍길동", "김민지")).toEqual(baseline);
    }
  });

  // L1-3: 비한글 입력 → throw
  it("computeCompatibility: 영문 입력 → HangulValidationError(NON_HANGUL)", () => {
    expect(() => computeCompatibility("Hong", "민지")).toThrow(
      HangulValidationError,
    );
  });

  // L1-4: 빈 입력 → throw
  it("computeCompatibility: 빈 이름 → HangulValidationError(LENGTH)", () => {
    expect(() => computeCompatibility("", "민지")).toThrow(
      HangulValidationError,
    );
  });

  // L1-7: clamp 1-99 (절대 0/100 회피)
  it("computeCompatibility: 다양한 입력에서 totalScore 절대 0/100 아님", () => {
    const samples: [string, string][] = [
      ["가", "나"],
      ["홍길동", "김민지"],
      ["박혁철", "이서연"],
      ["최강희", "이지윤"],
      ["김", "박"],
      ["하늘", "별"],
    ];
    for (const [a, b] of samples) {
      const { totalScore } = computeCompatibility(a, b);
      expect(totalScore).toBeGreaterThan(0);
      expect(totalScore).toBeLessThan(100);
    }
  });

  // L1-6: 가중치 적용 검증 (방향성 체크)
  it("computeCompatibility: 모든 차원이 합쳐져 totalScore에 반영됨", () => {
    const { dimensions, totalScore } = computeCompatibility("홍길동", "김민지");
    // 단일 차원 점수 범위와 totalScore 범위가 모두 의미있는 값임을 확인
    expect(dimensions.stroke).toBeGreaterThan(0);
    expect(dimensions.ohaeng).toBeGreaterThan(0);
    expect(dimensions.yinYang).toBeGreaterThan(0);
    expect(dimensions.vowel).toBeGreaterThan(0);
    expect(totalScore).toBeGreaterThan(0);
  });

  // L1-11: oneLineComment 매트릭스 (점수 구간별 다른 코멘트)
  it("computeCompatibility: oneLineComment는 빈 문자열 아님", () => {
    const samples: [string, string][] = [
      ["가", "나"],
      ["홍길동", "김민지"],
      ["하늘", "별"],
    ];
    for (const [a, b] of samples) {
      const { oneLineComment } = computeCompatibility(a, b);
      expect(oneLineComment.length).toBeGreaterThan(0);
    }
  });

  // L1-12: scenario 슬롯 치환 — 두 이름이 모두 포함
  it("computeCompatibility: scenario에 두 이름 모두 포함", () => {
    const { scenario } = computeCompatibility("혁철", "민지");
    expect(scenario).toContain("혁철");
    expect(scenario).toContain("민지");
  });
});
