import { useEffect } from "react";
import { Top } from "@toss/tds-mobile";
import { useAppStore } from "@/store/app-store";
import { Disclaimer } from "@/components/Disclaimer";

const INTRO_DURATION_MS = 1000;

/** 1초 인트로 → 자동으로 입력 화면 전환. 검수 반려 방지(인트로 페이지 필수). */
export function IntroScreen() {
  const goToInput = useAppStore((s) => s.goToInput);

  useEffect(() => {
    const timer = setTimeout(goToInput, INTRO_DURATION_MS);
    return () => clearTimeout(timer);
  }, [goToInput]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        gap: 12,
        padding: 24,
        textAlign: "center",
      }}
    >
      <Top
        title={<Top.TitleParagraph size={28}>이름궁합</Top.TitleParagraph>}
        subtitleBottom={
          <Top.SubtitleParagraph size={17}>
            30초 만에 친구와의 케미를 확인하세요
          </Top.SubtitleParagraph>
        }
      />
      <Disclaimer />
    </div>
  );
}
