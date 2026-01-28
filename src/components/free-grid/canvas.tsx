"use client";

// =============================================================================
// FreeGrid Canvas Component
// =============================================================================

import { useMemo } from "react";
import type { FreeGridCanvasProps } from "./types";
import { gridContainerBaseStyle } from "./styles";
import { GridLines } from "./grid-lines";

/**
 * A CSS Grid-based canvas for free-form layout of UI elements.
 */
export function FreeGridCanvas({
  columns = 12,
  rows,
  cellSize,
  gap = 16,
  minRowHeight = 100,
  showGrid = false,
  gridLineColor = "rgba(255, 255, 255, 0.03)",
  backgroundColor,
  children,
  onLayoutChange: _onLayoutChange,
  className,
  style,
}: FreeGridCanvasProps) {
  const gridTemplateColumns = useMemo(() => {
    if (cellSize) {
      return `repeat(${columns}, ${cellSize}px)`;
    }
    return `repeat(${columns}, 1fr)`;
  }, [columns, cellSize]);

  const gridTemplateRows = useMemo(() => {
    if (rows) {
      if (cellSize) {
        return `repeat(${rows}, ${cellSize}px)`;
      }
      return `repeat(${rows}, minmax(${minRowHeight}px, auto))`;
    }
    return `repeat(auto-fill, minmax(${minRowHeight}px, auto))`;
  }, [rows, cellSize, minRowHeight]);

  const containerStyle: React.CSSProperties = {
    ...gridContainerBaseStyle,
    gridTemplateColumns,
    gridTemplateRows,
    gap,
    backgroundColor,
    ...style,
  };

  return (
    <div
      style={containerStyle}
      className={className}
      data-free-grid-canvas
      data-columns={columns}
      data-rows={rows}
    >
      {showGrid && (
        <GridLines columns={columns} rows={rows ?? 4} color={gridLineColor} />
      )}
      {children}
    </div>
  );
}
