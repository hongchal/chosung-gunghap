import type { CompatibilityResult } from "@/types/result";
import { CARD_W, CARD_H, getCardGradient } from "./layouts";

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/**
 * 9:16 공유 카드 생성 (결제 전용 프리미엄, D-20).
 * 두 이름이 박힌 개인화 카드 + 하단 워터마크(역바이럴 진입 유도).
 */
export async function generateShareCard(
  result: CompatibilityResult,
): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = CARD_W;
  canvas.height = CARD_H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context를 가져올 수 없어요");

  // 배경 그라데이션 (오행 관계 기반)
  const [c1, c2] = getCardGradient(result.ohaengLabel.relation);
  const grad = ctx.createLinearGradient(0, 0, 0, CARD_H);
  grad.addColorStop(0, c1);
  grad.addColorStop(1, c2);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, CARD_W, CARD_H);

  ctx.textAlign = "center";

  // 두 이름
  ctx.fillStyle = "rgba(255,255,255,0.95)";
  ctx.font = "bold 72px sans-serif";
  ctx.fillText(`${result.name1}  ✕  ${result.name2}`, CARD_W / 2, 360);

  // 점수 (큰 숫자)
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 280px sans-serif";
  ctx.fillText(`${result.totalScore}`, CARD_W / 2, 760);
  ctx.font = "bold 80px sans-serif";
  ctx.fillText("점", CARD_W / 2 + 220, 740);

  // 한 줄 코멘트
  ctx.font = "bold 56px sans-serif";
  ctx.fillText(result.oneLineComment, CARD_W / 2, 920);

  // 오행 라벨 (흰 알약 박스)
  const label = result.ohaengLabel.label;
  ctx.font = "44px sans-serif";
  const labelW = ctx.measureText(label).width + 80;
  ctx.fillStyle = "rgba(255,255,255,0.25)";
  roundRect(ctx, (CARD_W - labelW) / 2, 1020, labelW, 90, 45);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.fillText(label, CARD_W / 2, 1080);

  // 하단 워터마크 (역바이럴: 받는 사람 진입 유도)
  ctx.fillStyle = "rgba(255,255,255,0.95)";
  ctx.font = "bold 52px sans-serif";
  ctx.fillText("이름궁합", CARD_W / 2, 1760);
  ctx.fillStyle = "rgba(255,255,255,0.8)";
  ctx.font = "38px sans-serif";
  ctx.fillText("토스에서 '이름궁합' 검색", CARD_W / 2, 1820);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("카드 생성 실패"))),
      "image/png",
    );
  });
}
