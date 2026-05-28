import type { OhaengRelation } from "@/types/algorithm";

// 점수 구간 키
type ScoreBand = "top" | "high" | "mid" | "low" | "bottom";

function scoreBand(score: number): ScoreBand {
  if (score >= 90) return "top";
  if (score >= 70) return "high";
  if (score >= 50) return "mid";
  if (score >= 30) return "low";
  return "bottom";
}

// 점수 구간 × 오행 관계 매트릭스. 모든 코멘트는 긍정 톤 (bottom 포함).
// 부정 결과 방어: 낮은 점수도 "반전·의외·흥미진진"으로 긍정 마무리.
const MATRIX: Record<ScoreBand, Record<OhaengRelation, string[]>> = {
  top: {
    sangsaeng: ["운명적 케미!", "천생연분 케미"],
    neutral: ["예측불가의 환상 케미!", "서로를 끌어당기는 케미"],
    sangkuk: ["불꽃 튀는 환상 케미!", "극과 극의 짜릿한 케미"],
  },
  high: {
    sangsaeng: ["은근히 깊은 케미", "오래 갈 든든한 케미"],
    neutral: ["잘 통하는 케미", "편안하게 잘 맞는 케미"],
    sangkuk: ["불꽃 튀는 케미!", "톡톡 튀는 설렘 케미"],
  },
  mid: {
    sangsaeng: ["서서히 물드는 케미", "알수록 정드는 케미"],
    neutral: ["익숙한 듯 새로운 케미", "무난하게 편한 케미"],
    sangkuk: ["밀당의 묘미 케미", "긴장감 있는 케미"],
  },
  low: {
    sangsaeng: ["천천히 가까워지는 케미", "노력하면 빛나는 케미"],
    neutral: ["정반대의 매력", "다름이 매력인 케미"],
    sangkuk: ["서로를 자극하는 케미", "스파크 튀는 케미"],
  },
  bottom: {
    sangsaeng: ["의외의 반전 케미", "느긋하게 발견하는 케미"],
    neutral: ["반전 매력 케미", "예상 밖의 케미"],
    sangkuk: ["의외의 반전 케미 (낮을수록 흥미진진!)", "극과 극의 반전 케미"],
  },
};

/**
 * 점수 + 오행 관계로 한 줄 코멘트 선택. 결정론적 (seed로 후보 중 하나 고정 선택).
 */
export function pickOneLiner(
  score: number,
  relation: OhaengRelation,
  seed: number,
): string {
  const candidates = MATRIX[scoreBand(score)][relation];
  const idx = Math.abs(seed) % candidates.length;
  return candidates[idx];
}
