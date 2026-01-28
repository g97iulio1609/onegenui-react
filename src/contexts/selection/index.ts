// Selection Context Module
// Split for maintainability from original 822-line monolithic file

// Types
export type {
  SelectableItemData,
  SelectedItem,
  DeepSelectionInfo,
  DeepSelectionInput,
  SelectionContextValue,
  SelectionProviderProps,
  SelectableItemProps,
} from "./types";

// Context
export { SelectionContext } from "./context";

// Provider
export { SelectionProvider } from "./provider";

// Hooks
export { useSelection, useItemSelection } from "./hooks";

// Composable Hooks (for custom implementations)
export { useLongPress } from "./use-long-press";
export type {
  LongPressConfig,
  LongPressCallbacks,
  UseLongPressReturn,
} from "./use-long-press";

export { useSelectionState } from "./use-selection-state";
export type { UseSelectionStateReturn } from "./use-selection-state";

export { useDomTracking } from "./use-dom-tracking";
export type { UseDomTrackingReturn } from "./use-dom-tracking";

// Components
export { SelectableItem } from "./SelectableItem";

// Utilities
export {
  selectableItemProps,
  getUniqueCSSPath,
  clearCSSPathCache,
} from "./utils";

// Styles (for direct access if needed)
export { SELECTION_STYLE_ID, SELECTION_CSS } from "./styles";
