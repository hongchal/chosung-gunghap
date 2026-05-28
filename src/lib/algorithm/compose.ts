import { ALGORITHM_VERSION, type DimensionScores } from "@/types/algorithm";
import type { CompatibilityResult, OhaengLabel } from "@/types/result";
import { validateHangul } from "@/lib/hangul/validate";
import { computeStrokeScore } from "@/lib/algorithm/stroke-count";
import {
  computeOhaengScore,
  getFirstOhaeng,
  getOhaengRelation,
} from "@/lib/algorithm/ohaeng";
import { computeYinYangScore } from "@/lib/algorithm/yin-yang";
import { computeVowelHarmonyScore } from "@/lib/algorithm/vowel-harmony";
import {
  classifyCharacter,
  computeCharacterBonus,
} from "@/lib/algorithm/character-type";
import { computeCategoryScores } from "@/lib/algorithm/categories";
import { buildOhaengLabelText } from "@/content/ohaeng-labels";
import { pickOneLiner } from "@/content/one-liners";
import { buildScenario } from "@/content/scenarios";

// 5차원 종합 점수 가중치 (합 = 1.0)
const TOTAL_WEIGHTS = {
  stroke: 0.5,
  ohaeng: 0.25,
  yinYang: 0.1,
  vowel: 0.1,
  characterBonus: 0.05, // characterBonus는 -10~+10이라 ×10으로 normalize
} as const;

/** 두 이름으로 결정론적 seed 생성 (콘텐츠 후보 선택용) */
function makeSeed(name1: string, name2: string): number {
  let seed = 0;
  for (const ch of name1 + name2) {
    seed = (seed * 31 + ch.charCodeAt(0)) % 1_000_000;
  }
  return seed;
}

function buildOhaengLabel(name1: string, name2: string): OhaengLabel {
  const o1 = getFirstOhaeng(name1);
  const o2 = getFirstOhaeng(name2);
  const relation = getOhaengRelation(o1, o2);
  return {
    name1Ohaeng: o1,
    name2Ohaeng: o2,
    relation,
    label: buildOhaengLabelText(o1, o2, relation),
  };
}

/**
 * 두 이름의 5차원 궁합을 계산. 결정론적 (동일 입력 = 동일 결과).
 * @throws HangulValidationError - 한글 외 입력, 길이 위반 등
 */
export function computeCompatibility(
  name1: string,
  name2: string,
): CompatibilityResult {
  validateHangul(name1);
  validateHangul(name2);

  const dimensions: DimensionScores = {
    stroke: computeStrokeScore(name1, name2),
    ohaeng: computeOhaengScore(name1, name2),
    yinYang: computeYinYangScore(name1, name2),
    vowel: computeVowelHarmonyScore(name1, name2),
    characterBonus: computeCharacterBonus(name1, name2),
  };

  const weighted =
    TOTAL_WEIGHTS.stroke * dimensions.stroke +
    TOTAL_WEIGHTS.ohaeng * dimensions.ohaeng +
    TOTAL_WEIGHTS.yinYang * dimensions.yinYang +
    TOTAL_WEIGHTS.vowel * dimensions.vowel +
    TOTAL_WEIGHTS.characterBonus * (dimensions.characterBonus * 10);

  const totalScore = Math.max(1, Math.min(99, Math.round(weighted)));
  const ohaengLabel = buildOhaengLabel(name1, name2);
  const seed = makeSeed(name1, name2);
  const char1 = classifyCharacter(name1);
  const char2 = classifyCharacter(name2);

  return {
    name1,
    name2,
    totalScore,
    oneLineComment: pickOneLiner(totalScore, ohaengLabel.relation, seed),
    ohaengLabel,
    categories: computeCategoryScores(dimensions),
    scenario: buildScenario(name1, name2, totalScore, char1, char2, seed),
    characters: {
      name1Type: char1,
      name2Type: char2,
    },
    dimensions,
    algorithmVersion: ALGORITHM_VERSION,
  };
}
