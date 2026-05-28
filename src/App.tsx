import { useEffect } from "react";
import { useAppStore } from "@/store/app-store";
import { IntroScreen } from "@/features/intro/IntroScreen";
import { NameInputScreen } from "@/features/name-input/NameInputScreen";
import { ResultScreen } from "@/features/result/ResultScreen";

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
      return <ResultScreen />;
    default:
      return <IntroScreen />;
  }
}

export default App;
