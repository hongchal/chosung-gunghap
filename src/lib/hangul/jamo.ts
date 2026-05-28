// es-hangul wrapper — 토스 공식 라이브러리 위에서 우리 도메인 함수 빌드 (D-13)
import { disassemble, getChoseong } from "es-hangul";

const CONSONANTS = new Set([
  "ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ",
  "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ",
]);

/**
 * 한글 문자열을 자모 배열로 분해.
 * '홍철' → ['ㅎ', 'ㅗ', 'ㅇ', 'ㅊ', 'ㅓ', 'ㄹ']
 */
export function extractJamo(input: string): string[] {
  return disassemble(input.normalize("NFC")).split("");
}

/**
 * 한글 문자열의 초성만 추출.
 * '홍철' → 'ㅎㅊ'
 */
export function extractChoseong(input: string): string {
  return getChoseong(input.normalize("NFC"));
}

/**
 * 자모를 자음과 모음으로 분리.
 */
export function splitJamo(input: string): { consonants: string[]; vowels: string[] } {
  const jamo = extractJamo(input);
  const consonants: string[] = [];
  const vowels: string[] = [];
  for (const ch of jamo) {
    if (CONSONANTS.has(ch)) consonants.push(ch);
    else vowels.push(ch);
  }
  return { consonants, vowels };
}
