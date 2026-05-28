import type { OhaengRelation } from "@/types/algorithm";

// 공유 카드 9:16 (인스타 스토리 최적)
export const CARD_W = 1080;
export const CARD_H = 1920;

// 오행 상성 관계별 배경 그라데이션 (위→아래)
const RELATION_GRADIENT: Record<OhaengRelation, [string, string]> = {
  sangsaeng: ["#7BE0AD", "#3FB984"], // 초록 — 서로 돕는 조화
  neutral: ["#FFC074", "#FF9A8B"], // 따뜻한 — 편안
  sangkuk: ["#FF8FA3", "#FF5C7C"], // 강렬한 핑크 — 끌림
};

export function getCardGradient(relation: OhaengRelation): [string, string] {
  return RELATION_GRADIENT[relation];
}
