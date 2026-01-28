"use client";

import { memo, useState, useRef, useEffect, useCallback } from "react";
import type { Citation } from "./index";

interface InlineCitationProps {
  id: string;
  citation?: Citation;
}

/**
 * Inline citation badge with popover for showing source details
 */
export const InlineCitation = memo(function InlineCitation({
  id,
  citation,
}: InlineCitationProps) {
  const [showPopover, setShowPopover] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState<"top" | "bottom">(
    "bottom",
  );
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Calculate popover position based on viewport
  const updatePosition = useCallback(() => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    setPopoverPosition(spaceBelow < 200 ? "top" : "bottom");
  }, []);

  // Close on outside click
  useEffect(() => {
    if (!showPopover) return;
    const handleClick = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setShowPopover(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [showPopover]);

  if (!citation) {
    // No citation data - render plain marker
    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          minWidth: 16,
          height: 16,
          padding: "0 4px",
          fontSize: 10,
          fontWeight: 500,
          backgroundColor: "rgba(59, 130, 246, 0.2)",
          color: "rgb(59, 130, 246)",
          borderRadius: 4,
          marginLeft: 2,
        }}
      >
        {id}
      </span>
    );
  }

  const isWebSource = !!citation.url;
  const hasExcerpt = !!(citation.excerpt || citation.snippet);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isWebSource && !hasExcerpt) {
      // Web source without excerpt - open URL
      window.open(citation.url!, "_blank", "noopener,noreferrer");
    } else {
      // Document source or has excerpt - show popover
      updatePosition();
      setShowPopover(!showPopover);
    }
  };

  return (
    <span style={{ position: "relative", display: "inline-block" }}>
      <button
        ref={buttonRef}
        onClick={handleClick}
        title={citation.title}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          minWidth: 16,
          height: 16,
          padding: "0 4px",
          fontSize: 10,
          fontWeight: 500,
          backgroundColor: "rgba(59, 130, 246, 0.2)",
          color: "rgb(59, 130, 246)",
          borderRadius: 4,
          marginLeft: 2,
          cursor: "pointer",
          border: "none",
          transition: "background-color 0.15s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "rgba(59, 130, 246, 0.3)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "rgba(59, 130, 246, 0.2)";
        }}
      >
        {id}
      </button>

      {showPopover && hasExcerpt && (
        <div
          ref={popoverRef}
          style={{
            position: "absolute",
            zIndex: 50,
            width: 288,
            maxWidth: "90vw",
            padding: 12,
            borderRadius: 8,
            border: "1px solid rgba(255, 255, 255, 0.1)",
            backgroundColor: "rgba(24, 24, 27, 0.95)",
            backdropFilter: "blur(8px)",
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.3)",
            ...(popoverPosition === "top"
              ? { bottom: "100%", marginBottom: 8 }
              : { top: "100%", marginTop: 8 }),
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 8,
              paddingBottom: 8,
              borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
            }}
          >
            {citation.pageNumber && (
              <span
                style={{
                  fontSize: 10,
                  padding: "2px 6px",
                  borderRadius: 4,
                  backgroundColor: "rgba(59, 130, 246, 0.2)",
                  color: "rgb(59, 130, 246)",
                  flexShrink: 0,
                }}
              >
                p. {citation.pageNumber}
              </span>
            )}
            <span
              style={{
                fontSize: 12,
                fontWeight: 500,
                color: "rgba(255, 255, 255, 0.8)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {citation.title}
            </span>
          </div>

          {/* Excerpt */}
          <p
            style={{
              fontSize: 12,
              color: "rgba(255, 255, 255, 0.7)",
              lineHeight: 1.5,
              fontStyle: "italic",
              margin: 0,
            }}
          >
            "{citation.excerpt || citation.snippet}"
          </p>

          {/* Footer for web sources */}
          {isWebSource && (
            <a
              href={citation.url!}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                marginTop: 8,
                paddingTop: 8,
                borderTop: "1px solid rgba(255, 255, 255, 0.05)",
                fontSize: 10,
                color: "rgb(59, 130, 246)",
                textDecoration: "none",
              }}
            >
              {citation.domain || "Open source"} →
            </a>
          )}
        </div>
      )}
    </span>
  );
});
