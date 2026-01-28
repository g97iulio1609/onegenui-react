"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

// Constants
export const RING_SIZE = 48;
const STROKE_WIDTH = 3;
const RADIUS = (RING_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export interface LongPressIndicatorProps {
  x: number;
  y: number;
  durationMs: number;
  onComplete: () => void;
}

export function LongPressIndicator({
  x,
  y,
  durationMs,
  onComplete,
}: LongPressIndicatorProps) {
  const [mounted, setMounted] = useState(false);
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);
  const circleRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    setMounted(true);
    startTimeRef.current = performance.now();

    const animate = () => {
      const elapsed = performance.now() - startTimeRef.current;
      const progress = Math.min(elapsed / durationMs, 1);

      if (circleRef.current) {
        const offset = CIRCUMFERENCE * (1 - progress);
        circleRef.current.style.strokeDashoffset = `${offset}`;
      }

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    timerRef.current = window.setTimeout(() => {
      onComplete();
    }, durationMs);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (animationFrameRef.current)
        cancelAnimationFrame(animationFrameRef.current);
    };
  }, [durationMs, onComplete]);

  if (!mounted || typeof document === "undefined") return null;

  return createPortal(
    <div
      style={{
        position: "fixed",
        left: x - RING_SIZE / 2,
        top: y - RING_SIZE / 2,
        width: RING_SIZE,
        height: RING_SIZE,
        pointerEvents: "none",
        zIndex: 9999,
        opacity: 1,
        transition: "opacity 150ms ease-out",
      }}
      data-long-press-indicator
    >
      <svg
        width={RING_SIZE}
        height={RING_SIZE}
        style={{ transform: "rotate(-90deg)" }}
      >
        <circle
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="rgba(255, 255, 255, 0.15)"
          strokeWidth={STROKE_WIDTH}
        />
        <circle
          ref={circleRef}
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="var(--foreground, #fff)"
          strokeWidth={STROKE_WIDTH}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE}
          style={{
            filter: "drop-shadow(0 0 6px rgba(255, 255, 255, 0.5))",
          }}
        />
      </svg>
    </div>,
    document.body,
  );
}
