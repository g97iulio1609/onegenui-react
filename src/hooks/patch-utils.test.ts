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
});

