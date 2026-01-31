/**
 * Renderer Types
 */

import type { ComponentType, ReactNode, CSSProperties } from "react";
import type { UIElement, UITree, Action } from "@onegenui/core";
import type { TrackedAction } from "../hooks/types";

/**
 * Props passed to component renderers
 */
export interface ComponentRenderProps<P = Record<string, unknown>> {
  /** The element being rendered */
  element: UIElement<string, P>;
  /** Rendered children */
  children?: ReactNode;
  /** Render text with markdown support (core-level) */
  renderText?: (
    content: string | null | undefined,
    options?: {
      inline?: boolean;
      className?: string;
      style?: CSSProperties;
    },
  ) => ReactNode;
  /**
   * Render editable text. When in edit mode, returns an editable span.
   * When not in edit mode, returns the text as-is (or uses renderText if markdown).
   * Use this for props that should be inline-editable.
   *
   * @param propName - The prop name (e.g., "title", "description")
   * @param value - The text value
   * @param options - Additional options (className, as tag, multiline)
   */
  renderEditableText?: (
    propName: string,
    value: string | null | undefined,
    options?: {
      className?: string;
      as?: "span" | "div" | "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
      multiline?: boolean;
      placeholder?: string;
    },
  ) => ReactNode;
  /** Execute an action */
  onAction?: (action: Action) => void;
  /** Whether the parent is loading */
  loading?: boolean;
}

/**
 * Component renderer type
 */
export type ComponentRenderer<P = Record<string, unknown>> = ComponentType<
  ComponentRenderProps<P>
>;

/**
 * Registry of component renderers
 */
export type ComponentRegistry = Record<string, ComponentRenderer<any>>;

/**
 * Props for the Renderer component
 */
export interface RendererProps {
  /** The UI tree to render */
  tree: UITree | null;
  /** Component registry */
  registry: ComponentRegistry;
  /** Whether the tree is currently loading/streaming */
  loading?: boolean;
  /** Fallback component for unknown types */
  fallback?: ComponentRenderer;
  /** Enable element selection */
  selectable?: boolean;
  /** Callback when an element is selected */
  onElementSelect?: (element: UIElement) => void;
  /** Long-press delay for selection (ms) - applies to all devices */
  selectionDelayMs?: number;
  /** Currently selected element key (for visual highlight) */
  selectedKey?: string | null;
  /** Enable automatic interaction tracking for proactive AI */
  trackInteractions?: boolean;
  /** Callback when user interacts with elements (for proactive AI) */
  onInteraction?: (action: Omit<TrackedAction, "id" | "timestamp">) => void;
  /** Callback when an element is resized (for elements with layout.resizable) */
  onResize?: (
    elementKey: string,
    size: { width: number; height: number },
  ) => void;
  /**
   * Enable automatic responsive grid layout for root children.
   * When true, root children are wrapped in a CSS grid with auto-fit columns.
   * Default: true (enabled for optimal use of screen space)
   */
  autoGrid?: boolean;
}

/**
 * Props for internal ElementRenderer component
 */
export interface ElementRendererProps {
  element: UIElement;
  tree: UITree;
  registry: ComponentRegistry;
  loading?: boolean;
  fallback?: ComponentRenderer;
  selectable?: boolean;
  onElementSelect?: (element: UIElement) => void;
  selectionDelayMs: number;
  selectedKey?: string | null;
  onResize?: (
    elementKey: string,
    size: { width: number; height: number },
  ) => void;
}

/**
 * Props for JSONUIProvider
 */
export interface JSONUIProviderProps {
  /** Component registry */
  registry: ComponentRegistry;
  /** Initial data model */
  initialData?: Record<string, unknown>;
  /** Auth state */
  authState?: { isSignedIn: boolean; user?: Record<string, unknown> };
  /** Action handlers */
  actionHandlers?: Record<
    string,
    (params: Record<string, unknown>) => Promise<unknown> | unknown
  >;
  /** Navigation function */
  navigate?: (path: string) => void;
  /** Custom validation functions */
  validationFunctions?: Record<
    string,
    (value: unknown, args?: Record<string, unknown>) => boolean
  >;
  /** Callback when data changes */
  onDataChange?: (path: string, value: unknown) => void;
  children: ReactNode;
}
