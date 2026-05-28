import type {
  CategoryScores,
  CharacterType,
  DimensionScores,
  Hangul,
  Ohaeng,
  OhaengRelation,
} from "./algorithm";

export interface OhaengLabel {
  name1Ohaeng: Ohaeng;
  name2Ohaeng: Ohaeng;
  relation: OhaengRelation;
  label: string; // "🔥 불 × 💧 물 = 격렬한 케미"
  explanation: string; // 왜 이 케미인지 풀이 (1-2문장)
  name1Spirit: string; // "조홍철님은 ⚙️ 금속(金) — ...기운이에요"
  name2Spirit: string;
}

/** 사다리게임 시각화용 — 획수 피라미드의 모든 중간 단계 */
export interface StrokePyramid {
  rows: number[][]; // [[5,7,6,4,11,5], [2,3,0,5,6], ..., [6,4]]
  labels: { name1Strokes: number[]; name2Strokes: number[] }; // 음절별 획수
}

export interface CharacterPair {
  name1Type: CharacterType;
  name2Type: CharacterType;
}

export interface CompatibilityResult {
  name1: Hangul;
  name2: Hangul;
  totalScore: number; // 1-99
  oneLineComment: string;
  ohaengLabel: OhaengLabel;
  categories: CategoryScores;
  categoryComments: {
    romance: string;
    friendship: string;
    chemistry: string;
    daily: string;
  };
  scenario: string;
  characters: CharacterPair;
  dimensions: DimensionScores;
  algorithmVersion: string;
}
