"use client";

import React, { useMemo, type ReactNode, type CSSProperties } from "react";
import ReactMarkdown from "react-markdown";
import { sanitizeUrl } from "@onegenui/utils";
import type { MarkdownTheme } from "./types";
import { createStyles } from "./types";
import { useCitations } from "../citation";
import { InlineCitation } from "../citation/inline-citation";

interface InternalMarkdownProps {
  content: string;
  inline: boolean;
  theme: MarkdownTheme;
  className?: string;
  style?: CSSProperties;
}

import type { Citation } from "../citation";

/**
 * Parse text content and replace [N] markers with citation components
 */
function parseCitationMarkers(
  text: string,
  getCitation: (id: string) => Citation | undefined,
): ReactNode[] {
  const parts = text.split(/(\[\d+\])/g);
  return parts.map((part, idx) => {
    const match = part.match(/\[(\d+)\]/);
    if (match) {
      const id = match[1]!;
      const citation = getCitation(id);
      return <InlineCitation key={`cite-${idx}`} id={id} citation={citation} />;
    }
    return part;
  });
}

export function InternalMarkdown({
  content,
  inline,
  theme,
  className,
  style,
}: InternalMarkdownProps) {
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { getCitation, citations } = useCitations();

  // Memoize citation parsing capability
  const hasCitations = citations.length > 0;

  const components = useMemo(
    () => ({
      // Images - responsive with high quality
      img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
        <img
          {...props}
          loading="lazy"
          style={{
            maxWidth: "100%",
            height: "auto",
            borderRadius: 8,
            marginTop: 8,
            marginBottom: 8,
            objectFit: "contain",
            backgroundColor: "rgba(0,0,0,0.1)",
          }}
        />
      ),
      // Videos - native player with controls
      video: (props: React.VideoHTMLAttributes<HTMLVideoElement>) => (
        <video
          {...props}
          controls
          preload="metadata"
          style={{
            maxWidth: "100%",
            height: "auto",
            borderRadius: 8,
            marginTop: 8,
            marginBottom: 8,
            backgroundColor: "#000",
          }}
        />
      ),
      // Code blocks
      pre: ({ children }: { children?: ReactNode }) => (
        <pre style={styles.codeBlock}>{children}</pre>
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
          return <code style={styles.inlineCode}>{children}</code>;
        }
        return <code>{children}</code>;
      },
      // Links
      a: ({ href, children }: { href?: string; children?: ReactNode }) => (
        <a
          href={sanitizeUrl(href)}
          target="_blank"
          rel="noopener noreferrer"
          style={styles.link}
        >
          {children}
        </a>
      ),
      // Lists
      ul: ({ children }: { children?: ReactNode }) => (
        <ul style={styles.list}>{children}</ul>
      ),
      ol: ({ children }: { children?: ReactNode }) => (
        <ol
          style={{
            ...styles.list,
            listStyleType: "decimal",
            paddingLeft: 24,
          }}
        >
          {children}
        </ol>
      ),
      li: ({ children }: { children?: ReactNode }) => (
        <li style={styles.listItem}>{children}</li>
      ),
      // Headings
      h1: ({ children }: { children?: ReactNode }) => (
        <h1 style={{ ...styles.headingBase, fontSize: 18 }}>{children}</h1>
      ),
      h2: ({ children }: { children?: ReactNode }) => (
        <h2 style={{ ...styles.headingBase, fontSize: 16 }}>{children}</h2>
      ),
      h3: ({ children }: { children?: ReactNode }) => (
        <h3 style={{ ...styles.headingBase, fontSize: 15 }}>{children}</h3>
      ),
      h4: ({ children }: { children?: ReactNode }) => (
        <h4 style={{ ...styles.headingBase, fontSize: 14 }}>{children}</h4>
      ),
      h5: ({ children }: { children?: ReactNode }) => (
        <h5 style={{ ...styles.headingBase, fontSize: 13 }}>{children}</h5>
      ),
      h6: ({ children }: { children?: ReactNode }) => (
        <h6 style={{ ...styles.headingBase, fontSize: 12 }}>{children}</h6>
      ),
      // Paragraphs - with citation parsing
      p: ({ children }: { children?: ReactNode }) => {
        // Parse citations in text nodes
        const processedChildren = hasCitations
          ? React.Children.map(children, (child) => {
              if (typeof child === "string") {
                return parseCitationMarkers(child, getCitation);
              }
              return child;
            })
          : children;

        return inline ? (
          <span>{processedChildren}</span>
        ) : (
          <p style={styles.paragraph}>{processedChildren}</p>
        );
      },
      // Blockquotes
      blockquote: ({ children }: { children?: ReactNode }) => (
        <blockquote style={styles.blockquote}>{children}</blockquote>
      ),
      // Horizontal rules
      hr: () => <hr style={styles.hr} />,
      // Strong/Bold - with citation parsing
      strong: ({ children }: { children?: ReactNode }) => {
        const processedChildren = hasCitations
          ? React.Children.map(children, (child) => {
              if (typeof child === "string") {
                return parseCitationMarkers(child, getCitation);
              }
              return child;
            })
          : children;
        return <strong style={{ fontWeight: 600 }}>{processedChildren}</strong>;
      },
      // Emphasis/Italic - with citation parsing
      em: ({ children }: { children?: ReactNode }) => {
        const processedChildren = hasCitations
          ? React.Children.map(children, (child) => {
              if (typeof child === "string") {
                return parseCitationMarkers(child, getCitation);
              }
              return child;
            })
          : children;
        return <em style={{ fontStyle: "italic" }}>{processedChildren}</em>;
      },
    }),
    [styles, inline, hasCitations, getCitation],
  );

  const Wrapper = inline ? "span" : "div";

  return (
    <Wrapper className={className} style={style}>
      <ReactMarkdown components={components}>{content}</ReactMarkdown>
    </Wrapper>
  );
}
