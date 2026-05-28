import type { CharacterType } from "@/types/algorithm";

export interface CharacterTrait {
  label: string; // 캐릭터 이름
  trait: string; // 한 단어 특성 (시나리오 슬롯용)
  description: string; // 한 줄 성격 설명
}

// 오행 → 캐릭터: wood=leader, fire=passionate, earth=stable, metal=perfect, water=flexible
export const CHARACTER_TRAITS: Record<CharacterType, CharacterTrait> = {
  leader: {
    label: "리더형",
    trait: "주도적인 성격",
    description: "앞장서서 분위기를 이끄는 든든한 타입",
  },
  passionate: {
    label: "열정형",
    trait: "뜨거운 에너지",
    description: "감정 표현이 솔직하고 에너지가 넘치는 타입",
  },
  stable: {
    label: "안정형",
    trait: "차분한 안정감",
    description: "흔들림 없이 곁을 지켜주는 편안한 타입",
  },
  perfect: {
    label: "완벽형",
    trait: "꼼꼼한 섬세함",
    description: "디테일을 챙기고 신뢰를 주는 똑부러진 타입",
  },
  flexible: {
    label: "유연형",
    trait: "부드러운 융통성",
    description: "어디든 자연스럽게 어우러지는 센스 있는 타입",
  },
};
