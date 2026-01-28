// ─────────────────────────────────────────────────────────────────────────────
// Deep Selection Utilities
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Cache for CSS paths to avoid recomputation
 * Uses WeakMap to automatically clean up when elements are GC'd
 */
const cssPathCache = new WeakMap<HTMLElement, Map<HTMLElement, string>>();

/**
 * Generate a unique CSS selector path for an element relative to a root
 * Memoized for performance - same element/root pair returns cached result
 */
export function getUniqueCSSPath(
  element: HTMLElement,
  root: HTMLElement,
): string {
  // Check cache first
  let elementCache = cssPathCache.get(element);
  if (elementCache) {
    const cached = elementCache.get(root);
    if (cached !== undefined) {
      return cached;
    }
  }

  // Compute path
  const parts: string[] = [];
  let current: HTMLElement | null = element;

  while (current && current !== root && current !== document.body) {
    let selector = current.tagName.toLowerCase();

    // Add nth-child for uniqueness
    const parent = current.parentElement;
    if (parent) {
      const siblings = Array.from(parent.children).filter(
        (child) => child.tagName === current!.tagName,
      );
      if (siblings.length > 1) {
        const index = siblings.indexOf(current) + 1;
        selector += `:nth-of-type(${index})`;
      }
    }

    parts.unshift(selector);
    current = current.parentElement;
  }

  const path = parts.join(" > ");

  // Store in cache
  if (!elementCache) {
    elementCache = new Map();
    cssPathCache.set(element, elementCache);
  }
  elementCache.set(root, path);

  return path;
}

/**
 * Clear CSS path cache for a specific element (call when element is re-rendered)
 */
export function clearCSSPathCache(element: HTMLElement): void {
  cssPathCache.delete(element);
}

/**
 * Helper to generate the required data attributes for a selectable item.
 * Use this in components to reduce boilerplate.
 *
 * @example
 * ```tsx
 * {items.map(item => (
 *   <div key={item.id} {...selectableItemProps(element.key, item.id)}>
 *     {item.content}
 *   </div>
 * ))}
 * ```
 */
export function selectableItemProps(
  elementKey: string,
  itemId: string,
  isSelected?: boolean,
): Record<string, string | undefined> {
  return {
    "data-selectable-item": "true",
    "data-element-key": elementKey,
    "data-item-id": itemId,
    "data-selected": isSelected ? "true" : undefined,
  };
}
