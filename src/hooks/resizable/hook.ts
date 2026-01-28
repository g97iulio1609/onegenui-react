"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import type {
  ResizeState,
  ResizeHandle,
  UseResizableOptions,
  UseResizableReturn,
} from "./types";
import { MOBILE_BREAKPOINT } from "./types";
import {
  parseSize,
  normalizeConfig,
  snapToGrid,
  findScrollableContainer,
  getContainerConstraints,
  getCursorForHandle,
} from "./utils";

/**
 * Hook to handle element resizing with mouse/touch drag.
 *
 * @example
 * ```tsx
 * function ResizableCard() {
 *   const ref = useRef<HTMLDivElement>(null);
 *   const { state, startResize, style } = useResizable({
 *     initialSize: { width: 300, height: 200 },
 *     config: { horizontal: true, vertical: true },
 *     elementRef: ref,
 *   });
 *
 *   return (
 *     <div ref={ref} style={style}>
 *       <ResizeHandle position="se" onMouseDown={(e) => startResize('se', e)} />
 *     </div>
 *   );
 * }
 * ```
 */
export function useResizable({
  initialSize,
  config,
  onResizeStart,
  onResize,
  onResizeEnd,
  elementRef,
  constrainToContainer = true,
}: UseResizableOptions = {}): UseResizableReturn {
  const resizeConfig = normalizeConfig(config);

  const initialWidth = parseSize(initialSize?.width, 0);
  const initialHeight = parseSize(initialSize?.height, 0);
  const hasExplicitSize = initialWidth > 0 || initialHeight > 0;

  const [state, setState] = useState<ResizeState>({
    width: initialWidth,
    height: initialHeight,
    isResizing: false,
    activeHandle: null,
  });

  const [hasResized, setHasResized] = useState(hasExplicitSize);
  const dragStart = useRef({ x: 0, y: 0, width: 0, height: 0 });
  const containerRef = useRef<HTMLElement | null>(null);
  const lastBreakpointRef = useRef<"mobile" | "desktop" | null>(null);

  // Reset resize on breakpoint change
  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkBreakpoint = () => {
      const currentBreakpoint =
        window.innerWidth <= MOBILE_BREAKPOINT ? "mobile" : "desktop";

      if (
        lastBreakpointRef.current !== null &&
        lastBreakpointRef.current !== currentBreakpoint
      ) {
        setHasResized(false);
        setState({
          width: initialWidth,
          height: initialHeight,
          isResizing: false,
          activeHandle: null,
        });
      }

      lastBreakpointRef.current = currentBreakpoint;
    };

    checkBreakpoint();

    const mediaQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);
    mediaQuery.addEventListener("change", checkBreakpoint);

    return () => {
      mediaQuery.removeEventListener("change", checkBreakpoint);
    };
  }, [initialWidth, initialHeight]);

  const startResize = useCallback(
    (handle: ResizeHandle, e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const clientX = "touches" in e ? (e.touches[0]?.clientX ?? 0) : e.clientX;
      const clientY = "touches" in e ? (e.touches[0]?.clientY ?? 0) : e.clientY;

      let currentWidth = state.width;
      let currentHeight = state.height;

      if (elementRef?.current) {
        const rect = elementRef.current.getBoundingClientRect();
        currentWidth = rect.width;
        currentHeight = rect.height;

        if (constrainToContainer) {
          containerRef.current = findScrollableContainer(elementRef.current);
        }
      }

      dragStart.current = {
        x: clientX,
        y: clientY,
        width: currentWidth,
        height: currentHeight,
      };

      const newState: ResizeState = {
        width: currentWidth,
        height: currentHeight,
        isResizing: true,
        activeHandle: handle,
      };

      setState(newState);
      onResizeStart?.(newState);
    },
    [
      state.width,
      state.height,
      elementRef,
      onResizeStart,
      constrainToContainer,
    ],
  );

  const stopResize = useCallback(() => {
    setState((prev) => {
      if (!prev.isResizing) return prev;

      const finalState: ResizeState = {
        ...prev,
        isResizing: false,
        activeHandle: null,
      };

      setHasResized(true);

      if (onResizeEnd) {
        queueMicrotask(() => {
          onResizeEnd(finalState);
        });
      }

      return finalState;
    });

    containerRef.current = null;
  }, [onResizeEnd]);

  const reset = useCallback(() => {
    setState({
      width: initialWidth,
      height: initialHeight,
      isResizing: false,
      activeHandle: null,
    });
    setHasResized(hasExplicitSize);
  }, [initialWidth, initialHeight, hasExplicitSize]);

  // Handle mouse/touch move during resize
  useEffect(() => {
    if (!state.isResizing || !state.activeHandle) return;

    const handleMove = (e: MouseEvent | TouchEvent) => {
      const clientX = "touches" in e ? (e.touches[0]?.clientX ?? 0) : e.clientX;
      const clientY = "touches" in e ? (e.touches[0]?.clientY ?? 0) : e.clientY;

      const deltaX = clientX - dragStart.current.x;
      const deltaY = clientY - dragStart.current.y;

      let newWidth = dragStart.current.width;
      let newHeight = dragStart.current.height;

      const handle = state.activeHandle!;

      if (handle.includes("e") && resizeConfig.horizontal) {
        newWidth = dragStart.current.width + deltaX;
      }
      if (handle.includes("w") && resizeConfig.horizontal) {
        newWidth = dragStart.current.width - deltaX;
      }
      if (handle.includes("s") && resizeConfig.vertical) {
        newHeight = dragStart.current.height + deltaY;
      }
      if (handle.includes("n") && resizeConfig.vertical) {
        newHeight = dragStart.current.height - deltaY;
      }

      let minWidth = initialSize?.minWidth ?? 50;
      let maxWidth = initialSize?.maxWidth ?? Infinity;
      let minHeight = initialSize?.minHeight ?? 50;
      let maxHeight = initialSize?.maxHeight ?? Infinity;

      if (constrainToContainer && containerRef.current && elementRef?.current) {
        const containerConstraints = getContainerConstraints(
          elementRef.current,
          containerRef.current,
          handle,
        );
        maxWidth = Math.min(maxWidth, containerConstraints.maxWidth);
        maxHeight = Math.min(maxHeight, containerConstraints.maxHeight);
      }

      newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
      newHeight = Math.max(minHeight, Math.min(maxHeight, newHeight));

      newWidth = snapToGrid(newWidth, resizeConfig.snapToGrid);
      newHeight = snapToGrid(newHeight, resizeConfig.snapToGrid);

      if (resizeConfig.preserveAspectRatio && dragStart.current.width > 0) {
        const aspectRatio = dragStart.current.height / dragStart.current.width;
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          newHeight = newWidth * aspectRatio;
        } else {
          newWidth = newHeight / aspectRatio;
        }
      }

      const newState: ResizeState = {
        width: newWidth,
        height: newHeight,
        isResizing: true,
        activeHandle: state.activeHandle,
      };

      setState(newState);
      onResize?.(newState);
    };

    const handleEnd = () => {
      stopResize();
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleEnd);
    window.addEventListener("touchmove", handleMove);
    window.addEventListener("touchend", handleEnd);

    document.body.style.userSelect = "none";
    document.body.style.cursor = getCursorForHandle(state.activeHandle);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleEnd);
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    };
  }, [
    state.isResizing,
    state.activeHandle,
    resizeConfig,
    initialSize,
    onResize,
    stopResize,
    constrainToContainer,
    elementRef,
  ]);

  // Generate style object
  const style: React.CSSProperties = {};

  if (hasResized) {
    if (state.width > 0) {
      style.width = "100%";
      style.maxWidth = state.width;
      style.minWidth = Math.min(200, state.width * 0.5);
    }
    if (state.height > 0) {
      style.height = state.height;
      style.minHeight = Math.min(100, state.height * 0.5);
    }
  }

  return {
    state,
    startResize,
    stopResize,
    reset,
    resizeConfig,
    style,
  };
}
