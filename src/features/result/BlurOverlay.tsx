import type { ReactNode } from "react";
import { colors } from "@toss/tds-colors";

interface Props {
  locked: boolean;
  children: ReactNode;
}

/** 유료 영역 블러 처리. locked=true면 흐림 + "공유 시 잠금 해제" 칩. */
export function BlurOverlay({ locked, children }: Props) {
  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          filter: locked ? "blur(8px)" : "none",
          pointerEvents: locked ? "none" : "auto",
          userSelect: locked ? "none" : "auto",
          transition: "filter 0.5s ease",
        }}
        aria-hidden={locked}
      >
        {children}
      </div>

      {locked && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              background: colors.greyOpacity200,
              color: colors.grey700,
              fontSize: 14,
              fontWeight: 600,
              padding: "8px 16px",
              borderRadius: 999,
            }}
          >
            🔓 공유 시 잠금 해제
          </span>
        </div>
      )}
    </div>
  );
}
