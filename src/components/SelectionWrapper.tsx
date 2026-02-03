"use client";

import {
  type ReactNode,
  useCallback,
  useState,
  useRef,
  useEffect,
} from "react";
import type { UIElement } from "@onegenui/core";
import { LongPressIndicator } from "./LongPressIndicator";
import {
  triggerHaptic,
  isIgnoredTarget,
  isInEdgeZone,
  MOVE_TOLERANCE_PX,
} from "../utils/selection";
import { useSelection } from "../contexts/selection";
import { useEditMode } from "../contexts/edit-mode";

/** Extended style type with webkit vendor prefix */
type ExtendedCSSStyleDeclaration = CSSStyleDeclaration & {
  webkitUserSelect?: string;
};

export interface SelectionWrapperProps {
  element: UIElement;
  enabled: boolean;
  onSelect?: (element: UIElement) => void;
  delayMs: number;
  isSelected: boolean;
  children: ReactNode;
}

export function SelectionWrapper({
  element,
  enabled,
  onSelect,
  delayMs,
  isSelected,
  children,
}: SelectionWrapperProps) {
  const [pressing, setPressing] = useState(false);
  const [pressPosition, setPressPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const startPositionRef = useRef<{ x: number; y: number } | null>(null);
  const longPressCompletedRef = useRef(false);
  const onSelectableItemRef = useRef(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Get edit mode state
  const { isEditing } = useEditMode();

  // Use context hook if available, with fallback for standalone usage
  let isDeepSelectionActive: () => boolean;
  try {
    const selectionContext = useSelection();
    isDeepSelectionActive = selectionContext.isDeepSelectionActive;
  } catch {
    // Fallback when used outside SelectionProvider
    isDeepSelectionActive = () =>
      typeof document !== "undefined" &&
      (document as unknown as { __jsonuiDeepSelectionActive?: boolean })
        .__jsonuiDeepSelectionActive === true;
  }

  const handleComplete = useCallback(() => {
    if (isDeepSelectionActive()) {
      setPressing(false);
      setPressPosition(null);
      return;
    }

    if (onSelect && enabled) {
      triggerHaptic(50);
      onSelect(element);
    }
    longPressCompletedRef.current = true;
    setPressing(false);
    setPressPosition(null);
  }, [element, enabled, onSelect, isDeepSelectionActive]);

  const handleCancel = useCallback(() => {
    setPressing(false);
    setPressPosition(null);
    startPositionRef.current = null;
  }, []);

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!enabled || !onSelect) return;
      if (isIgnoredTarget(event.target)) return;

      // In edit mode, check if the target is an editable text node
      // If so, don't start selection - let the edit interaction handle it
      if (isEditing) {
        const target = event.target as HTMLElement;
        const isEditableTarget =
          target.closest(".editable-text-node") ||
          target.closest("[data-editable='true']") ||
          target.hasAttribute("contenteditable");
        if (isEditableTarget) {
          return; // Let EditableWrapper handle this interaction
        }
      }

      const wrapper = wrapperRef.current;
      if (!wrapper) return;

      const firstChild = wrapper.querySelector(":scope > *") as HTMLElement;
      const targetElement = firstChild || wrapper;
      const rect = targetElement.getBoundingClientRect();

      if (rect.width === 0 && rect.height === 0) return;

      const isOnEdge = isInEdgeZone(event.clientX, event.clientY, rect);

      if (!isOnEdge && !isSelected) {
        return;
      }

      const target = event.target as HTMLElement;
      onSelectableItemRef.current = !!target.closest("[data-selectable-item]");

      longPressCompletedRef.current = false;
      startPositionRef.current = { x: event.clientX, y: event.clientY };
      setPressPosition({ x: event.clientX, y: event.clientY });
      setPressing(true);

      if (typeof document !== "undefined") {
        document.body.classList.add("select-none");
      }
    },
    [enabled, onSelect, isSelected, isEditing],
  );

  const handlePointerUp = useCallback(
    (_event?: React.PointerEvent<HTMLDivElement>) => {
      if (typeof document !== "undefined") {
        document.body.classList.remove("select-none");
      }
      handleCancel();
    },
    [handleCancel],
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!pressing || !startPositionRef.current) return;

      const dx = event.clientX - startPositionRef.current.x;
      const dy = event.clientY - startPositionRef.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > MOVE_TOLERANCE_PX) {
        handleCancel();
      }
    },
    [pressing, handleCancel],
  );

  const handleClickCapture = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (longPressCompletedRef.current) {
        longPressCompletedRef.current = false;
        event.preventDefault();
        event.stopPropagation();
      }
    },
    [],
  );

  useEffect(() => {
    return () => {
      if (typeof document !== "undefined") {
        document.body.style.userSelect = "";
        (document.body.style as ExtendedCSSStyleDeclaration).webkitUserSelect = "";
      }
      setPressing(false);
      setPressPosition(null);
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      style={{ display: "contents" }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onPointerMove={handlePointerMove}
      onClickCapture={handleClickCapture}
      data-jsonui-selected={isSelected ? "true" : undefined}
      data-jsonui-element-key={element.key}
    >
      {children}
      {pressing && pressPosition && (
        <LongPressIndicator
          x={pressPosition.x}
          y={pressPosition.y}
          durationMs={delayMs}
          onComplete={handleComplete}
        />
      )}
    </div>
  );
}
