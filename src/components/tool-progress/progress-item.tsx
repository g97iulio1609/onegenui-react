"use client";

import React, { memo } from "react";
import type { ToolProgressEvent } from "../../contexts/tool-progress";
import { toolIcons, toolLabels } from "./icons";

interface DefaultProgressItemProps {
  progress: ToolProgressEvent;
}

export const DefaultProgressItem = memo(function DefaultProgressItem({
  progress,
}: DefaultProgressItemProps) {
  const label = toolLabels[progress.toolName] || progress.toolName;
  const icon = toolIcons[progress.toolName] || toolIcons.default;
  const isActive =
    progress.status === "starting" || progress.status === "progress";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 14px",
        borderRadius: 12,
        background: "rgba(24, 24, 27, 0.95)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(12px)",
        boxShadow: "0 4px 24px rgba(0, 0, 0, 0.3)",
        minWidth: 200,
        animation: "slideIn 0.3s ease-out",
      }}
    >
      {/* Icon with pulse indicator */}
      <div style={{ position: "relative" }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(59, 130, 246, 0.2)",
            color: "#60a5fa",
          }}
        >
          {icon}
        </div>
        {isActive && (
          <span
            style={{
              position: "absolute",
              top: -2,
              right: -2,
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#3b82f6",
              animation: "pulse 1.5s ease-in-out infinite",
            }}
          />
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "#fafafa",
            }}
          >
            {label}
          </span>
          {isActive && (
            <span style={{ display: "flex", gap: 2 }}>
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  style={{
                    width: 3,
                    height: 3,
                    borderRadius: "50%",
                    background: "rgba(96, 165, 250, 0.6)",
                    animation: `bounce 1s ease-in-out ${i * 0.15}s infinite`,
                  }}
                />
              ))}
            </span>
          )}
        </div>
        {progress.message && (
          <p
            style={{
              margin: 0,
              marginTop: 2,
              fontSize: 11,
              color: "#a1a1aa",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {progress.message}
          </p>
        )}
      </div>
    </div>
  );
});
