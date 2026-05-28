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
  scenario: string;
  characters: CharacterPair;
  dimensions: DimensionScores;
  algorithmVersion: string;
}
