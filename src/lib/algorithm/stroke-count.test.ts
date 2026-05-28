import { describe, it, expect } from "vitest";
import {
  computeStrokeScore,
  getSyllableStrokes,
  getStrokePyramid,
  syllableStrokes,
} from "./stroke-count";

describe("algorithm/stroke-count (획수 피라미드법)", () => {
  // 음절 획수 검증
  it("syllableStrokes: '김' = ㄱ(2)+ㅣ(1)+ㅁ(4) = 7", () => {
    expect(syllableStrokes("김")).toBe(7);
  });

  it("syllableStrokes: '철' = ㅊ(4)+ㅓ(2)+ㄹ(5) = 11", () => {
    expect(syllableStrokes("철")).toBe(11);
  });

  it("getSyllableStrokes: '김철수' → [7, 11, 4]", () => {
    expect(getSyllableStrokes("김철수")).toEqual([7, 11, 4]);
  });

  it("getSyllableStrokes: '이영희' → [2, 5, 5]", () => {
    expect(getSyllableStrokes("이영희")).toEqual([2, 5, 5]);
  });

  // 표준 검증값 — 일반 대중 방식과 일치
  it("computeStrokeScore: 김철수 ♥ 이영희 = 57 (표준 검증값)", () => {
    expect(computeStrokeScore("김철수", "이영희")).toBe(57);
  });

  it("computeStrokeScore: 결과는 1-100 범위", () => {
    const samples: [string, string][] = [
      ["가", "나"],
      ["홍길동", "김민지"],
      ["박혁철", "이서연"],
      ["최강희", "이지윤"],
    ];
    for (const [a, b] of samples) {
      const score = computeStrokeScore(a, b);
      expect(score).toBeGreaterThanOrEqual(1);
      expect(score).toBeLessThanOrEqual(100);
    }
  });

  it("computeStrokeScore: 결정론 (동일 입력 = 동일 출력)", () => {
    const a = computeStrokeScore("홍길동", "김민지");
    for (let i = 0; i < 50; i++) {
      expect(computeStrokeScore("홍길동", "김민지")).toBe(a);
    }
  });

  it("computeStrokeScore: 이름 순서 교차 배치 — name1 먼저", () => {
    // 순서가 다르면 배치가 달라져 결과가 달라질 수 있음 (방향성 확인)
    const ab = computeStrokeScore("가나", "다라");
    expect(ab).toBeGreaterThanOrEqual(1);
    expect(ab).toBeLessThanOrEqual(100);
  });

  // 사다리게임 시각화용 피라미드 단계
  it("getStrokePyramid: 김철수♥이영희 첫 줄 = 번갈아 배치 [7,2,11,5,4,5]", () => {
    const rows = getStrokePyramid("김철수", "이영희");
    expect(rows[0]).toEqual([7, 2, 11, 5, 4, 5]);
  });

  it("getStrokePyramid: 마지막 줄은 2개, 점수와 일치", () => {
    const rows = getStrokePyramid("김철수", "이영희");
    const last = rows[rows.length - 1];
    expect(last).toEqual([5, 7]);
    expect(last[0] * 10 + last[1]).toBe(57);
  });

  it("getStrokePyramid: 각 줄은 직전 줄보다 1개씩 짧아짐", () => {
    const rows = getStrokePyramid("홍길동", "김민지");
    for (let i = 1; i < rows.length; i++) {
      expect(rows[i].length).toBe(rows[i - 1].length - 1);
    }
  });
});
