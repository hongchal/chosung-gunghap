import { useState } from "react";
import { useAppStore } from "@/store/app-store";
import { generateShareCard } from "@/lib/canvas/generate-card";
import { isPaymentEnabled } from "@/lib/iap/types";

type ShareSdk = {
  share?: (opts: { message: string }) => Promise<void> | void;
};

/**
 * 공유 실행: 9:16 카드 생성 → 이미지 저장 → 토스 share(텍스트+유도 문구).
 * 결과 화면 캡처는 막지 않고, 카드의 가치로 차별화 (D-20).
 */
export function useShare() {
  const result = useAppStore((s) => s.result);
  const [sharing, setSharing] = useState(false);

  const shareResult = async () => {
    if (!result || sharing) return;
    setSharing(true);
    try {
      // 1. 9:16 카드 생성
      const blob = await generateShareCard(result);

      // 2. 이미지 저장 (사용자가 인스타 스토리 등에 직접 첨부)
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `이름궁합_${result.name1}_${result.name2}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      // 3. 토스 공유 다이얼로그 (텍스트 + 유입 유도) — 실 환경에서만
      if (isPaymentEnabled()) {
        const sdk = (await import("@apps-in-toss/web-framework")) as ShareSdk;
        const message = `${result.name1}님과 ${result.name2}님의 케미는 ${result.totalScore}점! 너도 해봐 👉 토스에서 '이름궁합' 검색`;
        await sdk.share?.({ message });
      }
    } catch (error) {
      console.error("공유 실패:", error);
    } finally {
      setSharing(false);
    }
  };

  return { shareResult, sharing };
}
