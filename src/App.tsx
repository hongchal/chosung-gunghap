import { useEffect } from "react";
import { useAppStore } from "@/store/app-store";
import { IntroScreen } from "@/features/intro/IntroScreen";
import { NameInputScreen } from "@/features/name-input/NameInputScreen";

// Module-5에서 ResultScreen으로 교체될 placeholder
function ResultPlaceholder() {
  const result = useAppStore((s) => s.result);
  const reset = useAppStore((s) => s.reset);
  return (
    <div style={{ padding: 24 }}>
      <h2>{result?.name1} ✕ {result?.name2}</h2>
      <p style={{ fontSize: 48, fontWeight: "bold" }}>{result?.totalScore}점</p>
      <p>{result?.oneLineComment}</p>
      <p>{result?.ohaengLabel.label}</p>
      <p style={{ color: "#666", fontSize: 14 }}>
        {result?.ohaengLabel.explanation}
      </p>
      <button onClick={reset}>다시하기</button>
      <p style={{ color: "#999", fontSize: 13 }}>
        (결과 화면은 Module-5에서 TDS 디자인으로 완성됩니다)
      </p>
    </div>
  );
}

function App() {
  const screen = useAppStore((s) => s.screen);
  const restoreOnLaunch = useAppStore((s) => s.restoreOnLaunch);

  // 앱 진입 시 미결 주문 복원 (결제 후 강제 종료 케이스 대비)
  useEffect(() => {
    void restoreOnLaunch();
  }, [restoreOnLaunch]);

  switch (screen) {
    case "intro":
      return <IntroScreen />;
    case "input":
      return <NameInputScreen />;
    case "result-free":
    case "result-full":
    case "sharing":
      return <ResultPlaceholder />;
    default:
      return <IntroScreen />;
  }
}

export default App;
