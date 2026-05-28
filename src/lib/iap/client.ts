import { IAP_SKU, isPaymentEnabled, type PaymentResult } from "./types";

const MOCK_DELAY_MS = 350;

async function mockPurchase(): Promise<PaymentResult> {
  // 결제창 호출 시뮬레이션
  await new Promise((r) => setTimeout(r, MOCK_DELAY_MS));
  return { success: true, orderId: `mock_${Date.now()}`, mocked: true };
}

/**
 * 공유 잠금 해제 IAP 결제.
 * - PAYMENT_ENABLED=false: mock 성공 반환 (사업자 등록 전 개발/테스트용)
 * - PAYMENT_ENABLED=true: 실제 @apps-in-toss/web-framework IAP 호출
 *
 * processProductGrant 콜백은 반드시 true 반환 (SKU mismatch 403 회피, D-17 참고).
 */
export async function purchaseShareUnlock(): Promise<PaymentResult> {
  if (!isPaymentEnabled()) {
    return mockPurchase();
  }

  // 실제 결제 시에만 SDK 로드 (node 테스트 환경에서 import 회피)
  const { IAP } = await import("@apps-in-toss/web-framework");

  return new Promise<PaymentResult>((resolve) => {
    let settled = false;
    const finish = (result: PaymentResult) => {
      if (!settled) {
        settled = true;
        resolve(result);
      }
    };

    try {
      const cleanup = IAP.createOneTimePurchaseOrder({
        options: {
          sku: IAP_SKU,
          processProductGrant: () => true, // 즉시 true (비동기 서버 검증은 store에서)
        },
        onEvent: (event: { type: string; data?: { orderId?: string } }) => {
          if (event.type === "success") {
            finish({ success: true, orderId: event.data?.orderId ?? null });
          }
          cleanup();
        },
        onError: (error: unknown) => {
          finish({
            success: false,
            orderId: null,
            errorCode: (error as { code?: string })?.code ?? "UNKNOWN",
          });
          cleanup();
        },
      });
    } catch (error) {
      finish({
        success: false,
        orderId: null,
        errorCode: (error as { code?: string })?.code ?? "UNKNOWN",
      });
    }
  });
}
