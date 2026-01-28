import { describe, it, expect } from "vitest";
import {
  parseSSELine,
  parseDataPart,
  processBufferChunk,
  isPatchOperation,
  isTreePatch,
  payloadToPatch,
  sortPatchesByDepth,
  groupPatches,
  isValidPatch,
  classifyPayload,
} from "../stream-utils";
import type { PatchPayload } from "../types";

describe("parseSSELine", () => {
  it("parses data line correctly", () => {
    const result = parseSSELine('d:{"op":"add","path":"/root"}');
    expect(result).toEqual({
      type: "d",
      content: '{"op":"add","path":"/root"}',
    });
  });

  it("parses data: format correctly", () => {
    const result = parseSSELine('data:{"test":true}');
    expect(result).toEqual({
      type: "data",
      content: '{"test":true}',
    });
  });

  it("returns null for type 0 (not used)", () => {
    expect(parseSSELine("0:some text content")).toBeNull();
  });

  it("returns null for empty line", () => {
    expect(parseSSELine("")).toBeNull();
  });

  it("returns null for line without colon", () => {
    expect(parseSSELine("invalid line")).toBeNull();
  });

  it("returns null for unknown line type", () => {
    expect(parseSSELine("unknown:content")).toBeNull();
  });

  it("handles content with colons", () => {
    const result = parseSSELine('d:{"url":"https://example.com"}');
    expect(result).toEqual({
      type: "d",
      content: '{"url":"https://example.com"}',
    });
  });
});

describe("parseDataPart", () => {
  it("parses JSON content", () => {
    const result = parseDataPart('{"op":"add","path":"/root"}');
    expect(result).toEqual({ op: "add", path: "/root" });
  });

  it("returns null for [DONE]", () => {
    expect(parseDataPart("[DONE]")).toBeNull();
    expect(parseDataPart(" [DONE] ")).toBeNull();
  });

  it("returns null for invalid JSON", () => {
    expect(parseDataPart("not json")).toBeNull();
  });

  it("unwraps wrapped format", () => {
    const result = parseDataPart(
      '{"type":"data","data":{"op":"message","content":"hello"}}',
    );
    expect(result).toEqual({ op: "message", content: "hello" });
  });
});

describe("processBufferChunk", () => {
  it("splits lines correctly", () => {
    const result = processBufferChunk("", "line1\nline2\nline3");
    expect(result.lines).toEqual(["line1", "line2"]);
    expect(result.remaining).toBe("line3");
  });

  it("preserves buffer across chunks", () => {
    const result1 = processBufferChunk("", "partial");
    expect(result1.lines).toEqual([]);
    expect(result1.remaining).toBe("partial");

    const result2 = processBufferChunk(result1.remaining, " data\nnext");
    expect(result2.lines).toEqual(["partial data"]);
    expect(result2.remaining).toBe("next");
  });

  it("handles empty chunk", () => {
    const result = processBufferChunk("buffer", "");
    expect(result.lines).toEqual([]);
    expect(result.remaining).toBe("buffer");
  });
});

describe("isPatchOperation", () => {
  it("returns true for valid patch", () => {
    expect(isPatchOperation({ op: "add", path: "/root" })).toBe(true);
    expect(isPatchOperation({ op: "message", content: "hello" })).toBe(true);
  });

  it("returns false for non-objects", () => {
    expect(isPatchOperation(null)).toBe(false);
    expect(isPatchOperation("string")).toBe(false);
    expect(isPatchOperation(123)).toBe(false);
  });

  it("returns false for objects without op", () => {
    expect(isPatchOperation({ path: "/root" })).toBe(false);
    expect(isPatchOperation({ type: "something" })).toBe(false);
  });
});

describe("isTreePatch", () => {
  it("returns true for tree mutation ops", () => {
    expect(isTreePatch({ op: "add", path: "/root" })).toBe(true);
    expect(
      isTreePatch({ op: "replace", path: "/elements/x/props/title" }),
    ).toBe(true);
    expect(isTreePatch({ op: "remove", path: "/elements/x" })).toBe(true);
    expect(isTreePatch({ op: "set", path: "/root" })).toBe(true);
  });

  it("returns false for non-tree ops", () => {
    expect(isTreePatch({ op: "message", content: "hello" })).toBe(false);
    expect(isTreePatch({ op: "question", value: {} })).toBe(false);
  });

  it("returns false without path", () => {
    expect(isTreePatch({ op: "add" })).toBe(false);
  });
});

describe("payloadToPatch", () => {
  it("converts payload to JsonPatch", () => {
    const payload: PatchPayload = {
      op: "add",
      path: "/elements/card",
      value: { key: "card", type: "Card", props: {} },
    };
    const result = payloadToPatch(payload);
    expect(result).toEqual({
      op: "add",
      path: "/elements/card",
      value: { key: "card", type: "Card", props: {} },
    });
  });

  it("returns null without path", () => {
    const payload: PatchPayload = { op: "message", content: "hello" };
    expect(payloadToPatch(payload)).toBeNull();
  });
});

describe("sortPatchesByDepth", () => {
  it("sorts patches by path depth", () => {
    const patches = [
      { op: "add" as const, path: "/elements/a/props/title", value: "T" },
      { op: "add" as const, path: "/root", value: "a" },
      { op: "add" as const, path: "/elements/a", value: {} },
    ];
    const sorted = sortPatchesByDepth(patches);
    expect(sorted[0]?.path).toBe("/root");
    expect(sorted[1]?.path).toBe("/elements/a");
    expect(sorted[2]?.path).toBe("/elements/a/props/title");
  });

  it("does not mutate original array", () => {
    const patches = [
      { op: "add" as const, path: "/a/b/c", value: 1 },
      { op: "add" as const, path: "/a", value: 2 },
    ];
    const original = [...patches];
    sortPatchesByDepth(patches);
    expect(patches).toEqual(original);
  });
});

describe("groupPatches", () => {
  it("groups structural and update patches", () => {
    const patches = [
      { op: "add" as const, path: "/elements/card", value: { key: "card" } },
      {
        op: "replace" as const,
        path: "/elements/card/props/title",
        value: "New",
      },
      { op: "set" as const, path: "/root", value: "card" },
      { op: "add" as const, path: "/elements/card/children/-", value: "child" },
    ];
    const { structural, updates } = groupPatches(patches);

    expect(structural).toHaveLength(2);
    expect(structural.map((p) => p.path)).toContain("/elements/card");
    expect(structural.map((p) => p.path)).toContain("/root");

    expect(updates).toHaveLength(2);
    expect(updates.map((p) => p.path)).toContain("/elements/card/props/title");
    expect(updates.map((p) => p.path)).toContain("/elements/card/children/-");
  });
});

describe("isValidPatch", () => {
  it("validates correct patches", () => {
    expect(isValidPatch({ op: "add", path: "/root", value: "x" })).toBe(true);
    expect(
      isValidPatch({ op: "replace", path: "/elements/x", value: {} }),
    ).toBe(true);
    expect(isValidPatch({ op: "remove", path: "/elements/x" })).toBe(true);
    expect(isValidPatch({ op: "set", path: "/root", value: "y" })).toBe(true);
  });

  it("rejects invalid patches", () => {
    expect(isValidPatch(null)).toBe(false);
    expect(isValidPatch({})).toBe(false);
    expect(isValidPatch({ op: "add" })).toBe(false);
    expect(isValidPatch({ path: "/root" })).toBe(false);
    expect(isValidPatch({ op: "add", path: "no-slash" })).toBe(false);
    expect(isValidPatch({ op: "invalid", path: "/root" })).toBe(false);
  });
});

describe("classifyPayload", () => {
  it("classifies null as ignore", () => {
    expect(classifyPayload(null)).toEqual({ kind: "ignore" });
  });

  it("classifies text-delta as ignore", () => {
    const result = classifyPayload({ type: "text-delta", textDelta: "hello" });
    expect(result).toEqual({ kind: "ignore" });
  });

  it("classifies message operation", () => {
    const result = classifyPayload({ op: "message", content: "Hello world" });
    expect(result).toEqual({
      kind: "message",
      content: "Hello world",
      role: "assistant",
    });
  });

  it("classifies message with value", () => {
    const result = classifyPayload({
      op: "message",
      value: "From value",
      role: "system",
    });
    expect(result).toEqual({
      kind: "message",
      content: "From value",
      role: "system",
    });
  });

  it("classifies question operation", () => {
    const question = { id: "q1", text: "What?", type: "text" as const };
    const result = classifyPayload({ op: "question", value: question });
    expect(result).toEqual({ kind: "question", question });
  });

  it("classifies suggestion operation", () => {
    const suggestions = [{ id: "s1", label: "Yes", prompt: "yes" }];
    const result = classifyPayload({ op: "suggestion", suggestions });
    expect(result).toEqual({ kind: "suggestion", suggestions });
  });

  it("classifies tree patch", () => {
    const result = classifyPayload({
      op: "add",
      path: "/elements/x",
      value: { key: "x" },
    });
    expect(result).toEqual({
      kind: "tree-patch",
      patch: { op: "add", path: "/elements/x", value: { key: "x" } },
    });
  });

  it("classifies plan-created", () => {
    const plan = { goal: "Test", steps: [] };
    const result = classifyPayload({ type: "plan-created", plan });
    expect(result).toEqual({ kind: "plan-created", plan });
  });

  it("classifies tool-progress", () => {
    const result = classifyPayload({
      type: "tool-progress",
      toolName: "search",
      toolCallId: "tc1",
      status: "progress" as const,
      message: "Searching...",
    });
    expect(result.kind).toBe("tool-progress");
  });

  it("classifies orchestration events", () => {
    expect(classifyPayload({ type: "step-started", stepId: 1 }).kind).toBe(
      "orchestration",
    );
    expect(classifyPayload({ type: "step-done", stepId: 1 }).kind).toBe(
      "orchestration",
    );
    expect(classifyPayload({ type: "orchestration-done" }).kind).toBe(
      "orchestration",
    );
  });
});
