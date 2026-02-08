/**
 * MCP Slice - State management for MCP server connections
 *
 * Manages the list of MCP servers, their connection status,
 * and provides async actions to fetch/add/remove/toggle servers
 * via the dashboard API layer.
 */
import type { SliceCreator } from "../types";

// =============================================================================
// Types
// =============================================================================

export type McpTransportView = "stdio" | "http" | "local";
export type McpServerStatus = "connected" | "disconnected" | "connecting" | "error";

export interface McpServerView {
  id: string;
  name: string;
  transport: McpTransportView;
  status: McpServerStatus;
  toolCount: number;
  error?: string;
}

export interface McpToolView {
  name: string;
  description: string;
  serverId: string;
}

// =============================================================================
// Slice Interface
// =============================================================================

export interface McpSlice {
  // State
  servers: McpServerView[];
  isLoadingServers: boolean;
  mcpError: string | null;

  // Actions
  setServers: (servers: McpServerView[]) => void;
  setLoadingServers: (loading: boolean) => void;
  setMcpError: (error: string | null) => void;
  fetchServers: () => Promise<void>;
  addServer: (config: Record<string, unknown>) => Promise<void>;
  removeServer: (serverId: string) => Promise<void>;
  toggleServer: (serverId: string) => Promise<void>;
}

// =============================================================================
// API helpers (thin wrappers around fetch)
// =============================================================================

const MCP_API_BASE = "/api/mcp/servers";

async function apiFetch<T>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error((body as { error?: string }).error ?? res.statusText);
  }
  return res.json() as Promise<T>;
}

// =============================================================================
// Slice Creator
// =============================================================================

export const createMcpSlice: SliceCreator<McpSlice> = (set) => ({
  // State
  servers: [],
  isLoadingServers: false,
  mcpError: null,

  // Synchronous setters (used by async actions)
  setServers: (servers) =>
    set((state) => {
      state.servers = servers;
    }),

  setLoadingServers: (loading) =>
    set((state) => {
      state.isLoadingServers = loading;
    }),

  setMcpError: (error) =>
    set((state) => {
      state.mcpError = error;
    }),

  // Async actions
  fetchServers: async () => {
    set((state) => {
      state.isLoadingServers = true;
      state.mcpError = null;
    });
    try {
      const data = await apiFetch<{ servers: McpServerView[] }>(MCP_API_BASE);
      set((state) => {
        state.servers = data.servers;
        state.isLoadingServers = false;
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch servers";
      set((state) => {
        state.mcpError = message;
        state.isLoadingServers = false;
      });
    }
  },

  addServer: async (config) => {
    set((state) => {
      state.mcpError = null;
    });
    try {
      const data = await apiFetch<{ servers: McpServerView[] }>(MCP_API_BASE, {
        method: "POST",
        body: JSON.stringify(config),
      });
      set((state) => {
        state.servers = data.servers;
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to add server";
      set((state) => {
        state.mcpError = message;
      });
      throw err;
    }
  },

  removeServer: async (serverId) => {
    set((state) => {
      state.mcpError = null;
    });
    try {
      await apiFetch(`${MCP_API_BASE}/${serverId}`, { method: "DELETE" });
      set((state) => {
        state.servers = state.servers.filter((s) => s.id !== serverId);
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to remove server";
      set((state) => {
        state.mcpError = message;
      });
    }
  },

  toggleServer: async (serverId) => {
    set((state) => {
      state.mcpError = null;
    });
    try {
      const data = await apiFetch<{ server: McpServerView }>(
        `${MCP_API_BASE}/${serverId}`,
        { method: "PATCH" },
      );
      set((state) => {
        const idx = state.servers.findIndex((s) => s.id === serverId);
        if (idx >= 0) {
          state.servers[idx] = data.server;
        }
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to toggle server";
      set((state) => {
        state.mcpError = message;
      });
    }
  },
});
