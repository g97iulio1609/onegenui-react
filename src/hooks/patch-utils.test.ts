import { describe, expect, it } from "vitest";
import type { UITree } from "@onegenui/core";
import { applyPatch } from "./patch-utils";

function createBaseTree(): UITree {
  return {
    root: "main-stack",
    elements: {
      "main-stack": {
        key: "main-stack",
        type: "Stack",
        props: { title: "Initial" },
        children: [],
        _meta: {
          turnId: "turn-1",
          createdTurnId: "turn-1",
          createdAt: 1,
        },
      },
    },
  };
}

describe("patch-utils turn metadata", () => {
  it("keeps creation ownership stable when an existing element is updated", () => {
    const updated = applyPatch(
      createBaseTree(),
      {
        op: "set",
        path: "/elements/main-stack/props/title",
        value: "Updated",
      },
      { turnId: "turn-2" },
    );

    const element = updated.elements["main-stack"];
    expect(element?.props.title).toBe("Updated");
    expect(element?._meta?.createdTurnId).toBe("turn-1");
    expect(element?._meta?.turnId).toBe("turn-1");
    expect(element?._meta?.lastModifiedTurnId).toBe("turn-2");
  });

  it("assigns creation metadata when a new element is created", () => {
    const updated = applyPatch(
      createBaseTree(),
      {
        op: "add",
        path: "/elements/new-card",
        value: {
          key: "new-card",
          type: "Card",
          props: { title: "Card" },
          children: [],
        },
      },
      { turnId: "turn-3" },
    );

    const element = updated.elements["new-card"];
    expect(element?._meta?.createdTurnId).toBe("turn-3");
    expect(element?._meta?.turnId).toBe("turn-3");
    expect(element?._meta?.lastModifiedTurnId).toBe("turn-3");
  });

  it("keeps existing children when add patch targets an existing container", () => {
    const base = createBaseTree();
    base.elements["main-stack"] = {
      ...base.elements["main-stack"],
      children: ["existing-card"],
    };
    base.elements["existing-card"] = {
      key: "existing-card",
      type: "Card",
      props: { title: "Existing" },
      children: [],
    };

    const updated = applyPatch(
      base,
      {
        op: "add",
        path: "/elements/main-stack",
        value: {
          key: "main-stack",
          type: "Stack",
          props: { gap: "lg" },
          children: [],
        },
      },
      { turnId: "turn-4" },
    );

    expect(updated.elements["main-stack"]?.children).toEqual(["existing-card"]);
    expect(updated.elements["main-stack"]?.props.gap).toBe("lg");
  });

  it("merges incoming children with existing children on add", () => {
    const base = createBaseTree();
    base.elements["main-stack"] = {
      ...base.elements["main-stack"],
      children: ["existing-card"],
    };
    base.elements["existing-card"] = {
      key: "existing-card",
      type: "Card",
      props: { title: "Existing" },
      children: [],
    };

    const updated = applyPatch(
      base,
      {
        op: "add",
        path: "/elements/main-stack",
        value: {
          key: "main-stack",
          type: "Stack",
          props: { title: "Updated title" },
          children: ["new-card"],
        },
      },
      { turnId: "turn-5" },
    );

    expect(updated.elements["main-stack"]?.children).toEqual([
      "existing-card",
      "new-card",
    ]);
    expect(updated.elements["main-stack"]?.props.title).toBe("Updated title");
  });

  it("normalizes stringified element payloads before applying the patch", () => {
    const updated = applyPatch(
      { root: "", elements: {} },
      {
        op: "add",
        path: "/elements/main-stack",
        value:
          '{"key":"main-stack","type":"Stack","props":{"gap":"lg"},"children":[]}',
      },
      { turnId: "turn-6" },
    );

    expect(updated.elements["main-stack"]).toEqual(
      expect.objectContaining({
        key: "main-stack",
        type: "Stack",
        props: { gap: "lg" },
      }),
    );
  });

  it("preserves existing children on replace when incoming children are empty", () => {
    const base = createBaseTree();
    base.elements["main-stack"] = {
      ...base.elements["main-stack"],
      children: ["existing-card"],
    };
    base.elements["existing-card"] = {
      key: "existing-card",
      type: "Card",
      props: { title: "Existing" },
      children: [],
    };

    const updated = applyPatch(
      base,
      {
        op: "replace",
        path: "/elements/main-stack",
        value: {
          key: "main-stack",
          type: "Stack",
          props: { gap: "xl" },
          children: [],
        },
      },
      { turnId: "turn-7" },
    );

    expect(updated.elements["main-stack"]?.children).toEqual(["existing-card"]);
    expect(updated.elements["main-stack"]?.props.gap).toBe("xl");
  });
});
