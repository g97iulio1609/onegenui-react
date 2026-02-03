"use client";

import { memo, type CSSProperties, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { cn } from "../utils";
import { sanitizeUrl } from "@onegenui/utils";

export interface MarkdownTextProps {
  content: string;
  className?: string;
  style?: CSSProperties;
  inline?: boolean;
  theme?: Partial<MarkdownTheme>;
  enableMath?: boolean;
}

export interface MarkdownTheme {
  codeBlockBg: string;
  codeBlockBorder: string;
  inlineCodeBg: string;
  linkColor: string;
  blockquoteBorder: string;
  hrColor: string;
}

const defaultTheme: MarkdownTheme = {
  codeBlockBg: "rgba(0, 0, 0, 0.3)",
  codeBlockBorder: "rgba(255, 255, 255, 0.08)",
  inlineCodeBg: "rgba(0, 0, 0, 0.25)",
  linkColor: "var(--primary, #3b82f6)",
  blockquoteBorder: "var(--primary, #3b82f6)",
  hrColor: "rgba(255, 255, 255, 0.1)",
};

export const MarkdownText = memo(function MarkdownText({
  content,
  className,
  style,
  inline = false,
  theme: themeOverrides,
  enableMath = true,
}: MarkdownTextProps) {
  const theme = { ...defaultTheme, ...themeOverrides };

  const wrapperStyle = {
    "--markdown-code-bg": theme.codeBlockBg,
    "--markdown-code-border": theme.codeBlockBorder,
    "--markdown-inline-code-bg": theme.inlineCodeBg,
    "--markdown-link-color": theme.linkColor,
    "--markdown-quote-border": theme.blockquoteBorder,
    "--markdown-hr-color": theme.hrColor,
    ...style,
  } as CSSProperties;

  const components = {
    pre: ({ children }: { children?: ReactNode }) => (
      <pre className="bg-[var(--markdown-code-bg)] rounded-lg p-3 overflow-x-auto text-[13px] font-mono border border-[var(--markdown-code-border)] my-2">
        {children}
      </pre>
    ),
    code: ({
      children,
      className: codeClassName,
    }: {
      children?: ReactNode;
      className?: string;
    }) => {
      const isInline = !codeClassName;
      if (isInline) {
        return (
          <code className="bg-[var(--markdown-inline-code-bg)] rounded px-1.5 py-0.5 text-[0.9em] font-mono">
            {children}
          </code>
        );
      }
      return <code>{children}</code>;
    },
    a: ({ href, children }: { href?: string; children?: ReactNode }) => (
      <a
        href={sanitizeUrl(href)}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[var(--markdown-link-color)] underline underline-offset-2 hover:opacity-80 transition-opacity"
      >
        {children}
      </a>
    ),
    ul: ({ children }: { children?: ReactNode }) => (
      <ul className="my-2 pl-5 list-disc">{children}</ul>
    ),
    ol: ({ children }: { children?: ReactNode }) => (
      <ol className="my-2 pl-5 list-decimal">{children}</ol>
    ),
    li: ({ children }: { children?: ReactNode }) => (
      <li className="mb-1">{children}</li>
    ),
    h1: ({ children }: { children?: ReactNode }) => (
      <h1 className="font-semibold mt-3 mb-2 text-lg">{children}</h1>
    ),
    h2: ({ children }: { children?: ReactNode }) => (
      <h2 className="font-semibold mt-3 mb-2 text-base">{children}</h2>
    ),
    h3: ({ children }: { children?: ReactNode }) => (
      <h3 className="font-semibold mt-3 mb-2 text-[15px]">{children}</h3>
    ),
    h4: ({ children }: { children?: ReactNode }) => (
      <h4 className="font-semibold mt-3 mb-2 text-sm">{children}</h4>
    ),
    h5: ({ children }: { children?: ReactNode }) => (
      <h5 className="font-semibold mt-3 mb-2 text-[13px]">{children}</h5>
    ),
    h6: ({ children }: { children?: ReactNode }) => (
      <h6 className="font-semibold mt-3 mb-2 text-xs">{children}</h6>
    ),
    p: ({ children }: { children?: ReactNode }) =>
      inline ? (
        <span>{children}</span>
      ) : (
        <p className="my-1.5 leading-relaxed">{children}</p>
      ),
    blockquote: ({ children }: { children?: ReactNode }) => (
      <blockquote className="border-l-[3px] border-[var(--markdown-quote-border)] pl-3 my-2 opacity-90 italic">
        {children}
      </blockquote>
    ),
    hr: () => (
      <hr className="border-none border-t border-[var(--markdown-hr-color)] my-3" />
    ),
    strong: ({ children }: { children?: ReactNode }) => (
      <strong className="font-semibold">{children}</strong>
    ),
    em: ({ children }: { children?: ReactNode }) => (
      <em className="italic">{children}</em>
    ),
  };

  const Wrapper = inline ? "span" : "div";

  const remarkPlugins = enableMath ? [remarkMath] : [];
  const rehypePlugins = enableMath ? [rehypeKatex] : [];

  return (
    <Wrapper className={cn("markdown-content", className)} style={wrapperStyle}>
      <ReactMarkdown
        components={components}
        remarkPlugins={remarkPlugins}
        rehypePlugins={rehypePlugins}
      >
        {content}
      </ReactMarkdown>
    </Wrapper>
  );
});

export default MarkdownText;
