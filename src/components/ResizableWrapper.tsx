"use client";

import React, { useRef, useCallback, useMemo } from "react";
import type { UIElement, ElementLayout } from "@onegenui/core";
import {
  useResizable,
  type ResizeHandle,
  type ResizeState,
  getResizeCursor,
} from "../hooks/useResizable";
import { cn } from "../utils";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface ResizableWrapperProps {
  /** The UI element being rendered */
  element: UIElement;
  /** Child content to render */
  children: React.ReactNode;
  /** Override layout config */
  layout?: ElementLayout;
  /** Callback when element is resized */
  onResize?: (
    elementKey: string,
    size: { width: number; height: number },
  ) => void;
  /** Custom className */
  className?: string;
  /** Whether resize is enabled (overrides element.layout.resizable) */
  enabled?: boolean;
  /** Force handles visible (e.g., when element is selected) */
  showHandles?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Handle Component
// ─────────────────────────────────────────────────────────────────────────────

interface ResizeHandleComponentProps {
  position: ResizeHandle;
  onMouseDown: (e: React.MouseEvent) => void;
  onTouchStart: (e: React.TouchEvent) => void;
  isResizing: boolean;
  visible: boolean;
}

function ResizeHandleComponent({
  position,
  onMouseDown,
  onTouchStart,
  isResizing,
  visible,
}: ResizeHandleComponentProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  const [isTouching, setIsTouching] = React.useState(false);

  // Position classes map
  const positionClasses: Record<ResizeHandle, string> = {
    e: "right-[-4px] top-0 bottom-0 w-2 cursor-ew-resize",
    w: "left-[-4px] top-0 bottom-0 w-2 cursor-ew-resize",
    s: "bottom-[-4px] left-0 right-0 h-2 cursor-ns-resize",
    n: "top-[-4px] left-0 right-0 h-2 cursor-ns-resize",
    se: "right-[-6px] bottom-[-6px] w-3 h-3 cursor-nwse-resize rounded-full",
    sw: "left-[-6px] bottom-[-6px] w-3 h-3 cursor-nesw-resize rounded-full",
    ne: "right-[-6px] top-[-6px] w-3 h-3 cursor-nesw-resize rounded-full",
    nw: "left-[-6px] top-[-6px] w-3 h-3 cursor-nwse-resize rounded-full",
  };

  return (
    <div
      className={cn(
        "absolute z-10 opacity-0 transition-opacity duration-150 bg-transparent",
        positionClasses[position],
        (visible || isResizing || isTouching) && "opacity-100",
        (isHovered || isResizing) && "bg-primary",
      )}
      onMouseDown={onMouseDown}
      onTouchStart={(e) => {
        setIsTouching(true);
        onTouchStart(e);
      }}
      onTouchEnd={() => setIsTouching(false)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="separator"
      aria-orientation={
        position === "e" || position === "w" ? "vertical" : "horizontal"
      }
      aria-label={`Resize ${position}`}
      data-resize-handle={position}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Wrapper component that adds resize handles to its children.
 *
 * Reads configuration from `element.layout.resizable` or accepts overrides via props.
 * Handles are only shown when the wrapper is hovered.
 *
 * @example
 * ```tsx
 * <ResizableWrapper
 *   element={element}
 *   onResize={(key, size) => console.log(`${key} resized to ${size.width}x${size.height}`)}
 * >
 *   <Card {...cardProps} />
 * </ResizableWrapper>
 * ```
 */
export function ResizableWrapper({
  element,
  children,
  layout: overrideLayout,
  onResize,
  className,
  enabled: overrideEnabled,
  showHandles = false,
}: ResizableWrapperProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = React.useState(false);

  // Merge layout from element and overrides
  const layout = overrideLayout ?? element.layout;
  const resizableConfig = layout?.resizable;

  // Determine if resizing is enabled (default true unless explicitly false)
  const isEnabled =
    overrideEnabled !== undefined ? overrideEnabled : resizableConfig !== false;

  // Normalize config to default enabled behavior
  const normalizedConfig =
    resizableConfig === undefined ? true : resizableConfig;

  // Callback when resize ends
  const handleResizeEnd = useCallback(
    (state: ResizeState) => {
      if (!onResize) return;
      onResize(element.key, { width: state.width, height: state.height });
    },
    [element.key, onResize],
  );

  const {
    state,
    startResize,
    resizeConfig,
    style: resizeStyle,
  } = useResizable({
    initialSize: layout?.size,
    config: normalizedConfig,
    onResizeEnd: handleResizeEnd,
    elementRef: wrapperRef,
  });

  // If not resizable, just render children directly
  if (!isEnabled) {
    return <>{children}</>;
  }

  // Determine which handles to show (memoized for performance)
  const handles = useMemo((): ResizeHandle[] => {
    const result: ResizeHandle[] = [];
    if (resizeConfig.horizontal) {
      result.push("e", "w");
    }
    if (resizeConfig.vertical) {
      result.push("s", "n");
    }
    if (resizeConfig.horizontal && resizeConfig.vertical) {
      result.push("se", "sw", "ne", "nw");
    }
    return result;
  }, [resizeConfig.horizontal, resizeConfig.vertical]);

  // Build grid column/row styles properly (avoid conflicts)
  const gridColumnStyle = (() => {
    const col = layout?.grid?.column;
    const span = layout?.grid?.columnSpan;
    if (col && span && span > 1) {
      return `${col} / span ${span}`;
    }
    if (span && span > 1) {
      return `span ${span}`;
    }
    if (col) {
      return col;
    }
    return undefined;
  })();

  const gridRowStyle = (() => {
    const row = layout?.grid?.row;
    const span = layout?.grid?.rowSpan;
    if (row && span && span > 1) {
      return `${row} / span ${span}`;
    }
    if (span && span > 1) {
      return `span ${span}`;
    }
    if (row) {
      return row;
    }
    return undefined;
  })();

  // Combine styles
  const combinedStyle: React.CSSProperties = {
    ...resizeStyle,
    // Apply grid layout if configured (properly merged)
    ...(gridColumnStyle && { gridColumn: gridColumnStyle }),
    ...(gridRowStyle && { gridRow: gridRowStyle }),
  };

  const shouldShowHandles = showHandles || isHovered || state.isResizing;

  return (
    <div
      ref={wrapperRef}
      style={combinedStyle}
      className={cn(
        "relative box-border",
        state.isResizing && "outline-[2px] outline-primary outline-offset-2",
        className,
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-resizable="true"
      data-element-key={element.key}
    >
      {children}

      {/* Render resize handles */}
      {handles.map((handle) => (
        <ResizeHandleComponent
          key={handle}
          position={handle}
          onMouseDown={(e) => startResize(handle, e)}
          onTouchStart={(e) => startResize(handle, e)}
          isResizing={state.isResizing && state.activeHandle === handle}
          visible={shouldShowHandles}
        />
      ))}

      {/* Size indicator during resize */}
      {state.isResizing && (
        <div className="absolute bottom-2 right-2 px-2 py-1 bg-primary text-white text-[11px] font-medium rounded pointer-events-none z-11">
          {Math.round(state.width)} x {Math.round(state.height)}
        </div>
      )}
    </div>
  );
}

// Re-export types for convenience
export type { ResizeHandle, ResizeState };
export { getResizeCursor };
