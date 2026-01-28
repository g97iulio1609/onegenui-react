import type { ElementSize, ElementResizeConfig } from "@onegenui/core";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type ResizeHandle = "e" | "s" | "se" | "sw" | "n" | "w" | "ne" | "nw";

export interface ResizeState {
  /** Current width in pixels */
  width: number;
  /** Current height in pixels */
  height: number;
  /** Whether the element is currently being resized */
  isResizing: boolean;
  /** The active resize handle */
  activeHandle: ResizeHandle | null;
}

export interface UseResizableOptions {
  /** Initial size configuration */
  initialSize?: ElementSize;
  /** Resize behavior configuration */
  config?: ElementResizeConfig | boolean;
  /** Callback when resize starts */
  onResizeStart?: (state: ResizeState) => void;
  /** Callback during resize */
  onResize?: (state: ResizeState) => void;
  /** Callback when resize ends */
  onResizeEnd?: (state: ResizeState) => void;
  /** Element ref to measure initial size */
  elementRef?: React.RefObject<HTMLElement | null>;
  /** Constrain resize to container boundaries (default: true) */
  constrainToContainer?: boolean;
}

export interface UseResizableReturn {
  /** Current resize state */
  state: ResizeState;
  /** Start resizing from a handle */
  startResize: (
    handle: ResizeHandle,
    e: React.MouseEvent | React.TouchEvent,
  ) => void;
  /** Stop resizing */
  stopResize: () => void;
  /** Reset to initial size */
  reset: () => void;
  /** Get resize config (normalized from boolean) */
  resizeConfig: ElementResizeConfig;
  /** Style object to apply to the element */
  style: React.CSSProperties;
}

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

export const MOBILE_BREAKPOINT = 768;
