"use client";

import React, {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import { InternalMarkdown } from "./internal-markdown";
import type {
  MarkdownTheme,
  MarkdownContextValue,
  MarkdownProviderProps,
  RenderTextOptions,
} from "./types";
import { defaultTheme } from "./types";

const MarkdownContext = createContext<MarkdownContextValue | null>(null);

/**
 * Provider for global markdown rendering configuration.
 *
 * Wrap your app with this provider to enable markdown rendering in all components.
 * Components can use `useRenderText()` to render text with markdown support.
 *
 * @example
 * ```tsx
 * <MarkdownProvider>
 *   <App />
 * </MarkdownProvider>
 * ```
 */
export function MarkdownProvider({
  children,
  enabled = true,
  theme: themeOverrides,
}: MarkdownProviderProps) {
  const theme = useMemo(
    () => ({ ...defaultTheme, ...themeOverrides }),
    [themeOverrides],
  );

  const renderText = useMemo(() => {
    return (
      content: string | null | undefined,
      options: RenderTextOptions = {},
    ): ReactNode => {
      // If no content, return null
      if (!content) return null;

      // If markdown is disabled, return plain text
      if (!enabled) {
        if (options.inline) {
          return (
            <span className={options.className} style={options.style}>
              {content}
            </span>
          );
        }
        return (
          <div className={options.className} style={options.style}>
            {content}
          </div>
        );
      }

      // Render with markdown
      return (
        <InternalMarkdown
          content={content}
          inline={options.inline ?? false}
          theme={theme}
          className={options.className}
          style={options.style}
        />
      );
    };
  }, [enabled, theme]);

  const value = useMemo<MarkdownContextValue>(
    () => ({
      enabled,
      theme,
      renderText,
    }),
    [enabled, theme, renderText],
  );

  return (
    <MarkdownContext.Provider value={value}>
      {children}
    </MarkdownContext.Provider>
  );
}

// Stable fallback value - created once and reused to avoid hooks order issues
const fallbackRenderText = (
  content: string | null | undefined,
  options: RenderTextOptions = {},
) => {
  if (!content) return null;
  if (options.inline) {
    return (
      <span className={options.className} style={options.style}>
        {content}
      </span>
    );
  }
  return (
    <div className={options.className} style={options.style}>
      {content}
    </div>
  );
};

const fallbackContextValue: MarkdownContextValue = {
  enabled: false,
  theme: defaultTheme,
  renderText: fallbackRenderText,
};

/**
 * Hook to access the markdown rendering context.
 *
 * Returns `renderText` function that automatically applies markdown formatting.
 * If no provider is found, returns a fallback that renders plain text.
 *
 * @example
 * ```tsx
 * function MyComponent({ description }: { description: string }) {
 *   const { renderText } = useMarkdown();
 *   return <div>{renderText(description)}</div>;
 * }
 * ```
 */
export function useMarkdown(): MarkdownContextValue {
  const context = useContext(MarkdownContext);
  // Return stable fallback if no provider - avoids hooks order issues
  return context ?? fallbackContextValue;
}

/**
 * Convenience hook that returns just the renderText function.
 *
 * @example
 * ```tsx
 * function MyComponent({ description }: { description: string }) {
 *   const renderText = useRenderText();
 *   return <div>{renderText(description)}</div>;
 * }
 * ```
 */
export function useRenderText() {
  const { renderText } = useMarkdown();
  return renderText;
}
