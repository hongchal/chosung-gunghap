import { extractJamo } from "@/lib/hangul/jamo";

// 한글 자모 획수표 (전통 한국식 작명 기준)
const STROKE_TABLE: Record<string, number> = {
  // 자음
  ㄱ: 2, ㄲ: 4, ㄴ: 2, ㄷ: 3, ㄸ: 6, ㄹ: 5, ㅁ: 4, ㅂ: 4, ㅃ: 8,
  ㅅ: 2, ㅆ: 4, ㅇ: 1, ㅈ: 3, ㅉ: 6, ㅊ: 4, ㅋ: 3, ㅌ: 4, ㅍ: 4, ㅎ: 3,
  // 모음
  ㅏ: 2, ㅐ: 3, ㅑ: 3, ㅒ: 4, ㅓ: 2, ㅔ: 3, ㅕ: 3, ㅖ: 4,
  ㅗ: 2, ㅘ: 4, ㅙ: 5, ㅚ: 3, ㅛ: 3,
  ㅜ: 2, ㅝ: 4, ㅞ: 5, ㅟ: 3, ㅠ: 3,
  ㅡ: 1, ㅢ: 2, ㅣ: 1,
};

/**
 * 한글 이름의 자모별 획수 배열.
 */
export function getStrokes(name: string): number[] {
  return extractJamo(name).map((ch) => STROKE_TABLE[ch] ?? 0);
}

/**
 * 획수법 점수 (1-99). 전통 한국식 이름 궁합 알고리즘.
 *
 * 1. 두 이름의 자모 획수를 교차로 결합
 * 2. 인접한 두 수를 더해 (mod 10) 새 배열 생성
 * 3. 길이 2가 될 때까지 반복
 * 4. 최종 두 자리수를 점수로 매핑
 */
export function computeStrokeScore(name1: string, name2: string): number {
  const s1 = getStrokes(name1);
  const s2 = getStrokes(name2);

  if (s1.length === 0 || s2.length === 0) return 50;

  // 교차 배치
  const combined: number[] = [];
  const maxLen = Math.max(s1.length, s2.length);
  for (let i = 0; i < maxLen; i++) {
    if (i < s1.length) combined.push(s1[i]);
    if (i < s2.length) combined.push(s2[i]);
  }

  // 인접합 mod 10 반복 (길이 2까지)
  let current = combined;
  while (current.length > 2) {
    const next: number[] = [];
    for (let i = 0; i < current.length - 1; i++) {
      next.push((current[i] + current[i + 1]) % 10);
    }
    current = next;
  }

  // 두 자리수 (10*tens + ones)
  const raw = current.length === 2 ? current[0] * 10 + current[1] : current[0] * 11;
  const score = raw === 0 ? 50 : raw;

  return Math.max(1, Math.min(99, score));
}
