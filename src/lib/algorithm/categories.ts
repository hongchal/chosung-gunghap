import type { CategoryScores, DimensionScores } from "@/types/algorithm";

const clamp = (n: number): number => Math.max(1, Math.min(99, Math.round(n)));

/**
 * 5차원 점수 → 4개 분야별 점수.
 * 각 분야 가중치 합 = 1.0. characterBonus는 -10~+10이라 ×10으로 정규화.
 */
export function computeCategoryScores(dim: DimensionScores): CategoryScores {
  const charNormalized = (dim.characterBonus + 10) * 5; // -10~+10 → 0~100

  const romance =
    0.20 * dim.stroke +
    0.15 * dim.ohaeng +
    0.30 * dim.yinYang +
    0.25 * dim.vowel +
    0.10 * charNormalized;

  const friendship =
    0.20 * dim.stroke +
    0.40 * dim.ohaeng +
    0.20 * dim.yinYang +
    0.15 * dim.vowel +
    0.05 * charNormalized;

  const chemistry =
    0.15 * dim.stroke +
    0.20 * dim.ohaeng +
    0.30 * dim.yinYang +
    0.15 * dim.vowel +
    0.20 * charNormalized;

  const daily =
    0.40 * dim.stroke +
    0.25 * dim.ohaeng +
    0.20 * dim.yinYang +
    0.10 * dim.vowel +
    0.05 * charNormalized;

  return {
    romance: clamp(romance),
    friendship: clamp(friendship),
    chemistry: clamp(chemistry),
    daily: clamp(daily),
  };
}
