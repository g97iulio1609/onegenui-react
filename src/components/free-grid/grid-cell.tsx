"use client";

// =============================================================================
// Grid Cell Component
// =============================================================================

import type { GridCellProps } from "./types";
import { gridCellBaseStyle } from "./styles";

/**
 * A cell within the FreeGridCanvas that can span multiple columns/rows.
 */
export function GridCell({
  column,
  row,
  columnSpan = 1,
  rowSpan = 1,
  children,
  className,
  style,
}: GridCellProps) {
  const cellStyle: React.CSSProperties = {
    ...gridCellBaseStyle,
    ...(column && { gridColumnStart: column }),
    ...(row && { gridRowStart: row }),
    gridColumnEnd: columnSpan > 1 ? `span ${columnSpan}` : undefined,
    gridRowEnd: rowSpan > 1 ? `span ${rowSpan}` : undefined,
    ...style,
  };

  return (
    <div style={cellStyle} className={className} data-grid-cell>
      {children}
    </div>
  );
}
