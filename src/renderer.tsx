"use client";

import type { ComponentType } from "react";
import type { Catalog, ComponentDefinition } from "@onegenui/core";
import { InteractionTrackingWrapper } from "./components/InteractionTrackingWrapper";
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
 * Main renderer component
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
}: RendererProps) {
  if (!tree || !tree.root) return null;

  const rootElement = tree.elements[tree.root];
  if (!rootElement) return null;

  const content = (
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
