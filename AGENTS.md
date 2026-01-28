# AGENTS.md - @onegenui/react

React renderer and hooks for OneGenUI. Transforms JSON into React components with streaming support.

## Purpose

This package provides:
- **Renderer**: Converts UIElement trees to React components
- **Hooks**: `useUIStream`, `useResizable`, and streaming utilities
- **Contexts**: Selection, markdown rendering, data management
- **Components**: SelectableItem, ToolProgressOverlay, editable elements

## File Structure

```
src/
├── index.ts              # Public exports
├── renderer.tsx          # Core JSON-to-React renderer
├── editable.tsx          # Editable element wrappers
├── utils.ts              # Utility functions
├── hooks/
│   ├── useUIStream.ts    # Main streaming hook (NEEDS REFACTORING)
│   ├── useResizable.ts   # Resizable panel logic
│   └── patch-utils.ts    # Patch application utilities
├── contexts/
│   ├── selection/        # Selection state management
│   │   ├── provider.tsx  # Selection provider (NEEDS REFACTORING)
│   │   ├── context.ts
│   │   ├── types.ts
│   │   └── hooks.ts
│   └── markdown.tsx      # Markdown rendering context
├── components/
│   ├── SelectableItem.tsx
│   └── ToolProgressOverlay.tsx
└── utils/
```

## Key Exports

```typescript
// Main renderer
export { UIRenderer } from './renderer';

// Streaming hook
export { useUIStream } from './hooks/useUIStream';

// Selection
export { SelectionProvider, useSelection } from './contexts/selection';

// Components
export { SelectableItem } from './components/SelectableItem';
export type { ComponentRenderProps } from './types';
```

## Development Guidelines

- All components must use `memo()` wrapper
- Use granular state subscriptions to avoid re-render cascades
- Streaming must support abort/cancel operations
- Selection supports single/multi-select with long-press detection

## Refactoring Priorities (from toBeta.md)

| File | LOC | Priority | Action |
|------|-----|----------|--------|
| `useUIStream.ts` | 897 | P0 | Split into streaming/, 6 files ~150 LOC each |
| `selection/provider.tsx` | 601 | P0 | Extract utils, long-press, DOM tracking |
| `patch-utils.ts` | 485 | P0 | Extract pure functions |
| `renderer.tsx` | 454 | P0 | Split rendering logic |
| `useResizable.ts` | 510 | P1 | Extract constraints and persistence |

### Target Structure for useUIStream

```
hooks/streaming/
├── index.ts                    # Public API (useUIStream)
├── types.ts                    # StreamingState, StreamConfig
├── use-streaming-connection.ts # SSE connection
├── use-stream-parser.ts        # Parse SSE lines
├── use-patch-buffer.ts         # Batching logic
├── use-tree-state.ts           # Tree management
├── use-stream-history.ts       # History/undo
└── stream-utils.ts             # Pure parsing functions
```

## Testing

```bash
pnpm --filter @onegenui/react test
pnpm --filter @onegenui/react type-check
```

## Dependencies

- `@onegenui/core` (workspace)
- `ai` ^6.0.39 (Vercel AI SDK)
- `react-markdown`, `rehype-katex`, `remark-math` (markdown rendering)
- React ^19.0.0 (peer)
