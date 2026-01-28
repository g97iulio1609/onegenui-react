"use client";

import React, { memo, useEffect, useState } from "react";
import {
  useActiveToolProgress,
  useIsToolRunning,
} from "../contexts/tool-progress";
import type { ToolProgressEvent } from "../contexts/tool-progress";
import {
  positionStyles,
  progressAnimations,
  DefaultProgressItem,
} from "./tool-progress";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface ToolProgressOverlayProps {
  /** Position of the overlay */
  position?:
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left"
    | "top-center";
  /** Custom class name */
  className?: string;
  /** Whether to show the overlay (default: auto based on isToolRunning) */
  show?: boolean;
  /** Maximum number of items to show */
  maxItems?: number;
  /** Custom render function for each progress item */
  renderItem?: (progress: ToolProgressEvent) => React.ReactNode;
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────

/**
 * ToolProgressOverlay - Automatically shows tool execution progress
 *
 * This component renders as a floating overlay that automatically appears
 * when tools are running and hides when complete. Place it once at the root
 * of your app for global tool progress visibility.
 *
 * @example
 * ```tsx
 * <ToolProgressProvider>
 *   <App />
 *   <ToolProgressOverlay position="top-right" />
 * </ToolProgressProvider>
 * ```
 */
export const ToolProgressOverlay = memo(function ToolProgressOverlay({
  position = "top-right",
  className,
  show,
  maxItems = 5,
  renderItem,
}: ToolProgressOverlayProps) {
  const activeProgress = useActiveToolProgress();
  const isRunning = useIsToolRunning();
  const [mounted, setMounted] = useState(false);

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine visibility
  const shouldShow = show ?? isRunning;

  // Don't render on server or if not showing
  if (!mounted || !shouldShow || activeProgress.length === 0) {
    return null;
  }

  const visibleProgress = activeProgress.slice(0, maxItems);

  return (
    <>
      {/* CSS Animations */}
      <style>{progressAnimations}</style>

      {/* Overlay Container */}
      <div
        className={className}
        style={{
          position: "fixed",
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          gap: 8,
          pointerEvents: "none",
          ...positionStyles[position],
        }}
      >
        {visibleProgress.map((progress) =>
          renderItem ? (
            <div key={progress.toolCallId} style={{ pointerEvents: "auto" }}>
              {renderItem(progress)}
            </div>
          ) : (
            <DefaultProgressItem
              key={progress.toolCallId}
              progress={progress}
            />
          ),
        )}
      </div>
    </>
  );
});
