import { useEffect, useState } from "react";
import { colors } from "@toss/tds-colors";
import styles from "./PyramidLadder.module.css";

const CELL = 46; // 셀 가로 간격(px)
const ROW_H = 58; // 줄 세로 간격(px)
const R = 17; // 숫자 원 반지름

interface Props {
  rows: number[][]; // getStrokePyramid 결과
  syllables?: string[]; // 첫 줄 글자 라벨 (획수 배치와 동일 순서)
  onComplete: () => void;
  rowDelayMs?: number;
}

const LABEL_GAP = 26; // 글자 라벨이 차지하는 상단 높이

/**
 * 사다리게임 스타일 획수 피라미드 애니메이션.
 * 위→아래로 한 줄씩 등장하며 인접 숫자가 사선으로 연결되어 합쳐짐.
 */
export function PyramidLadder({
  rows,
  syllables,
  onComplete,
  rowDelayMs = 500,
}: Props) {
  const [visible, setVisible] = useState(1);

  useEffect(() => {
    if (rows.length === 0) {
      onComplete();
      return;
    }
    if (visible >= rows.length) {
      const t = setTimeout(onComplete, 600);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setVisible((v) => v + 1), rowDelayMs);
    return () => clearTimeout(t);
  }, [visible, rows.length, onComplete, rowDelayMs]);

  if (rows.length === 0) return null;

  const maxLen = rows[0].length;
  const hasLabels = syllables != null && syllables.length === maxLen;
  const topPad = hasLabels ? LABEL_GAP : 0;
  const W = maxLen * CELL;
  const H = rows.length * ROW_H + topPad;

  const xPos = (rowLen: number, j: number) => {
    const offset = (W - rowLen * CELL) / 2;
    return offset + j * CELL + CELL / 2;
  };
  const yPos = (i: number) => i * ROW_H + ROW_H / 2 + topPad;

  const lastRowIdx = rows.length - 1;

  return (
    <div className={styles.wrap}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: W }}>
        {/* 글자 라벨 (첫 줄 위) */}
        {hasLabels &&
          syllables.map((ch, j) => (
            <text
              key={`label-${j}`}
              x={xPos(maxLen, j)}
              y={LABEL_GAP / 2}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={14}
              fontWeight="bold"
              fill={colors.grey700}
            >
              {ch}
            </text>
          ))}

        {/* 연결선 (사다리) */}
        {rows.slice(0, visible).map((row, i) => {
          if (i === 0) return null;
          const prevLen = rows[i - 1].length;
          return row.map((_, j) => (
            <g key={`line-${i}-${j}`} className={styles.row}>
              <line
                x1={xPos(prevLen, j)}
                y1={yPos(i - 1)}
                x2={xPos(row.length, j)}
                y2={yPos(i)}
                stroke={colors.grey200}
                strokeWidth={2}
              />
              <line
                x1={xPos(prevLen, j + 1)}
                y1={yPos(i - 1)}
                x2={xPos(row.length, j)}
                y2={yPos(i)}
                stroke={colors.grey200}
                strokeWidth={2}
              />
            </g>
          ));
        })}

        {/* 숫자 노드 */}
        {rows.slice(0, visible).map((row, i) => {
          const isLast = i === lastRowIdx;
          return (
            <g key={`row-${i}`} className={styles.row}>
              {row.map((n, j) => (
                <g key={j}>
                  <circle
                    cx={xPos(row.length, j)}
                    cy={yPos(i)}
                    r={R}
                    fill={isLast ? colors.blue500 : colors.white}
                    stroke={colors.blue500}
                    strokeWidth={1.5}
                  />
                  <text
                    x={xPos(row.length, j)}
                    y={yPos(i)}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={15}
                    fontWeight="bold"
                    fill={isLast ? colors.white : colors.grey800}
                  >
                    {n}
                  </text>
                </g>
              ))}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
