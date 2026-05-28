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

// 5차원 종합 점수 가중치 (합 = 1.0)
const TOTAL_WEIGHTS = {
  stroke: 0.5,
  ohaeng: 0.25,
  yinYang: 0.1,
  vowel: 0.1,
  characterBonus: 0.05, // characterBonus는 -10~+10이라 ×10으로 normalize
} as const;

const OHAENG_DISPLAY: Record<string, string> = {
  wood: "🌳 나무",
  fire: "🔥 불",
  earth: "⛰️ 흙",
  metal: "⚙️ 금속",
  water: "💧 물",
};

function buildOhaengLabel(name1: string, name2: string): OhaengLabel {
  const o1 = getFirstOhaeng(name1);
  const o2 = getFirstOhaeng(name2);
  const relation = getOhaengRelation(o1, o2);
  const relationText =
    relation === "sangsaeng"
      ? "서로 도와주는"
      : relation === "sangkuk"
        ? "격렬하게 끌리는"
        : "닮은 듯 다른";

  return {
    name1Ohaeng: o1,
    name2Ohaeng: o2,
    relation,
    label: `${OHAENG_DISPLAY[o1]} × ${OHAENG_DISPLAY[o2]} = ${relationText} 케미`,
  };
}

// MVP placeholder. Module-2에서 content/one-liners.ts로 풍부하게 대체.
function pickOneLineComment(score: number, relation: string): string {
  if (score >= 90) {
    return relation === "sangsaeng" ? "운명적 케미!" : "예측불가의 환상 케미!";
  }
  if (score >= 70) {
    return relation === "sangsaeng" ? "은근히 깊은 케미" : "불꽃 튀는 케미!";
  }
  if (score >= 50) return "익숙한 듯 새로운 케미";
  if (score >= 30) return "정반대의 매력";
  return "의외의 반전 케미";
}

// MVP placeholder. Module-2에서 content/scenarios.ts로 풍부하게 대체.
function buildScenario(name1: string, name2: string, score: number): string {
  const tone =
    score >= 70
      ? "따뜻하게 어우러져요"
      : score >= 40
        ? "서로의 다름을 통해 성장해요"
        : "오히려 흥미진진한 관계가 돼요";
  return `${name1}님과 ${name2}님은 ${tone}. 처음엔 낯설어도 시간이 흐를수록 서로를 더 잘 알게 되는 사이예요.`;
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

  return {
    name1,
    name2,
    totalScore,
    oneLineComment: pickOneLineComment(totalScore, ohaengLabel.relation),
    ohaengLabel,
    categories: computeCategoryScores(dimensions),
    scenario: buildScenario(name1, name2, totalScore),
    characters: {
      name1Type: classifyCharacter(name1),
      name2Type: classifyCharacter(name2),
    },
    dimensions,
    algorithmVersion: ALGORITHM_VERSION,
  };
}
