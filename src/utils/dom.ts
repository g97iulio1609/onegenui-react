/**
 * DOM utility functions for interaction detection
 * Used to properly handle priority between interactive elements and selection
 *
 * ARCHITECTURE:
 * - Interactive elements (buttons, inputs, links) have PRIORITY over selection
 * - When user clicks on interactive element, native behavior happens, selection SKIPPED
 * - This is implemented at CORE level, not per-component
 *
 * KISS/DRY/SOLID:
 * - Single source of truth for what's "interactive"
 * - Extensible via data-* attributes for custom components
 * - No component-specific logic needed
 */

// ─────────────────────────────────────────────────────────────────────────────
// Interactive Elements Detection
// ─────────────────────────────────────────────────────────────────────────────

/**
 * List of natively interactive HTML elements
 * These always take priority over selection
 */
const NATIVE_INTERACTIVE_TAGS = new Set([
  "input",
  "button",
  "select",
  "textarea",
  "a",
  "label",
  "details",
  "summary",
  "dialog",
  "menu",
  "optgroup",
  "option",
  "datalist",
  "fieldset",
  "legend",
  "progress",
  "meter",
  "output",
]);

/**
 * ARIA roles that indicate interactive behavior
 */
const INTERACTIVE_ARIA_ROLES = new Set([
  "button",
  "checkbox",
  "radio",
  "switch",
  "link",
  "menuitem",
  "menuitemcheckbox",
  "menuitemradio",
  "option",
  "tab",
  "slider",
  "spinbutton",
  "combobox",
  "listbox",
  "searchbox",
  "textbox",
  "scrollbar",
  "grid",
  "gridcell",
  "row",
  "rowheader",
  "columnheader",
  "tree",
  "treeitem",
  "treegrid",
  "tabpanel",
  "toolbar",
  "tooltip",
  "progressbar",
  "alertdialog",
]);

/**
 * CSS selector for all known interactive elements
 * Used for parent lookup optimization
 */
const INTERACTIVE_SELECTOR = [
  // Native elements
  "button",
  "input",
  "select",
  "textarea",
  "a[href]",
  "label",
  "details",
  "summary",
  // ARIA roles (most common)
  "[role='button']",
  "[role='checkbox']",
  "[role='radio']",
  "[role='switch']",
  "[role='link']",
  "[role='tab']",
  "[role='slider']",
  "[role='combobox']",
  "[role='listbox']",
  "[role='textbox']",
  "[role='menuitem']",
  "[role='option']",
  // Custom markers
  "[data-interactive]",
  "[data-interactive-wrapper]",
  "[data-checkbox]",
  "[data-no-select]",
  // Elements that look interactive
  "[contenteditable='true']",
  "[tabindex]:not([tabindex='-1'])",
  // Clickable elements
  "[onclick]",
  "[draggable='true']",
].join(", ");

/**
 * Determines if an element is interactive (button, checkbox, input, link, etc.)
 * Used to give priority to interactive elements over selection.
 *
 * When a user clicks on an interactive element inside a selectable item,
 * the native interaction should happen WITHOUT triggering selection.
 *
 * @param target - The element to check
 * @returns true if the element or any ancestor is interactive
 */
export function isInteractiveElement(target: HTMLElement): boolean {
  // Fast path: check tag
  const tagName = target.tagName.toLowerCase();
  if (NATIVE_INTERACTIVE_TAGS.has(tagName)) {
    return true;
  }

  // Check ARIA role
  const role = target.getAttribute("role")?.toLowerCase();
  if (role && INTERACTIVE_ARIA_ROLES.has(role)) {
    return true;
  }

  // Check if contenteditable
  if (target.isContentEditable) {
    return true;
  }

  // Check custom data attributes
  if (
    target.hasAttribute("data-interactive") ||
    target.hasAttribute("data-interactive-wrapper") ||
    target.hasAttribute("data-checkbox") ||
    target.hasAttribute("data-no-select")
  ) {
    return true;
  }

  // Check if element has explicit click handler (React synthetic events don't show in DOM)
  if (target.hasAttribute("onclick")) {
    return true;
  }

  // Check for draggable elements
  if (target.getAttribute("draggable") === "true") {
    return true;
  }

  // Check for focusable elements with positive tabindex
  const tabindex = target.getAttribute("tabindex");
  if (tabindex !== null && tabindex !== "-1") {
    // Only consider it interactive if it looks like a control
    const computedStyle = window.getComputedStyle(target);
    if (computedStyle.cursor === "pointer") {
      return true;
    }
  }

  // Check if inside an interactive parent (for nested elements like icon inside button)
  // This is crucial for icon buttons and complex interactive components
  const interactiveParent = target.closest(INTERACTIVE_SELECTOR);

  return interactiveParent !== null;
}

/**
 * Quick check if element should never trigger selection
 * Used for elements like resize handles, scrollbars, etc.
 */
export function shouldNeverSelect(target: HTMLElement): boolean {
  // Resize handles
  if (
    target.hasAttribute("data-resize-handle") ||
    target.closest("[data-resize-handle]")
  ) {
    return true;
  }

  // Scrollbars and similar
  if (
    target.hasAttribute("data-no-select") ||
    target.closest("[data-no-select]")
  ) {
    return true;
  }

  // Canvas and SVG interactions
  if (target.tagName === "CANVAS" || target.closest("canvas")) {
    return true;
  }

  return false;
}

// ─────────────────────────────────────────────────────────────────────────────
// Selection Interaction Detection
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Determines if a click/interaction is related to selection UI (not a business action).
 * Selection interactions should NOT trigger proactive AI.
 *
 * Business actions (toggle, input, submit) → Track for proactive AI
 * Selection actions (select item, deselect) → Do NOT track
 *
 * IMPORTANT: Interactive elements inside selectable-items are BUSINESS ACTIONS.
 * Example: clicking a checkbox inside a todo item is a "toggle" action, not selection.
 *
 * @param target - The clicked element
 * @param isDeepSelectionActive - Optional callback to check if deep selection is active (from context)
 */
export function isSelectionInteraction(
  target: HTMLElement,
  isDeepSelectionActive?: () => boolean,
): boolean {
  // Skip if deep selection just activated (check via callback if provided)
  if (isDeepSelectionActive?.()) {
    return true;
  }

  // CRITICAL: Interactive elements are NEVER selection interactions
  // Even if they're inside a selectable-item, the user is performing a business action
  // (e.g., toggling a checkbox, typing in an input, clicking a button)
  if (isInteractiveElement(target)) {
    return false;
  }

  // Skip if clicking on selectable items (selection/deselection actions)
  // This only applies to clicks on NON-interactive parts of the item
  if (target.closest("[data-selectable-item]")) {
    return true;
  }

  // Skip if clicking on already selected elements (deselection)
  if (target.closest(".jsonui-deep-selected, .jsonui-item-selected")) {
    return true;
  }

  // Skip if clicking on selection-related UI (selection toolbar, etc.)
  if (target.closest("[data-selection-ui]")) {
    return true;
  }

  return false;
}

// ─────────────────────────────────────────────────────────────────────────────
// Utility Exports
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get the interactive element that was clicked (if any)
 * Useful for determining what type of interaction occurred
 */
export function getInteractiveElement(target: HTMLElement): HTMLElement | null {
  if (isInteractiveElement(target)) {
    // Return the actual interactive element (might be parent)
    return target.closest(INTERACTIVE_SELECTOR) as HTMLElement | null;
  }
  return null;
}
