import type { Ohaeng, OhaengRelation } from "@/types/algorithm";

export const OHAENG_DISPLAY: Record<Ohaeng, { name: string; emoji: string }> = {
  wood: { name: "나무", emoji: "🌳" },
  fire: { name: "불", emoji: "🔥" },
  earth: { name: "흙", emoji: "⛰️" },
  metal: { name: "금속", emoji: "⚙️" },
  water: { name: "물", emoji: "💧" },
};

// 상성별 관계 표현 (모두 긍정 톤 — 상극도 "끌리는"으로)
export const RELATION_PHRASE: Record<OhaengRelation, string> = {
  sangsaeng: "서로 도와주는",
  neutral: "닮은 듯 다른",
  sangkuk: "격렬하게 끌리는",
};

// 오행 쌍별 해설 (방향 무관 정렬 키). 상생/상극 원리를 재미있게 풀이, 모두 긍정 톤.
const PAIR_EXPLANATION: Record<string, string> = {
  // 상생 (서로 북돋는 관계)
  "fire-wood": "나무가 불을 지피듯, 한 사람이 다른 사람의 열정에 불을 붙여주는 관계예요. 함께라면 더 뜨거워져요.",
  "earth-fire": "불이 흙을 만들듯, 서로의 노력이 단단한 결실로 차곡차곡 쌓이는 관계예요.",
  "earth-metal": "흙이 금속을 품어내듯, 든든하게 서로를 받쳐주는 관계예요. 곁에 있으면 안심돼요.",
  "metal-water": "금속에 물이 맺히듯, 함께 있으면 마음이 촉촉해지는 관계예요.",
  "water-wood": "물이 나무를 키우듯, 서로를 쑥쑥 성장시키는 관계예요.",
  // 상극 (팽팽하지만 강하게 끌리는 관계)
  "earth-wood": "나무가 흙에 뿌리내리듯, 부딪히면서도 점점 더 깊게 자리 잡는 관계예요.",
  "earth-water": "흙이 물길을 잡아주듯, 서로의 균형을 맞춰주는 관계예요.",
  "fire-water": "물과 불처럼 극과 극이지만, 그래서 더 강하게 끌리는 관계예요. 긴장감이 곧 설렘!",
  "fire-metal": "불이 금속을 다루듯, 서로를 단련시키는 뜨거운 관계예요.",
  "metal-wood": "금속과 나무처럼 팽팽하지만, 부딪히는 만큼 서로에게 강하게 끌려요.",
  // 동일 오행 (비슷한 결의 편안한 관계)
  "wood-wood": "같은 나무끼리, 비슷한 가치관으로 편안하게 통하는 관계예요.",
  "fire-fire": "둘 다 불꽃 같아서 함께 있으면 에너지가 두 배가 되는 관계예요.",
  "earth-earth": "같은 흙처럼 묵묵하고 안정적인, 오래 가는 관계예요.",
  "metal-metal": "둘 다 똑부러져서 척하면 척 통하는 관계예요.",
  "water-water": "같은 물처럼 유연하게 흐르며 자연스럽게 어우러지는 관계예요.",
};

/**
 * 오행 쌍 해설 반환 (방향 무관). 정의 없으면 관계별 기본 해설.
 */
export function buildOhaengExplanation(
  o1: Ohaeng,
  o2: Ohaeng,
  relation: OhaengRelation,
): string {
  const key = [o1, o2].sort().join("-");
  const specific = PAIR_EXPLANATION[key];
  if (specific) return specific;

  // fallback (정의 누락 방어)
  const fallback: Record<OhaengRelation, string> = {
    sangsaeng: "서로의 부족함을 자연스럽게 채워주는 찰떡 관계예요.",
    neutral: "비슷한 결을 가진, 익숙하고 편안한 관계예요.",
    sangkuk: "팽팽하지만 그만큼 강하게 끌리는 관계예요.",
  };
  return fallback[relation];
}

/**
 * 오행 라벨 빌드. 예: "🔥 불 × 💧 물 = 격렬하게 끌리는 케미"
 */
export function buildOhaengLabelText(
  o1: Ohaeng,
  o2: Ohaeng,
  relation: OhaengRelation,
): string {
  const d1 = OHAENG_DISPLAY[o1];
  const d2 = OHAENG_DISPLAY[o2];
  return `${d1.emoji} ${d1.name} × ${d2.emoji} ${d2.name} = ${RELATION_PHRASE[relation]} 케미`;
}
