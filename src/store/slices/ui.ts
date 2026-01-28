/**
 * UI Slice - Loading states, progress, confirmations
 */
import type { SliceCreator } from "../types";

export interface ConfirmationDialog {
  id: string;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

export interface ToolProgress {
  id: string;
  name: string;
  status: "pending" | "running" | "complete" | "error";
  progress?: number;
  message?: string;
}

export interface UISlice {
  // Confirmations
  confirmations: ConfirmationDialog[];
  showConfirmation: (dialog: Omit<ConfirmationDialog, "id">) => string;
  hideConfirmation: (id: string) => void;

  // Tool progress
  toolProgress: Map<string, ToolProgress>;
  setToolProgress: (progress: ToolProgress) => void;
  clearToolProgress: (id: string) => void;
  clearAllToolProgress: () => void;

  // Global loading
  globalLoading: boolean;
  setGlobalLoading: (loading: boolean) => void;

  // Sidebar/panels
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
}

let confirmationIdCounter = 0;

export const createUISlice: SliceCreator<UISlice> = (set) => ({
  // Confirmations
  confirmations: [],
  showConfirmation: (dialog) => {
    const id = `ui_confirm_${++confirmationIdCounter}`;
    set((state) => {
      state.confirmations.push({ ...dialog, id });
    });
    return id;
  },
  hideConfirmation: (id) =>
    set((state) => {
      state.confirmations = state.confirmations.filter((c) => c.id !== id);
    }),

  // Tool progress
  toolProgress: new Map(),
  setToolProgress: (progress) =>
    set((state) => {
      state.toolProgress.set(progress.id, progress);
    }),
  clearToolProgress: (id) =>
    set((state) => {
      state.toolProgress.delete(id);
    }),
  clearAllToolProgress: () => set({ toolProgress: new Map() }),

  // Global loading
  globalLoading: false,
  setGlobalLoading: (globalLoading) => set({ globalLoading }),

  // Sidebar
  sidebarOpen: true,
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  toggleSidebar: () =>
    set((state) => {
      state.sidebarOpen = !state.sidebarOpen;
    }),
});
