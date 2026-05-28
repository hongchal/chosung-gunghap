import { describe, it, expect } from "vitest";
import { pickOneLiner } from "./one-liners";
import { buildScenario } from "./scenarios";
import { buildOhaengLabelText, OHAENG_DISPLAY } from "./ohaeng-labels";
import { CHARACTER_TRAITS } from "./character-traits";
import type { Ohaeng, OhaengRelation } from "@/types/algorithm";

const RELATIONS: OhaengRelation[] = ["sangsaeng", "neutral", "sangkuk"];
const OHAENGS: Ohaeng[] = ["wood", "fire", "earth", "metal", "water"];

// 부정 톤 블랙리스트 — D(부정 결과 방어): 낮은 점수도 긍정 톤이어야 함
const NEGATIVE_WORDS = [
  "나쁨", "나빠", "최악", "별로", "안 맞", "안맞", "실패",
  "불행", "헤어", "이별", "절망", "최하", "끔찍", "위험",
];

function hasNegativeWord(text: string): boolean {
  return NEGATIVE_WORDS.some((w) => text.includes(w));
}

describe("content/one-liners", () => {
  it("모든 점수 구간 × 관계 조합에서 빈 문자열 없음", () => {
    const scores = [95, 80, 60, 40, 15];
    for (const score of scores) {
      for (const rel of RELATIONS) {
        for (let seed = 0; seed < 5; seed++) {
          const comment = pickOneLiner(score, rel, seed);
          expect(comment.length).toBeGreaterThan(0);
        }
      }
    }
  });

  // 부정 결과 방어 — 50점 미만(low/bottom)도 모두 긍정 톤
  it("50점 미만 코멘트에 부정 단어 없음 (긍정 톤 방어)", () => {
    const lowScores = [40, 30, 20, 10, 1];
    for (const score of lowScores) {
      for (const rel of RELATIONS) {
        for (let seed = 0; seed < 10; seed++) {
          const comment = pickOneLiner(score, rel, seed);
          expect(hasNegativeWord(comment)).toBe(false);
        }
      }
    }
  });

  it("pickOneLiner: 결정론 (동일 입력 = 동일 출력)", () => {
    const a = pickOneLiner(87, "sangkuk", 12345);
    for (let i = 0; i < 20; i++) {
      expect(pickOneLiner(87, "sangkuk", 12345)).toBe(a);
    }
  });
});

describe("content/scenarios", () => {
  it("buildScenario: 두 이름 모두 포함", () => {
    const s = buildScenario("혁철", "민지", 87, "leader", "stable", 100);
    expect(s).toContain("혁철");
    expect(s).toContain("민지");
  });

  it("buildScenario: 부정 단어 없음 (모든 점수 구간)", () => {
    const scores = [95, 80, 60, 40, 15];
    for (const score of scores) {
      const s = buildScenario("가나", "다라", score, "passionate", "flexible", score);
      expect(hasNegativeWord(s)).toBe(false);
    }
  });

  it("buildScenario: 결정론", () => {
    const a = buildScenario("혁철", "민지", 87, "leader", "stable", 100);
    const b = buildScenario("혁철", "민지", 87, "leader", "stable", 100);
    expect(a).toBe(b);
  });
});

describe("content/ohaeng-labels", () => {
  it("모든 오행에 표시 정보(name, emoji) 존재", () => {
    for (const o of OHAENGS) {
      expect(OHAENG_DISPLAY[o].name.length).toBeGreaterThan(0);
      expect(OHAENG_DISPLAY[o].emoji.length).toBeGreaterThan(0);
    }
  });

  it("buildOhaengLabelText: '케미' 포함", () => {
    const label = buildOhaengLabelText("fire", "water", "sangkuk");
    expect(label).toContain("케미");
    expect(label).toContain("불");
    expect(label).toContain("물");
  });
});

describe("content/character-traits", () => {
  it("5개 캐릭터 모두 label/trait/description 존재", () => {
    const types = ["leader", "passionate", "stable", "perfect", "flexible"] as const;
    for (const t of types) {
      expect(CHARACTER_TRAITS[t].label.length).toBeGreaterThan(0);
      expect(CHARACTER_TRAITS[t].trait.length).toBeGreaterThan(0);
      expect(CHARACTER_TRAITS[t].description.length).toBeGreaterThan(0);
    }
  });
});
