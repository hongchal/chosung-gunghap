import type { CharacterType } from "@/types/algorithm";
import { getFirstOhaeng } from "@/lib/algorithm/ohaeng";

const OHAENG_TO_CHARACTER: Record<string, CharacterType> = {
  wood: "leader",
  fire: "passionate",
  earth: "stable",
  metal: "perfect",
  water: "flexible",
};

/**
 * 이름의 첫 자음 오행으로 캐릭터 유형 분류.
 */
export function classifyCharacter(name: string): CharacterType {
  const ohaeng = getFirstOhaeng(name);
  return OHAENG_TO_CHARACTER[ohaeng];
}

const COMPLEMENTARY = new Set([
  "leader-stable", "stable-leader",
  "passionate-flexible", "flexible-passionate",
  "perfect-passionate", "passionate-perfect",
]);

const CONFLICT = new Set([
  "leader-perfect", "perfect-leader",
  "stable-flexible", "flexible-stable",
]);

/**
 * 두 캐릭터의 매칭 보너스 (-10 ~ +10).
 */
export function computeCharacterBonus(name1: string, name2: string): number {
  const c1 = classifyCharacter(name1);
  const c2 = classifyCharacter(name2);

  if (c1 === c2) return 5;
  if (COMPLEMENTARY.has(`${c1}-${c2}`)) return 8;
  if (CONFLICT.has(`${c1}-${c2}`)) return -5;
  return 0;
}
