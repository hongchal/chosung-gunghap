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
