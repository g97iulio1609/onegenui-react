import type { ReactNode, CSSProperties } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface MarkdownTheme {
  /** Code block background color */
  codeBlockBg: string;
  /** Code block border color */
  codeBlockBorder: string;
  /** Inline code background color */
  inlineCodeBg: string;
  /** Link color */
  linkColor: string;
  /** Blockquote border color */
  blockquoteBorder: string;
  /** Horizontal rule color */
  hrColor: string;
}

export interface MarkdownContextValue {
  /** Whether markdown rendering is enabled globally */
  enabled: boolean;
  /** The theme for markdown rendering */
  theme: MarkdownTheme;
  /** Render text with markdown support */
  renderText: (
    content: string | null | undefined,
    options?: RenderTextOptions,
  ) => ReactNode;
}

export interface RenderTextOptions {
  /** Whether to render inline (no block elements like paragraphs) */
  inline?: boolean;
  /** Additional className */
  className?: string;
  /** Additional style */
  style?: CSSProperties;
}

export interface MarkdownProviderProps {
  children: ReactNode;
  /** Whether markdown rendering is enabled (default: true) */
  enabled?: boolean;
  /** Custom theme overrides */
  theme?: Partial<MarkdownTheme>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Default Theme
// ─────────────────────────────────────────────────────────────────────────────

export const defaultTheme: MarkdownTheme = {
  codeBlockBg: "rgba(0, 0, 0, 0.3)",
  codeBlockBorder: "rgba(255, 255, 255, 0.08)",
  inlineCodeBg: "rgba(0, 0, 0, 0.25)",
  linkColor: "var(--primary, #3b82f6)",
  blockquoteBorder: "var(--primary, #3b82f6)",
  hrColor: "rgba(255, 255, 255, 0.1)",
};

// ─────────────────────────────────────────────────────────────────────────────
// Styles Factory
// ─────────────────────────────────────────────────────────────────────────────

export const createStyles = (theme: MarkdownTheme) => ({
  codeBlock: {
    backgroundColor: theme.codeBlockBg,
    borderRadius: 8,
    padding: "12px 16px",
    overflowX: "auto" as const,
    fontSize: 13,
    fontFamily:
      "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
    border: `1px solid ${theme.codeBlockBorder}`,
    margin: "8px 0",
  },
  inlineCode: {
    backgroundColor: theme.inlineCodeBg,
    borderRadius: 4,
    padding: "2px 6px",
    fontSize: "0.9em",
    fontFamily:
      "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  },
  link: {
    color: theme.linkColor,
    textDecoration: "underline" as const,
    textUnderlineOffset: 2,
  },
  list: {
    margin: "8px 0",
    paddingLeft: 20,
    listStylePosition: "outside" as const,
  },
  listItem: {
    marginBottom: 4,
  },
  headingBase: {
    fontWeight: 600,
    marginTop: 12,
    marginBottom: 8,
  },
  paragraph: {
    margin: "6px 0",
    lineHeight: 1.6,
  },
  blockquote: {
    borderLeft: `3px solid ${theme.blockquoteBorder}`,
    paddingLeft: 12,
    margin: "8px 0",
    opacity: 0.9,
    fontStyle: "italic" as const,
  },
  hr: {
    border: "none",
    borderTop: `1px solid ${theme.hrColor}`,
    margin: "12px 0",
  },
});
