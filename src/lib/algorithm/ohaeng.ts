import type { Ohaeng, OhaengRelation } from "@/types/algorithm";
import { extractJamo } from "@/lib/hangul/jamo";

// 한글 자음 → 오행 매핑 (전통 분류)
const OHAENG_MAP: Record<string, Ohaeng> = {
  ㄱ: "wood", ㅋ: "wood", ㄲ: "wood",
  ㄴ: "fire", ㄷ: "fire", ㄹ: "fire", ㅌ: "fire", ㄸ: "fire",
  ㅁ: "earth", ㅂ: "earth", ㅍ: "earth", ㅃ: "earth",
  ㅅ: "metal", ㅆ: "metal", ㅈ: "metal", ㅊ: "metal", ㅉ: "metal",
  ㅇ: "water", ㅎ: "water",
};

// 상생 순환: 木→火→土→金→水→木
const SANGSAENG_NEXT: Record<Ohaeng, Ohaeng> = {
  wood: "fire",
  fire: "earth",
  earth: "metal",
  metal: "water",
  water: "wood",
};

// 상극: 木↔土, 火↔金, 土↔水, 金↔木, 水↔火
const SANGKUK: Record<Ohaeng, Ohaeng> = {
  wood: "earth",
  earth: "water",
  water: "fire",
  fire: "metal",
  metal: "wood",
};

/**
 * 첫 자음의 오행을 반환 (대표 오행).
 */
export function getFirstOhaeng(name: string): Ohaeng {
  const jamo = extractJamo(name);
  for (const ch of jamo) {
    const ohaeng = OHAENG_MAP[ch];
    if (ohaeng) return ohaeng;
  }
  return "water"; // fallback
}

/**
 * 두 오행의 관계 판정 (상생/중립/상극).
 */
export function getOhaengRelation(a: Ohaeng, b: Ohaeng): OhaengRelation {
  if (a === b) return "neutral";
  if (SANGSAENG_NEXT[a] === b || SANGSAENG_NEXT[b] === a) return "sangsaeng";
  if (SANGKUK[a] === b || SANGKUK[b] === a) return "sangkuk";
  return "neutral";
}

/**
 * 오행 상성 점수 (15-95).
 */
export function computeOhaengScore(name1: string, name2: string): number {
  const o1 = getFirstOhaeng(name1);
  const o2 = getFirstOhaeng(name2);
  const relation = getOhaengRelation(o1, o2);

  const baseMap: Record<OhaengRelation, number> = {
    sangsaeng: 88,
    neutral: 60,
    sangkuk: 32,
  };
  let score = baseMap[relation];

  // 두 이름 전체 자음 오행 다양성 보너스
  const allJamo = extractJamo(name1 + name2);
  const ohaengs = allJamo
    .map((ch) => OHAENG_MAP[ch])
    .filter((o): o is Ohaeng => o !== undefined);
  const uniqueOhaengs = new Set(ohaengs).size;
  score += (uniqueOhaengs - 2) * 3;

  return Math.max(15, Math.min(95, score));
}
