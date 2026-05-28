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

// 관계 패턴 슬롯 (구간별 5개, 모두 긍정 톤)
const RELATION_PATTERN: Record<ScoreBand, string[]> = {
  top: [
    "서로를 완성해주는 환상의 짝꿍이에요.",
    "만나는 순간부터 통하는 운명 같은 사이예요.",
    "어디서든 찰떡같이 손발이 맞는 사이예요.",
    "함께 있으면 시너지가 두 배가 되는 사이예요.",
    "서로의 빈틈을 자연스럽게 채워주는 사이예요.",
  ],
  high: [
    "시간이 갈수록 깊어지는 사이예요.",
    "함께 있으면 마음이 편안해지는 단짝이에요.",
    "툭 터놓고 지낼 수 있는 사이예요.",
    "은근히 잘 맞아서 오래 가는 사이예요.",
    "곁에 있으면 든든한 사이예요.",
  ],
  mid: [
    "천천히 알아가며 정드는 사이예요.",
    "익숙해질수록 매력이 보이는 사이예요.",
    "무난하지만 편안한 사이예요.",
    "조금씩 가까워지는 재미가 있는 사이예요.",
    "서로의 페이스를 존중하면 좋은 사이예요.",
  ],
  low: [
    "서로의 다름을 통해 성장하는 사이예요.",
    "다르기에 더 흥미로운 사이예요.",
    "정반대라 오히려 끌리는 사이예요.",
    "부딪히면서도 배울 게 많은 사이예요.",
    "엇갈리는 듯하지만 묘하게 끌리는 사이예요.",
  ],
  bottom: [
    "오히려 예측불가라 흥미진진한 사이예요.",
    "반전이 가득한 특별한 사이예요.",
    "정해진 게 없어서 더 재미있는 사이예요.",
    "매 순간 새로움을 주는 사이예요.",
    "의외의 케미가 터질 수 있는 사이예요.",
  ],
};

// 전환점 슬롯 (구간별 5개) — "처음엔 ~, 나중엔 ~" 의 서사
const TURNING: Record<ScoreBand, string[]> = {
  top: [
    "처음 본 순간부터 편했고, 시간이 지날수록 더 단단해져요.",
    "첫인상부터 좋았던 만큼, 알수록 더 빠져들어요.",
    "서로를 한눈에 알아본 사이라, 오래갈수록 빛나요.",
    "시작부터 잘 맞아서, 함께한 시간이 보물이 돼요.",
    "처음부터 통했고, 그 마음이 변하지 않아요.",
  ],
  high: [
    "처음엔 조금 낯설어도, 금세 가까워지는 사이예요.",
    "알아갈수록 \"이 사람이구나\" 싶어지는 사이예요.",
    "한두 번 부대끼면 금방 친해지는 사이예요.",
    "시간이 약이 되어 점점 더 좋아지는 사이예요.",
    "처음의 어색함이 곧 편안함으로 바뀌어요.",
  ],
  mid: [
    "처음엔 서로 탐색하지만, 익숙해지면 편해져요.",
    "천천히 다가가면 의외의 면을 발견하게 돼요.",
    "급하지 않게 알아가면 좋은 사이예요.",
    "거리를 두다가도 어느새 곁에 있게 돼요.",
    "느긋하게 지내다 보면 정이 쌓여요.",
  ],
  low: [
    "처음엔 충돌해도, 그게 곧 끌림이 돼요.",
    "삐걱대다가도 서로를 이해하면 단단해져요.",
    "다른 점이 처음엔 어색해도 나중엔 매력이 돼요.",
    "맞춰가는 과정이 오히려 재미가 되는 사이예요.",
    "부딪히는 만큼 서로를 더 알게 돼요.",
  ],
  bottom: [
    "예상을 깨는 순간들이 즐거움이 될 거예요.",
    "정반대라 더 궁금해지는 사이예요.",
    "어떻게 흘러갈지 모르는 게 매력이에요.",
    "툭탁거려도 미워할 수 없는 사이예요.",
    "의외의 순간에 통하는 재미가 있어요.",
  ],
};

// 조언 슬롯 (구간별 5개)
const ADVICE: Record<ScoreBand, string[]> = {
  top: [
    "지금처럼 서로를 아껴주면 더할 나위 없어요.",
    "이 케미, 오래오래 간직하세요!",
    "작은 표현이 큰 행복으로 돌아와요.",
    "함께하는 시간을 마음껏 즐기세요.",
    "서로가 서로에게 행운이에요.",
  ],
  high: [
    "가끔 마음을 표현하면 더 깊어질 거예요.",
    "작은 배려가 관계를 단단하게 해줘요.",
    "솔직함이 두 사람을 더 가깝게 만들어요.",
    "함께 새로운 걸 시도해보면 좋아요.",
    "서로의 좋은 점을 자주 말해주세요.",
  ],
  mid: [
    "서로의 속도를 존중하면 더 좋아져요.",
    "함께하는 시간이 답이에요.",
    "사소한 대화가 거리를 좁혀줘요.",
    "조급해하지 말고 천천히 다가가세요.",
    "서로의 취향을 알아가 보세요.",
  ],
  low: [
    "다름을 인정하면 의외의 시너지가 나요.",
    "솔직한 대화가 거리를 좁혀줘요.",
    "서로의 입장을 들어보면 가까워져요.",
    "다른 점을 매력으로 바라보세요.",
    "한 발씩 양보하면 더 편해져요.",
  ],
  bottom: [
    "예상을 깨는 순간들이 즐거움이 될 거예요.",
    "있는 그대로 즐겨보세요!",
    "기대를 내려놓으면 더 재밌어져요.",
    "서로의 다름을 웃어넘기면 편해져요.",
    "가볍게 즐기는 게 정답이에요.",
  ],
};

function pick<T>(arr: T[], seed: number): T {
  return arr[Math.abs(seed) % arr.length];
}

/**
 * 관계 시나리오 텍스트 생성 (4문장). 변수 조합형, 결정론적.
 * 슬롯: 캐릭터 trait × 관계패턴 × 전환점 × 조언 → 수천 가지 조합.
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

  // 슬롯마다 다른 seed offset → 같은 이름 안에서도 슬롯별 다양성
  const pattern = pick(RELATION_PATTERN[band], seed);
  const turning = pick(TURNING[band], seed * 7 + 3);
  const advice = pick(ADVICE[band], seed * 13 + 5);

  return `${name1}님은 ${t1}, ${name2}님은 ${t2}을 가졌어요. ${pattern} ${turning} ${advice}`;
}

/** OhaengRelation은 시나리오 톤 보정에 활용 가능 (Phase 2 확장 슬롯) */
export type ScenarioRelation = OhaengRelation;
