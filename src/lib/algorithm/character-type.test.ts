import { describe, it, expect } from "vitest";
import {
  classifyCharacter,
  computeCharacterBonus,
} from "./character-type";

describe("algorithm/character-type", () => {
  // L1-14: 캐릭터 매핑
  it("classifyCharacter: '강희' (ㄱ=木) → leader", () => {
    expect(classifyCharacter("강희")).toBe("leader");
  });

  it("classifyCharacter: '나무' (ㄴ=火) → passionate", () => {
    expect(classifyCharacter("나무")).toBe("passionate");
  });

  it("classifyCharacter: '민지' (ㅁ=土) → stable", () => {
    expect(classifyCharacter("민지")).toBe("stable");
  });

  it("classifyCharacter: '서연' (ㅅ=金) → perfect", () => {
    expect(classifyCharacter("서연")).toBe("perfect");
  });

  it("classifyCharacter: '홍철' (ㅎ=水) → flexible", () => {
    expect(classifyCharacter("홍철")).toBe("flexible");
  });

  it("computeCharacterBonus: 같은 유형 = +5", () => {
    expect(computeCharacterBonus("강희", "건우")).toBe(5);
  });

  it("computeCharacterBonus: 보완 관계 (leader-stable) = +8", () => {
    expect(computeCharacterBonus("강희", "민지")).toBe(8);
  });

  it("computeCharacterBonus: 충돌 관계 (leader-perfect) = -5", () => {
    expect(computeCharacterBonus("강희", "서연")).toBe(-5);
  });

  it("computeCharacterBonus: 결과는 -10~+10 범위", () => {
    const samples: [string, string][] = [
      ["홍길동", "김민지"],
      ["강희", "민지"],
      ["서연", "강희"],
    ];
    for (const [a, b] of samples) {
      const bonus = computeCharacterBonus(a, b);
      expect(bonus).toBeGreaterThanOrEqual(-10);
      expect(bonus).toBeLessThanOrEqual(10);
    }
  });
});
