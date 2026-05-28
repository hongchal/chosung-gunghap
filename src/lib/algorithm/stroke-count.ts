import { disassemble } from "es-hangul";

// 한글 자모 획수표 (이름궁합 관습 표준)
const STROKE_TABLE: Record<string, number> = {
  // 자음 (초성/종성 공통)
  ㄱ: 2, ㄲ: 4, ㄴ: 2, ㄷ: 3, ㄸ: 6, ㄹ: 5, ㅁ: 4, ㅂ: 4, ㅃ: 8,
  ㅅ: 2, ㅆ: 4, ㅇ: 1, ㅈ: 3, ㅉ: 6, ㅊ: 4, ㅋ: 3, ㅌ: 4, ㅍ: 4, ㅎ: 3,
  // 모음 (중성)
  ㅏ: 2, ㅐ: 3, ㅑ: 3, ㅒ: 4, ㅓ: 2, ㅔ: 3, ㅕ: 3, ㅖ: 4,
  ㅗ: 2, ㅘ: 4, ㅙ: 5, ㅚ: 3, ㅛ: 3,
  ㅜ: 2, ㅝ: 4, ㅞ: 5, ㅟ: 3, ㅠ: 3,
  ㅡ: 1, ㅢ: 2, ㅣ: 1,
};

/**
 * 음절(글자) 하나의 획수 = 초성+중성+종성 자모 획수 합.
 * 예: '김' = ㄱ(2)+ㅣ(1)+ㅁ(4) = 7
 */
export function syllableStrokes(syllable: string): number {
  const jamo = disassemble(syllable).split("");
  return jamo.reduce((sum, ch) => sum + (STROKE_TABLE[ch] ?? 0), 0);
}

/**
 * 이름의 음절별 획수 배열. 예: '김철수' → [7, 11, 4]
 */
export function getSyllableStrokes(name: string): number[] {
  return [...name].map(syllableStrokes);
}

/** 두 이름의 획수를 한 칸씩 번갈아 배치한 첫 줄 */
function interleave(s1: number[], s2: number[]): number[] {
  const row: number[] = [];
  const maxLen = Math.max(s1.length, s2.length);
  for (let i = 0; i < maxLen; i++) {
    if (i < s1.length) row.push(s1[i]);
    if (i < s2.length) row.push(s2[i]);
  }
  return row;
}

/**
 * 획수 피라미드의 모든 중간 단계를 반환 (사다리게임 애니메이션용).
 * 예: 김철수♥이영희 → [[7,2,11,5,4,5],[9,3,6,9,9],[2,9,5,8],[1,4,3],[5,7]]
 */
export function getStrokePyramid(name1: string, name2: string): number[][] {
  const s1 = getSyllableStrokes(name1);
  const s2 = getSyllableStrokes(name2);
  if (s1.length === 0 || s2.length === 0) return [];

  const rows: number[][] = [interleave(s1, s2)];
  let row = rows[0];
  while (row.length > 2) {
    const next: number[] = [];
    for (let i = 0; i < row.length - 1; i++) {
      next.push((row[i] + row[i + 1]) % 10);
    }
    rows.push(next);
    row = next;
  }
  return rows;
}

/** 피라미드 마지막 줄 → 점수 (1-100, 00은 100으로 변환) */
function pyramidToScore(rows: number[][]): number {
  if (rows.length === 0) return 50;
  const last = rows[rows.length - 1];
  if (last.length === 1) {
    return last[0] === 0 ? 100 : last[0] * 11;
  }
  const score = last[0] * 10 + last[1];
  return score === 0 ? 100 : score;
}

/**
 * 이름 궁합 — 획수 피라미드법 (일반 대중이 아는 표준 방식).
 *
 * 1. 두 이름의 음절 획수를 한 칸씩 번갈아 배치
 * 2. 인접한 두 수를 더해 일의 자리(% 10)만 남겨 다음 줄 생성
 * 3. 두 수가 남을 때까지 반복
 * 4. 마지막 두 자리를 백분율로 (00이면 100%)
 *
 * 검증: 김철수 ♥ 이영희 = 57%
 * 결정론적: 동일 입력 → 동일 결과.
 *
 * @returns 1-100 (피라미드 결과; 0은 100으로 변환)
 */
export function computeStrokeScore(name1: string, name2: string): number {
  return pyramidToScore(getStrokePyramid(name1, name2));
}
