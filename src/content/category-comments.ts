export type Category = "romance" | "friendship" | "chemistry" | "daily";

type Band = "top" | "high" | "mid" | "low" | "bottom";

function band(score: number): Band {
  if (score >= 90) return "top";
  if (score >= 70) return "high";
  if (score >= 50) return "mid";
  if (score >= 30) return "low";
  return "bottom";
}

export const CATEGORY_LABEL: Record<Category, string> = {
  romance: "연애",
  friendship: "우정",
  chemistry: "케미",
  daily: "일상",
};

// 분야 × 점수 구간 해설 (20칸). 모두 긍정 톤 — 낮은 점수도 "반전·매력"으로.
const COMMENTS: Record<Category, Record<Band, string>> = {
  romance: {
    top: "서로에게 푹 빠질 운명적인 사이예요. 눈만 마주쳐도 설레요.",
    high: "두근거림이 오래 가는 사이예요. 함께면 매일이 특별해요.",
    mid: "천천히 사랑이 깊어지는 사이예요. 조급해하지 않아도 돼요.",
    low: "정반대라 더 끌리는 사이예요. 다름이 곧 설렘이에요.",
    bottom: "예상 밖의 불꽃이 튈 수 있는 사이예요. 의외성이 매력!",
  },
  friendship: {
    top: "평생 갈 베스트프렌드예요. 말 안 해도 통하는 사이!",
    high: "오래 의지할 수 있는 든든한 친구 사이예요.",
    mid: "편하게 지내다 보면 정이 깊어지는 사이예요.",
    low: "성격이 달라 오히려 배울 게 많은 친구 사이예요.",
    bottom: "티격태격하지만 미워할 수 없는 묘한 친구 사이예요.",
  },
  chemistry: {
    top: "환상의 호흡! 뭘 해도 척하면 척 통하는 케미예요.",
    high: "함께 있으면 시너지가 폭발하는 케미예요.",
    mid: "은근히 잘 맞아서 편안한 케미예요.",
    low: "엇박자 같지만 그게 오히려 재미인 케미예요.",
    bottom: "예측불가라 매 순간이 흥미진진한 케미예요.",
  },
  daily: {
    top: "매일이 편안하고 즐거운 일상 메이트예요.",
    high: "함께하는 평범한 하루가 특별해지는 사이예요.",
    mid: "무난하고 부담 없이 어울리는 일상 사이예요.",
    low: "생활 리듬은 달라도 서로 맞춰가는 재미가 있어요.",
    bottom: "일상 패턴이 정반대라 서로 새로움을 주는 사이예요.",
  },
};

/** 분야 + 점수 → 해설 한 줄 */
export function pickCategoryComment(category: Category, score: number): string {
  return COMMENTS[category][band(score)];
}
