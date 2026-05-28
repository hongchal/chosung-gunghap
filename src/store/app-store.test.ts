import { describe, it, expect, beforeEach } from "vitest";
import { useAppStore } from "./app-store";
import { HangulValidationError } from "@/lib/hangul/validate";

const INITIAL = {
  screen: "intro" as const,
  name1: "",
  name2: "",
  result: null,
  payment: { status: "idle" as const, error: null, orderId: null },
};

describe("store/app-store", () => {
  beforeEach(() => {
    useAppStore.setState(INITIAL);
  });

  it("초기 상태: intro 화면, 빈 이름, result null", () => {
    const s = useAppStore.getState();
    expect(s.screen).toBe("intro");
    expect(s.name1).toBe("");
    expect(s.result).toBeNull();
    expect(s.payment.status).toBe("idle");
  });

  it("setName1/setName2: 이름 저장", () => {
    useAppStore.getState().setName1("혁철");
    useAppStore.getState().setName2("민지");
    expect(useAppStore.getState().name1).toBe("혁철");
    expect(useAppStore.getState().name2).toBe("민지");
  });

  it("goToResult: 정상 이름 → result 채워지고 result-free 전환", () => {
    useAppStore.setState({ name1: "홍길동", name2: "김민지" });
    useAppStore.getState().goToResult();

    const s = useAppStore.getState();
    expect(s.screen).toBe("result-free");
    expect(s.result).not.toBeNull();
    expect(s.result?.totalScore).toBeGreaterThanOrEqual(1);
    expect(s.result?.totalScore).toBeLessThanOrEqual(99);
  });

  it("goToResult: 비한글 이름 → HangulValidationError throw", () => {
    useAppStore.setState({ name1: "Hong", name2: "민지" });
    expect(() => useAppStore.getState().goToResult()).toThrow(
      HangulValidationError,
    );
  });

  it("startPayment: mock 모드 → success → result-full 전환", async () => {
    useAppStore.setState({ name1: "홍길동", name2: "김민지" });
    useAppStore.getState().goToResult();

    await useAppStore.getState().startPayment();

    const s = useAppStore.getState();
    expect(s.payment.status).toBe("success");
    expect(s.payment.orderId).toMatch(/^mock_/);
    expect(s.screen).toBe("result-full");
  });

  it("restoreOnLaunch: mock 모드(결제 비활성) → 변화 없음", async () => {
    useAppStore.setState({ name1: "홍길동", name2: "김민지" });
    useAppStore.getState().goToResult();
    const before = useAppStore.getState().screen;

    await useAppStore.getState().restoreOnLaunch();

    // 결제 비활성 모드에서는 복원할 주문 0개 → 화면 유지
    expect(useAppStore.getState().screen).toBe(before);
  });

  it("reset: input 화면 + 모든 상태 초기화", () => {
    useAppStore.setState({
      name1: "홍길동",
      name2: "김민지",
      screen: "result-full",
    });
    useAppStore.getState().reset();

    const s = useAppStore.getState();
    expect(s.screen).toBe("input");
    expect(s.name1).toBe("");
    expect(s.name2).toBe("");
    expect(s.result).toBeNull();
    expect(s.payment.status).toBe("idle");
  });

  it("resetPayment: 결제 상태만 초기화", () => {
    useAppStore.setState({
      payment: { status: "failed", error: "NETWORK", orderId: null },
    });
    useAppStore.getState().resetPayment();
    expect(useAppStore.getState().payment.status).toBe("idle");
  });
});
