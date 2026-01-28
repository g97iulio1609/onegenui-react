"use client";

// =============================================================================
// FreeGrid Styles
// =============================================================================

import type React from "react";

export const gridContainerBaseStyle: React.CSSProperties = {
  display: "grid",
  position: "relative",
  width: "100%",
  minHeight: "100%",
  boxSizing: "border-box",
};

export const gridLinesOverlayStyle: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  pointerEvents: "none",
  zIndex: 0,
};

export const gridCellBaseStyle: React.CSSProperties = {
  position: "relative",
  zIndex: 1,
  minWidth: 0,
  minHeight: 0,
};
