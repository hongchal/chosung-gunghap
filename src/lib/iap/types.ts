export type PaymentStatus =
  | "idle"
  | "pending"
  | "success"
  | "failed"
  | "canceled";

export interface PaymentResult {
  success: boolean;
  orderId: string | null;
  errorCode?: string;
  mocked?: boolean;
}

export const IAP_SKU: string =
  (import.meta.env.VITE_IAP_SKU as string | undefined) ?? "share_unlock_v1";

/**
 * 결제 활성화 여부. 사업자 등록·콘솔 상품 등록 전에는 false → mock 동작.
 * .env: VITE_PAYMENT_ENABLED=true 로 실제 결제 활성화.
 */
export function isPaymentEnabled(): boolean {
  return import.meta.env.VITE_PAYMENT_ENABLED === "true";
}
