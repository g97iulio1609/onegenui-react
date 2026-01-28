"use client";

import {
  type ReactNode,
  useEffect,
  useRef,
  createContext,
  useContext,
} from "react";
import type { UITree } from "@onegenui/core";
import type { TrackedAction } from "../hooks/types";
import { isSelectionInteraction } from "../utils/dom";
import {
  getActionTypeFromEvent,
  extractInteractionContext,
  findClosestElementKey,
} from "../utils/selection";
import { useSelection } from "../contexts/selection";

// ─────────────────────────────────────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────────────────────────────────────

export type InteractionTrackingCallback = (
  action: Omit<TrackedAction, "id" | "timestamp">,
) => void;

export const InteractionTrackingContext =
  createContext<InteractionTrackingCallback | null>(null);

export function useInteractionTracking(): InteractionTrackingCallback | null {
  return useContext(InteractionTrackingContext);
}

// ─────────────────────────────────────────────────────────────────────────────
// Non-proactive element detection (DRY - single place for this logic)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Elements that should NOT trigger proactive AI
 * (navigation, media consumption - passive interactions)
 */
function isNonProactiveElement(target: HTMLElement): boolean {
  const tagName = target.tagName.toLowerCase();

  // Links - navigation
  if (tagName === "a" || target.closest("a[href]")) return true;

  // Media elements
  if (
    tagName === "video" ||
    tagName === "audio" ||
    tagName === "img" ||
    target.closest("video, audio, img")
  ) {
    return true;
  }

  // Media controls
  if (
    target.closest(
      '[class*="video"], [class*="audio"], [class*="player"], [class*="media"]',
    )
  ) {
    return true;
  }

  // Navigation-related
  if (
    target.getAttribute("role") === "link" ||
    target.closest('[role="link"]') ||
    target.hasAttribute("data-href") ||
    target.hasAttribute("data-navigate")
  ) {
    return true;
  }

  return false;
}

// ─────────────────────────────────────────────────────────────────────────────
// Wrapper Component (Single Responsibility - only tracks interactions)
//
// Focus tracking is now handled globally by ActionProvider
// ─────────────────────────────────────────────────────────────────────────────

export interface InteractionTrackingWrapperProps {
  children: ReactNode;
  tree: UITree;
  onInteraction: InteractionTrackingCallback;
}

export function InteractionTrackingWrapper({
  children,
  tree,
  onInteraction,
}: InteractionTrackingWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Try to use selection context if available
  let isDeepSelectionActive: (() => boolean) | undefined;
  try {
    const selectionContext = useSelection();
    isDeepSelectionActive = selectionContext.isDeepSelectionActive;
  } catch {
    // Not in a SelectionProvider - isDeepSelectionActive remains undefined
  }

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleInteraction = (event: Event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;

      // Skip selection interactions
      if (isSelectionInteraction(target, isDeepSelectionActive)) return;

      // Skip non-proactive elements
      if (isNonProactiveElement(target)) return;

      const elementKey = findClosestElementKey(target);
      if (!elementKey) return;

      const element = tree.elements[elementKey];
      if (!element) return;

      const actionType = getActionTypeFromEvent(target, event.type);
      if (!actionType) return;

      const context = extractInteractionContext(target, elementKey);

      onInteraction({
        type: actionType,
        elementKey,
        elementType: element.type,
        context,
      });
    };

    container.addEventListener("click", handleInteraction, true);
    container.addEventListener("change", handleInteraction, true);

    return () => {
      container.removeEventListener("click", handleInteraction, true);
      container.removeEventListener("change", handleInteraction, true);
    };
  }, [tree, onInteraction]);

  return (
    <InteractionTrackingContext.Provider value={onInteraction}>
      <div ref={containerRef} style={{ display: "contents" }}>
        {children}
      </div>
    </InteractionTrackingContext.Provider>
  );
}
