import { describe, it, expect } from "vitest";
import { extractJamo, extractChoseong, splitJamo } from "./jamo";

describe("hangul/jamo", () => {
  // L1-9
  it("extractJamo: '강희' → ['ㄱ','ㅏ','ㅇ','ㅎ','ㅡ','ㅣ']", () => {
    expect(extractJamo("강희")).toEqual(["ㄱ", "ㅏ", "ㅇ", "ㅎ", "ㅡ", "ㅣ"]);
  });

  it("extractJamo: 빈 문자열 → []", () => {
    expect(extractJamo("")).toEqual([]);
  });

  it("extractChoseong: '홍철' → 'ㅎㅊ'", () => {
    expect(extractChoseong("홍철")).toBe("ㅎㅊ");
  });

  it("splitJamo: '가나' → 자음 2개 + 모음 2개", () => {
    const { consonants, vowels } = splitJamo("가나");
    expect(consonants).toEqual(["ㄱ", "ㄴ"]);
    expect(vowels).toEqual(["ㅏ", "ㅏ"]);
  });
});
