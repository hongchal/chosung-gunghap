import { useState } from "react";
import { useAppStore } from "@/store/app-store";
import { isHangul } from "@/lib/hangul/validate";

const MAX_NAME_LENGTH = 4;

/** 순수 검증 함수 (테스트 가능) — 두 이름 모두 한글 1-4자여야 유효 */
export function isInputValid(name1: string, name2: string): boolean {
  return (
    isHangul(name1) &&
    name1.length <= MAX_NAME_LENGTH &&
    isHangul(name2) &&
    name2.length <= MAX_NAME_LENGTH
  );
}

/** 한글 외 문자가 섞여 있는지 (입력 가이드 표시용) */
export function hasNonHangul(name: string): boolean {
  return name.length > 0 && !isHangul(name);
}

export function useNameInput() {
  const name1 = useAppStore((s) => s.name1);
  const name2 = useAppStore((s) => s.name2);
  const setName1 = useAppStore((s) => s.setName1);
  const setName2 = useAppStore((s) => s.setName2);
  const goToResult = useAppStore((s) => s.goToResult);

  const [error, setError] = useState<string | null>(null);

  // 4자 제한 + 상태 반영 (입력 단계에서 잘라냄)
  const updateName1 = (v: string) => {
    setName1(v.slice(0, MAX_NAME_LENGTH));
    if (error) setError(null);
  };
  const updateName2 = (v: string) => {
    setName2(v.slice(0, MAX_NAME_LENGTH));
    if (error) setError(null);
  };

  const isValid = isInputValid(name1, name2);

  const submit = () => {
    if (!isValid) {
      setError("한글 이름만 가능해요");
      return;
    }
    try {
      goToResult();
    } catch {
      setError("한글 이름만 가능해요");
    }
  };

  return {
    name1,
    name2,
    updateName1,
    updateName2,
    isValid,
    error,
    submit,
  };
}
