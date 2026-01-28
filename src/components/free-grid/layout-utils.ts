"use client";

// =============================================================================
// Layout Utilities
// =============================================================================

import type React from "react";
import type { ElementLayout } from "@onegenui/core";

/**
 * Generate CSS styles from an element's layout configuration.
 */
export function getLayoutStyles(
  layout: ElementLayout | undefined,
): React.CSSProperties {
  if (!layout) return {};

  const styles: React.CSSProperties = {};

  // Apply sizing
  if (layout.size) {
    if (layout.size.width !== undefined) styles.width = layout.size.width;
    if (layout.size.height !== undefined) styles.height = layout.size.height;
    if (layout.size.minWidth !== undefined)
      styles.minWidth = layout.size.minWidth;
    if (layout.size.maxWidth !== undefined)
      styles.maxWidth = layout.size.maxWidth;
    if (layout.size.minHeight !== undefined)
      styles.minHeight = layout.size.minHeight;
    if (layout.size.maxHeight !== undefined)
      styles.maxHeight = layout.size.maxHeight;
  }

  // Apply grid positioning
  if (layout.grid) {
    if (layout.grid.column !== undefined) {
      styles.gridColumnStart = layout.grid.column;
    }
    if (layout.grid.row !== undefined) {
      styles.gridRowStart = layout.grid.row;
    }
    if (layout.grid.columnSpan !== undefined && layout.grid.columnSpan > 1) {
      styles.gridColumnEnd = `span ${layout.grid.columnSpan}`;
    }
    if (layout.grid.rowSpan !== undefined && layout.grid.rowSpan > 1) {
      styles.gridRowEnd = `span ${layout.grid.rowSpan}`;
    }
  }

  return styles;
}

/**
 * Create a layout configuration from grid position and size.
 */
export function createLayout(
  options: {
    column?: number;
    row?: number;
    columnSpan?: number;
    rowSpan?: number;
    width?: number | string;
    height?: number | string;
    resizable?: boolean;
  } = {},
): ElementLayout {
  return {
    grid: {
      column: options.column,
      row: options.row,
      columnSpan: options.columnSpan,
      rowSpan: options.rowSpan,
    },
    size: {
      width: options.width,
      height: options.height,
    },
    resizable: options.resizable,
  };
}
