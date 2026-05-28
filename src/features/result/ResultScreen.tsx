import { useState } from "react";
import { Top, Border, FixedBottomCTA } from "@toss/tds-mobile";
import { colors } from "@toss/tds-colors";
import { useAppStore } from "@/store/app-store";
import { getStrokePyramid } from "@/lib/algorithm/stroke-count";
import { PyramidLadder } from "./PyramidLadder";
import { ScoreReveal } from "./ScoreReveal";
import { BlurOverlay } from "./BlurOverlay";
import { Disclaimer } from "@/components/Disclaimer";

const CATEGORY_LABELS: Record<string, string> = {
  romance: "연애",
  friendship: "우정",
  chemistry: "케미",
  daily: "일상",
};

export function ResultScreen() {
  const result = useAppStore((s) => s.result);
  const screen = useAppStore((s) => s.screen);
  const payment = useAppStore((s) => s.payment);
  const startPayment = useAppStore((s) => s.startPayment);
  const reset = useAppStore((s) => s.reset);

  const [phase, setPhase] = useState<"ladder" | "revealed">("ladder");

  if (!result) return null;

  const pyramid = getStrokePyramid(result.name1, result.name2);
  const isUnlocked = screen === "result-full";
  const revealed = phase === "revealed";

  const handleCTA = () => {
    if (isUnlocked) {
      // TODO Module-6: 공유 카드 생성 + 공유 다이얼로그
      reset();
    } else {
      void startPayment();
    }
  };

  return (
    <div style={{ paddingBottom: 100 }}>
      <Top
        title={
          <Top.TitleParagraph size={22}>
            {result.name1} ✕ {result.name2}
          </Top.TitleParagraph>
        }
      />

      <PyramidLadder rows={pyramid} onComplete={() => setPhase("revealed")} />

      {revealed && (
        <div style={{ padding: "0 24px" }}>
          <ScoreReveal score={result.totalScore} />
          <p style={{ textAlign: "center", fontSize: 20, fontWeight: 700, margin: "4px 0 8px" }}>
            {result.oneLineComment}
          </p>

          {/* 오행 라벨 + 해설 (무료) */}
          <div style={{ background: colors.greyBackground, borderRadius: 16, padding: 16, margin: "16px 0" }}>
            <p style={{ fontWeight: 700, fontSize: 16 }}>{result.ohaengLabel.label}</p>
            <p style={{ color: colors.grey600, fontSize: 14, marginTop: 6, lineHeight: "20px" }}>
              {result.ohaengLabel.explanation}
            </p>
          </div>

          <Border variant="height16" />

          {/* 유료 영역 */}
          <p style={{ fontWeight: 700, margin: "20px 0 12px" }}>둘만 아는 케미 포인트 👀</p>
          <BlurOverlay locked={!isUnlocked}>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {(["romance", "friendship", "chemistry", "daily"] as const).map(
                (key) => (
                  <div
                    key={key}
                    style={{ background: colors.greyBackground, borderRadius: 14, padding: 16 }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 15, fontWeight: 700, color: colors.grey800 }}>
                        {CATEGORY_LABELS[key]}
                      </span>
                      <span style={{ fontSize: 22, fontWeight: 800, color: colors.blue500 }}>
                        {result.categories[key]}점
                      </span>
                    </div>
                    <p style={{ fontSize: 14, color: colors.grey600, marginTop: 6, lineHeight: "20px" }}>
                      {result.categoryComments[key]}
                    </p>
                  </div>
                ),
              )}
            </div>

            {/* 관계 시나리오 */}
            <div style={{ background: colors.blue50, borderRadius: 14, padding: 16, marginTop: 12 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: colors.blue500, marginBottom: 6 }}>
                두 사람의 관계는?
              </p>
              <p style={{ fontSize: 15, color: colors.grey700, lineHeight: "22px" }}>
                {result.scenario}
              </p>
            </div>
          </BlurOverlay>

          <div style={{ margin: "20px 0" }}>
            <Disclaimer />
          </div>
        </div>
      )}

      {revealed && (
        <FixedBottomCTA
          onClick={handleCTA}
          loading={payment.status === "pending"}
        >
          {isUnlocked ? "다시하기" : "공유하기 · ₩990"}
        </FixedBottomCTA>
      )}
    </div>
  );
}
