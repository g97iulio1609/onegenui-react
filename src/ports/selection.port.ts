/**
 * Selection System Ports - Hexagonal Architecture
 * Defines interfaces for selection management abstraction
 */

import type {
  SelectableItemData,
  SelectedItem,
} from "../contexts/selection/types";

// ─────────────────────────────────────────────────────────────────────────────
// Deep Selection Types (shared between ports and adapters)
// ─────────────────────────────────────────────────────────────────────────────

export interface DeepSelectionData {
  id: string;
  elementKey: string;
  cssPath: string;
  tagName: string;
  textContent: string;
  itemId?: string;
  selectionType: "item" | "granular";
}

export interface AddDeepSelectionInput {
  elementKey: string;
  cssPath: string;
  tagName: string;
  textContent: string;
  itemId?: string;
  selectionType: "item" | "granular";
}

// ─────────────────────────────────────────────────────────────────────────────
// SelectionManagerPort - Main selection operations
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Port for managing selection state
 * Abstracts the selection storage and operations
 */
export interface SelectionManagerPort {
  // ─────────────────────────────────────────────────────────────────────────
  // Deep selection (sub-element level)
  // ─────────────────────────────────────────────────────────────────────────
  addDeepSelection(selection: AddDeepSelectionInput): string;
  removeDeepSelection(id: string): void;
  removeDeepSelectionByElement(elementKey: string, cssPath: string): void;
  clearDeepSelections(): void;
  clearDeepSelectionsForElement(elementKey: string): void;

  getDeepSelections(): DeepSelectionData[];
  getDeepSelectionsForElement(elementKey: string): DeepSelectionData[];
  isDeepSelected(elementKey: string, cssPath: string): boolean;

  // ─────────────────────────────────────────────────────────────────────────
  // Deep selection mode
  // ─────────────────────────────────────────────────────────────────────────
  isDeepSelectionActive(): boolean;
  setDeepSelectionActive(active: boolean): void;

  // ─────────────────────────────────────────────────────────────────────────
  // Component level selection (single element focus)
  // ─────────────────────────────────────────────────────────────────────────
  getSelectedKey(): string | null;
  setSelectedKey(key: string | null): void;

  // ─────────────────────────────────────────────────────────────────────────
  // Subscriptions
  // ─────────────────────────────────────────────────────────────────────────
  subscribe(callback: (selections: DeepSelectionData[]) => void): () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// DOMSelectorPort - DOM element tracking
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Port for DOM element tracking
 * Abstracts DOM queries and element management
 */
export interface DOMSelectorPort {
  // Element registration
  registerElement(elementKey: string, element: HTMLElement): void;
  unregisterElement(elementKey: string): void;

  // Element queries
  getElement(elementKey: string): HTMLElement | null;
  getSelectableItems(elementKey: string): SelectableItemData[];

  // CSS path generation
  getCSSPath(element: HTMLElement, root?: HTMLElement): string;
  getCSSPathCached(element: HTMLElement, root?: HTMLElement): string;

  // Cleanup
  cleanup(): void;
}

// ─────────────────────────────────────────────────────────────────────────────
// SelectionEventPort - Event handling
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Port for selection event handling
 * Abstracts event subscription and delegation
 */
export interface SelectionEventPort {
  // Event handlers
  onItemClick(
    handler: (item: SelectableItemData, event: MouseEvent) => void,
  ): () => void;
  onItemHover(handler: (item: SelectableItemData | null) => void): () => void;
  onKeyDown(handler: (event: KeyboardEvent) => void): () => void;

  // Long press
  onLongPress(handler: (item: SelectableItemData) => void): () => void;

  // Deep selection mode
  enterDeepSelectionMode(): void;
  exitDeepSelectionMode(): void;
  isDeepSelectionActive(): boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// SelectionExportPort - Export for AI context
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Port for selection export/serialization
 * Abstracts how selection data is exported for AI context
 */
export interface SelectionExportPort {
  // Export deep selections for AI context
  exportForAI(selections: DeepSelectionData[]): {
    summary: string;
    selections: Array<{
      type: string;
      elementKey: string;
      cssPath: string;
      textContent: string;
      itemId?: string;
    }>;
  };

  // Export as text for clipboard
  exportAsText(selections: DeepSelectionData[]): string;

  // Export as JSON
  exportAsJSON(selections: DeepSelectionData[]): string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Combined Port
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Combined selection port for full functionality
 */
export interface SelectionPort
  extends
    SelectionManagerPort,
    DOMSelectorPort,
    SelectionEventPort,
    SelectionExportPort {}
