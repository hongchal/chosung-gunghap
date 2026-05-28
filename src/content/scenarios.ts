import type { CharacterType, OhaengRelation } from "@/types/algorithm";
import { CHARACTER_TRAITS } from "@/content/character-traits";

type ScoreBand = "top" | "high" | "mid" | "low" | "bottom";

function scoreBand(score: number): ScoreBand {
  if (score >= 90) return "top";
  if (score >= 70) return "high";
  if (score >= 50) return "mid";
  if (score >= 30) return "low";
  return "bottom";
}

// 관계 패턴 슬롯 (점수 구간별, 모두 긍정 톤)
const RELATION_PATTERN: Record<ScoreBand, string[]> = {
  top: ["서로를 완성해주는 환상의 짝꿍이에요", "만나는 순간부터 통하는 사이예요"],
  high: ["시간이 갈수록 깊어지는 사이예요", "함께 있으면 편안한 단짝이에요"],
  mid: ["천천히 알아가며 정드는 사이예요", "익숙해질수록 매력이 보이는 사이예요"],
  low: ["서로의 다름을 통해 성장하는 사이예요", "다르기에 더 흥미로운 사이예요"],
  bottom: ["오히려 예측불가라 흥미진진한 사이예요", "반전이 가득한 특별한 사이예요"],
};

// 마무리 조언 슬롯 (점수 구간별)
const ADVICE: Record<ScoreBand, string[]> = {
  top: ["지금처럼 서로를 아껴주면 더할 나위 없어요.", "이 케미, 오래오래 간직하세요!"],
  high: ["가끔 마음을 표현하면 더 깊어질 거예요.", "작은 배려가 큰 행복으로 돌아와요."],
  mid: ["서로의 속도를 존중하면 더 좋아져요.", "함께하는 시간이 답이에요."],
  low: ["다름을 인정하면 의외의 시너지가 나요.", "솔직한 대화가 거리를 좁혀줘요."],
  bottom: ["예상을 깨는 순간들이 즐거움이 될 거예요.", "있는 그대로 즐겨보세요!"],
};

function pick<T>(arr: T[], seed: number): T {
  return arr[Math.abs(seed) % arr.length];
}

/**
 * 관계 시나리오 텍스트 생성 (3-4문장). 변수 조합형, 결정론적.
 */
export function buildScenario(
  name1: string,
  name2: string,
  score: number,
  char1: CharacterType,
  char2: CharacterType,
  seed: number,
): string {
  const band = scoreBand(score);
  const t1 = CHARACTER_TRAITS[char1].trait;
  const t2 = CHARACTER_TRAITS[char2].trait;
  const pattern = pick(RELATION_PATTERN[band], seed);
  const advice = pick(ADVICE[band], seed + 1);

  return `${name1}님은 ${t1}, ${name2}님은 ${t2}을 가졌어요. 두 사람은 ${pattern}. ${advice}`;
}

/** OhaengRelation은 시나리오 톤 보정에 활용 가능 (현재는 미사용, Phase 2 확장 슬롯) */
export type ScenarioRelation = OhaengRelation;
