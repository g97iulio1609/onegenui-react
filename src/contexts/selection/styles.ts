// ─────────────────────────────────────────────────────────────────────────────
// Selection CSS Styles
// ─────────────────────────────────────────────────────────────────────────────

export const SELECTION_STYLE_ID = "jsonui-selection-styles";

export const SELECTION_CSS = `
@keyframes selection-shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

@keyframes selection-pulse {
  0%, 100% {
    box-shadow: inset 0 0 0 2px var(--primary, #3b82f6), 0 0 0 0 rgba(59, 130, 246, 0.4);
  }
  50% {
    box-shadow: inset 0 0 0 2px var(--primary, #3b82f6), 0 0 12px 2px rgba(59, 130, 246, 0.2);
  }
}

/* ─────────────────────────────────────────────────────────────────────────────
   TEXT SELECTION: Enable native text selection for copy/paste
   ───────────────────────────────────────────────────────────────────────────── */

/* Enable text selection on all JSON-UI components by default */
[data-jsonui-element-key] {
  user-select: text;
  -webkit-user-select: text;
}

/* Prevent text selection from being cleared when clicking in chat sidebar */
[data-chat-sidebar] {
  user-select: none;
  -webkit-user-select: none;
}

/* But allow selection in chat input fields */
[data-chat-sidebar] input,
[data-chat-sidebar] textarea {
  user-select: text;
  -webkit-user-select: text;
}

/* Disable text selection on interactive elements to prevent accidental selection */
[data-interactive],
[data-jsonui-element-key] button,
[data-jsonui-element-key] [role="button"],
[data-jsonui-element-key] input,
[data-jsonui-element-key] select,
[data-jsonui-element-key] textarea,
[data-jsonui-element-key] label,
[data-jsonui-element-key] [draggable="true"] {
  user-select: none;
  -webkit-user-select: none;
}

/* But allow selection on text content within labels */
[data-jsonui-element-key] label span,
[data-jsonui-element-key] label p {
  user-select: text;
  -webkit-user-select: text;
}

/* ─────────────────────────────────────────────────────────────────────────────
   ITEM SELECTION: Click on data-selectable-item elements
   ───────────────────────────────────────────────────────────────────────────── */

[data-selectable-item] {
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 8px;
  position: relative;
}

[data-selectable-item]:hover:not([data-selected="true"]):not(.jsonui-item-selected) {
  background-color: rgba(255, 255, 255, 0.03);
  transform: translateY(-1px);
}

/* Data attribute based selection */
[data-selectable-item][data-selected="true"] {
  background: linear-gradient(
    110deg,
    #8b5cf6 0%,
    rgba(139, 92, 246, 0.15) 20%,
    rgba(196, 181, 253, 0.25) 40%,
    rgba(139, 92, 246, 0.15) 60%,
    #8b5cf6 100%
  ) !important;
  background-size: 200% 100% !important;
  animation: selection-shimmer 2.5s ease-in-out infinite !important;
  box-shadow: 
    inset 0 0 0 2px #8b5cf6,
    0 0 16px 4px rgba(139, 92, 246, 0.5),
    0 0 4px 1px rgba(139, 92, 246, 0.8) !important;
  z-index: 10 !important;
}

[data-selectable-item][data-selected="true"]::before {
  content: "";
  position: absolute;
  inset: 2px;
  background: #1a1a2e;
  border-radius: 6px;
  z-index: 0;
  opacity: 0.95;
}

[data-selectable-item][data-selected="true"] > * {
  position: relative;
  z-index: 1;
}

/* ─────────────────────────────────────────────────────────────────────────────
   DEEP/GRANULAR SELECTION: Long-press on any element - BLUE shimmer
   ───────────────────────────────────────────────────────────────────────────── */

.jsonui-deep-selected {
  position: relative !important;
  border-radius: 8px !important;
  z-index: 50 !important;
  padding: 4px 8px !important;
  margin: -4px -8px !important;
  /* Shimmer background - blue for granular */
  background: linear-gradient(
    110deg,
    #3b82f6 0%,
    rgba(59, 130, 246, 0.15) 20%,
    rgba(147, 197, 253, 0.25) 40%,
    rgba(59, 130, 246, 0.15) 60%,
    #3b82f6 100%
  ) !important;
  background-size: 200% 100% !important;
  animation: selection-shimmer 2.5s ease-in-out infinite !important;
  /* Bold inner border + outer glow */
  box-shadow: 
    inset 0 0 0 2px #3b82f6,
    0 0 20px 4px rgba(59, 130, 246, 0.6),
    0 0 6px 2px rgba(59, 130, 246, 0.8) !important;
  /* Ensure text stays visible */
  color: #fff !important;
}

/* Inner content layer for deep selection */
.jsonui-deep-selected::before {
  content: "" !important;
  position: absolute !important;
  inset: 2px !important;
  background: #0f172a !important;
  border-radius: 6px !important;
  z-index: 0 !important;
  opacity: 0.92 !important;
}

/* Text inside deep selection stays visible */
.jsonui-deep-selected > * {
  position: relative !important;
  z-index: 1 !important;
}

/* Item Selection via click - PURPLE shimmer (overrides deep-selected blue) */
.jsonui-item-selected {
  background: linear-gradient(
    110deg,
    #8b5cf6 0%,
    rgba(139, 92, 246, 0.15) 20%,
    rgba(196, 181, 253, 0.25) 40%,
    rgba(139, 92, 246, 0.15) 60%,
    #8b5cf6 100%
  ) !important;
  box-shadow: 
    inset 0 0 0 2px #8b5cf6,
    0 0 20px 4px rgba(139, 92, 246, 0.6),
    0 0 6px 2px rgba(139, 92, 246, 0.8) !important;
}

.jsonui-item-selected::before {
  background: #1a1a2e !important;
}

@keyframes selection-pulse {
  0%, 100% {
    filter: brightness(1);
  }
  50% {
    filter: brightness(1.15);
  }
}
`;
