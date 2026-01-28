/**
 * Renderer Module
 *
 * Modular components for the UITree renderer.
 */

// Types
export type {
  ComponentRenderProps,
  ComponentRenderer,
  ComponentRegistry,
  RendererProps,
  ElementRendererProps,
  JSONUIProviderProps,
} from "./types";

// Utilities
export { elementRendererPropsAreEqual } from "./memo-utils";

// Skeleton components
export {
  PlaceholderSkeleton,
  ChildSkeleton,
  isPlaceholderElement,
  type SkeletonProps,
} from "./skeleton-loader";

// Element Renderer
export { ElementRenderer } from "./element-renderer";

// Provider
export { JSONUIProvider } from "./provider";
