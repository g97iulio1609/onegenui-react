import { describe, expect, it } from "vitest";
import { createWireFrame } from "@onegenui/core";
import { parseSSELine } from "./stream-parser";

function toLine(payload: unknown): string {
  return `d:${JSON.stringify(payload)}`;
}

describe("stream-parser", () => {
  it("parses start control events", () => {
    const line = toLine(
      createWireFrame({
        correlationId: "corr-1",
        sequence: 0,
        event: { kind: "control", action: "start", data: { mode: "DIRECT" } },
      }),
    );

    const parsed = parseSSELine(line);
    expect(parsed?.type).toBe("streaming-started");
  });

  it("parses patch events", () => {
    const line = toLine(
      createWireFrame({
        correlationId: "corr-2",
        sequence: 1,
        event: {
          kind: "patch",
          patch: {
            op: "add",
            path: "/elements/root",
            value: { key: "root", type: "Stack", props: {}, children: [] },
          },
        },
      }),
    );

    const parsed = parseSSELine(line);
    expect(parsed?.type).toBe("patch");
  });

  it("parses protocol error events", () => {
    const line = toLine(
      createWireFrame({
        correlationId: "corr-3",
        sequence: 2,
        event: {
          kind: "error",
          code: "STREAM_PROTOCOL_ERROR",
          message: "invalid frame",
          recoverable: false,
        },
      }),
    );

    const parsed = parseSSELine(line);
    expect(parsed?.type).toBe("error");
    if (parsed?.type === "error") {
      expect(parsed.error.code).toBe("STREAM_PROTOCOL_ERROR");
    }
  });
});

