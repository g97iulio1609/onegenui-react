"use client";

import type { ComponentType, ReactNode } from "react";
import type { Catalog, ComponentDefinition } from "@onegenui/core";
import { InteractionTrackingWrapper } from "./components/InteractionTrackingWrapper";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { DEFAULT_SELECTION_DELAY } from "./utils/selection";
import type {
  ComponentRenderProps,
  ComponentRenderer,
  ComponentRegistry,
  RendererProps,
  JSONUIProviderProps,
} from "./renderer/types";
import { ElementRenderer } from "./renderer/element-renderer";
import { JSONUIProvider } from "./renderer/provider";

// Re-export types for convenience
export type {
  ComponentRenderProps,
  ComponentRenderer,
  ComponentRegistry,
  RendererProps,
  JSONUIProviderProps,
};
export { JSONUIProvider };

/**
 * Default renderer error fallback
 */
function RendererErrorFallback(error: Error, reset: () => void): ReactNode {
  return (
    <div
      role="alert"
      className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive"
    >
      <h3 className="font-semibold mb-2">Render Error</h3>
      <p className="text-sm text-muted-foreground mb-3">{error.message}</p>
      <button
        onClick={reset}
        className="px-3 py-1.5 text-sm rounded bg-destructive/20 hover:bg-destructive/30 transition-colors"
      >
        Retry
      </button>
    </div>
  );
}

/**
 * Main renderer component with error boundary
 */
export function Renderer({
  tree,
  registry,
  loading,
  fallback,
  selectable = false,
  onElementSelect,
  selectionDelayMs = DEFAULT_SELECTION_DELAY,
  selectedKey,
  trackInteractions = false,
  onInteraction,
  onResize,
  autoGrid = true,
  onError,
}: RendererProps & { onError?: (error: Error) => void }) {
  if (!tree || !tree.root) return null;

  const rootElement = tree.elements[tree.root];
  if (!rootElement) return null;

  const content = (
    <ErrorBoundary
      name="ElementRenderer"
      fallback={RendererErrorFallback}
      onError={(error) => onError?.(error)}
    >
      <ElementRenderer
        element={rootElement}
        tree={tree}
        registry={registry}
        loading={loading}
        fallback={fallback}
        selectable={selectable}
        onElementSelect={onElementSelect}
        selectionDelayMs={selectionDelayMs}
        selectedKey={selectedKey}
        onResize={onResize}
      />
    </ErrorBoundary>
  );

  const gridContent = autoGrid ? (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(min(400px, 100%), 1fr))",
        gap: 24,
        width: "100%",
        alignItems: "stretch",
      }}
      data-renderer-auto-grid
    >
      {content}
    </div>
  ) : (
    content
  );

  if (trackInteractions && onInteraction) {
    return (
      <InteractionTrackingWrapper tree={tree} onInteraction={onInteraction}>
        {gridContent}
      </InteractionTrackingWrapper>
    );
  }

  return gridContent;
}

/**
 * Helper to create a renderer component from a catalog
 */
export function createRendererFromCatalog<
  C extends Catalog<Record<string, ComponentDefinition>>,
>(
  _catalog: C,
  registry: ComponentRegistry,
): ComponentType<Omit<RendererProps, "registry">> {
  return function CatalogRenderer(props: Omit<RendererProps, "registry">) {
    return <Renderer {...props} registry={registry} />;
  };
}
