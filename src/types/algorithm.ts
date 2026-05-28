// Algorithm Domain Types — 외부 의존 0 (순수 타입)

export type Hangul = string;

export type Ohaeng = "wood" | "fire" | "earth" | "metal" | "water";

export type OhaengRelation = "sangsaeng" | "neutral" | "sangkuk";

export type CharacterType =
  | "leader" // 木
  | "passionate" // 火
  | "stable" // 土
  | "perfect" // 金
  | "flexible"; // 水

export type YinYang = "yin" | "yang" | "neutral";

export interface DimensionScores {
  stroke: number; // 0-100
  ohaeng: number; // 0-100
  yinYang: number; // 0-100
  vowel: number; // 0-100
  characterBonus: number; // -10~+10
}

export interface CategoryScores {
  romance: number; // 연애
  friendship: number; // 우정
  chemistry: number; // 케미
  daily: number; // 일상
}

export const ALGORITHM_VERSION = "1.0.0";
