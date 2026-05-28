import { useEffect, useState } from "react";
import { colors } from "@toss/tds-colors";

interface Props {
  score: number;
  durationMs?: number;
}

/** 0 → score 카운트업 애니메이션 (결과를 "이벤트"로 만드는 피크) */
export function ScoreReveal({ score, durationMs = 600 }: Props) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3);
      setCurrent(Math.round(eased * score));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [score, durationMs]);

  return (
    <div style={{ textAlign: "center", padding: "8px 0" }}>
      <span style={{ fontSize: 64, fontWeight: 800, color: colors.blue500 }}>
        {current}
      </span>
      <span style={{ fontSize: 28, fontWeight: 700, color: colors.blue500 }}>
        점
      </span>
    </div>
  );
}
