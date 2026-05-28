import { extractJamo } from "@/lib/hangul/jamo";

const YANG_VOWELS = new Set(["ㅏ", "ㅗ", "ㅑ", "ㅛ", "ㅘ", "ㅙ", "ㅚ"]);
const YIN_VOWELS = new Set(["ㅓ", "ㅜ", "ㅕ", "ㅠ", "ㅝ", "ㅞ", "ㅟ"]);
const NEUTRAL_VOWELS = new Set(["ㅡ", "ㅢ", "ㅣ"]);
const ALL_VOWELS = new Set([...YANG_VOWELS, ...YIN_VOWELS, ...NEUTRAL_VOWELS]);

function getVowels(name: string): string[] {
  return extractJamo(name).filter((ch) => ALL_VOWELS.has(ch));
}

/**
 * 모음 조화 점수 (25-95). 두 이름의 양/음 모음 비율이 비슷할수록 높은 점수.
 */
export function computeVowelHarmonyScore(name1: string, name2: string): number {
  const v1 = getVowels(name1);
  const v2 = getVowels(name2);

  if (v1.length === 0 || v2.length === 0) return 50;

  const ratio = (vowels: string[]): number => {
    const yang = vowels.filter((v) => YANG_VOWELS.has(v)).length;
    const yin = vowels.filter((v) => YIN_VOWELS.has(v)).length;
    const total = yang + yin;
    return total === 0 ? 0.5 : yang / total;
  };

  const r1 = ratio(v1);
  const r2 = ratio(v2);
  const diff = Math.abs(r1 - r2);
  // diff 0 → 90, diff 1 → 35
  const score = Math.round(90 - diff * 55);

  return Math.max(25, Math.min(95, score));
}
