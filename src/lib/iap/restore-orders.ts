import { isPaymentEnabled } from "./types";

/**
 * 앱 진입 시 미결 주문 복원. 결제 성공했으나 지급이 안 된 주문을 완료 처리.
 * 복원된 orderId 배열 반환 (하나라도 있으면 result-full로 점프 가능).
 */
export async function restorePendingOrders(): Promise<string[]> {
  if (!isPaymentEnabled()) return [];

  const { IAP } = await import("@apps-in-toss/web-framework");
  const restored: string[] = [];

  try {
    const pending = await IAP.getPendingOrders();
    const orders = pending?.orders ?? [];
    for (const order of orders) {
      await IAP.completeProductGrant({ params: { orderId: order.orderId } });
      restored.push(order.orderId);
    }
  } catch (error) {
    console.error("미결 주문 복원 실패:", error);
  }

  return restored;
}
