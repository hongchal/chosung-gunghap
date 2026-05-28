import { create } from "zustand";
import type { CompatibilityResult } from "@/types/result";
import { computeCompatibility } from "@/lib/algorithm/compose";
import { purchaseShareUnlock } from "@/lib/iap/client";
import { restorePendingOrders } from "@/lib/iap/restore-orders";
import type { PaymentStatus } from "@/lib/iap/types";

export type Screen =
  | "intro"
  | "input"
  | "result-free"
  | "result-full"
  | "sharing";

interface PaymentState {
  status: PaymentStatus;
  error: string | null;
  orderId: string | null;
}

const INITIAL_PAYMENT: PaymentState = {
  status: "idle",
  error: null,
  orderId: null,
};

export interface AppState {
  screen: Screen;
  name1: string;
  name2: string;
  result: CompatibilityResult | null;
  payment: PaymentState;

  // actions
  setName1: (name: string) => void;
  setName2: (name: string) => void;
  goToInput: () => void;
  goToResult: () => void; // compute + 전환 (비한글 시 throw)
  startPayment: () => Promise<void>;
  restoreOnLaunch: () => Promise<void>;
  resetPayment: () => void;
  reset: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  screen: "intro",
  name1: "",
  name2: "",
  result: null,
  payment: { ...INITIAL_PAYMENT },

  setName1: (name) => set({ name1: name }),
  setName2: (name) => set({ name2: name }),

  goToInput: () => set({ screen: "input" }),

  goToResult: () => {
    const { name1, name2 } = get();
    // 검증 실패 시 HangulValidationError throw → UI에서 처리
    const result = computeCompatibility(name1, name2);
    set({ result, screen: "result-free" });
  },

  startPayment: async () => {
    set({ payment: { status: "pending", error: null, orderId: null } });
    const res = await purchaseShareUnlock();

    if (res.success) {
      set({
        screen: "result-full",
        payment: { status: "success", error: null, orderId: res.orderId },
      });
    } else {
      const status: PaymentStatus =
        res.errorCode === "USER_CANCELED" ? "canceled" : "failed";
      set({
        payment: { status, error: res.errorCode ?? null, orderId: null },
      });
    }
  },

  // 앱 진입 시 미결 주문 복원 → 있으면 result-full로 점프
  restoreOnLaunch: async () => {
    const restored = await restorePendingOrders();
    if (restored.length > 0 && get().result) {
      set({
        screen: "result-full",
        payment: { status: "success", error: null, orderId: restored[0] },
      });
    }
  },

  resetPayment: () => set({ payment: { ...INITIAL_PAYMENT } }),

  reset: () =>
    set({
      screen: "input",
      name1: "",
      name2: "",
      result: null,
      payment: { ...INITIAL_PAYMENT },
    }),
}));
