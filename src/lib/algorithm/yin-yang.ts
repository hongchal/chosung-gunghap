import type { YinYang } from "@/types/algorithm";
import { extractJamo } from "@/lib/hangul/jamo";

const YANG = new Set([
  // 양성 모음
  "ㅏ", "ㅗ", "ㅑ", "ㅛ", "ㅘ", "ㅙ", "ㅚ",
  // 양적 자음
  "ㄱ", "ㄴ", "ㄷ", "ㄹ", "ㅁ", "ㅂ", "ㅅ",
]);

const YIN = new Set([
  // 음성 모음
  "ㅓ", "ㅜ", "ㅕ", "ㅠ", "ㅝ", "ㅞ", "ㅟ",
  // 음적 자음
  "ㅇ", "ㅈ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ",
]);

export function classifyYinYang(jamo: string): YinYang {
  if (YANG.has(jamo)) return "yang";
  if (YIN.has(jamo)) return "yin";
  return "neutral";
}

/**
 * 음양 균형 점수 (20-95). 양/음 비율이 50/50에 가까울수록 높은 점수.
 */
export function computeYinYangScore(name1: string, name2: string): number {
  const all = extractJamo(name1 + name2);
  let yang = 0;
  let yin = 0;

  for (const ch of all) {
    const cls = classifyYinYang(ch);
    if (cls === "yang") yang++;
    if (cls === "yin") yin++;
  }

  const total = yang + yin;
  if (total === 0) return 50;

  const yangRatio = yang / total;
  const distance = Math.abs(yangRatio - 0.5);
  // distance 0 → 95, distance 0.5 → 30
  const score = Math.round(95 - distance * 130);

  return Math.max(20, Math.min(95, score));
}
