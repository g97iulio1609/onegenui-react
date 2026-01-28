"use client";

import type { SelectableItemProps } from "./types";
import { useSelection } from "./hooks";

// ─────────────────────────────────────────────────────────────────────────────
// SelectableItem Component - Core wrapper for granular selection
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Core wrapper component for making items selectable.
 *
 * This is the recommended way to implement granular selection in components.
 * It automatically handles:
 * - Selection state tracking
 * - Visual feedback (via CSS)
 * - Event delegation integration
 *
 * @example
 * ```tsx
 * import { SelectableItem } from "@onegenui/react";
 *
 * // Inside your component:
 * {items.map(item => (
 *   <SelectableItem
 *     key={item.id}
 *     elementKey={element.key}
 *     itemId={item.id}
 *     style={{ padding: 16 }}
 *   >
 *     {item.content}
 *   </SelectableItem>
 * ))}
 * ```
 */
export function SelectableItem({
  elementKey,
  itemId,
  children,
  as: Component = "div",
  className,
  style,
  ...rest
}: SelectableItemProps) {
  const { isSelected } = useSelection();
  const selected = isSelected(elementKey, itemId);

  // Filter out our known props from rest to avoid passing them to DOM
  const {
    elementKey: _ek,
    itemId: _id,
    as: _as,
    ...domProps
  } = rest as Record<string, unknown>;

  return (
    <Component
      data-selectable-item="true"
      data-element-key={elementKey}
      data-item-id={itemId}
      data-selected={selected ? "true" : undefined}
      className={className}
      style={style}
      {...domProps}
    >
      {children}
    </Component>
  );
}
