"use client";

// =============================================================================
// FreeGrid Types
// =============================================================================

import type React from "react";
import type { ElementLayout } from "@onegenui/core";

export interface FreeGridCanvasProps {
  columns?: number;
  rows?: number;
  cellSize?: number;
  gap?: number;
  minRowHeight?: number;
  showGrid?: boolean;
  gridLineColor?: string;
  backgroundColor?: string;
  children: React.ReactNode;
  onLayoutChange?: (elementKey: string, layout: ElementLayout) => void;
  className?: string;
  style?: React.CSSProperties;
}

export interface GridCellProps {
  column?: number;
  row?: number;
  columnSpan?: number;
  rowSpan?: number;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}
