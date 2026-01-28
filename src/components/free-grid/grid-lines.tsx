"use client";

// =============================================================================
// Grid Lines Component
// =============================================================================

import { useMemo } from "react";
import { gridLinesOverlayStyle } from "./styles";

interface GridLinesProps {
  columns: number;
  rows: number;
  color: string;
}

export function GridLines({ columns, rows, color }: GridLinesProps) {
  const patternId = useMemo(
    () => `grid-pattern-${Math.random().toString(36).substr(2, 9)}`,
    [],
  );

  return (
    <svg style={gridLinesOverlayStyle} aria-hidden="true">
      <defs>
        <pattern
          id={patternId}
          width={`${100 / columns}%`}
          height={`${100 / Math.max(rows, 1)}%`}
          patternUnits="objectBoundingBox"
        >
          <rect
            width="100%"
            height="100%"
            fill="none"
            stroke={color}
            strokeWidth="1"
            strokeDasharray="4 2"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
}
