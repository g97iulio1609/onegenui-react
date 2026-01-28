/**
 * Data Manager Port - Hexagonal interface for data operations
 */

import type { DataModel, AuthState } from "@onegenui/core";

/**
 * Port for data model management
 */
export interface DataManagerPort {
  // ─────────────────────────────────────────────────────────────────────────
  // Data model operations
  // ─────────────────────────────────────────────────────────────────────────
  getDataModel(): DataModel;
  setDataModel(data: DataModel): void;
  updateDataModel(path: string, value: unknown): void;
  resetDataModel(): void;

  // ─────────────────────────────────────────────────────────────────────────
  // Path-based access
  // ─────────────────────────────────────────────────────────────────────────
  getValue(path: string): unknown;
  setValue(path: string, value: unknown): void;
  updateMultiple(updates: Record<string, unknown>): void;

  // ─────────────────────────────────────────────────────────────────────────
  // Auth state
  // ─────────────────────────────────────────────────────────────────────────
  getAuth(): AuthState;
  setAuth(auth: AuthState): void;
  isAuthenticated(): boolean;
  hasRole(role: string): boolean;
  hasPermission(permission: string): boolean;

  // ─────────────────────────────────────────────────────────────────────────
  // Subscriptions
  // ─────────────────────────────────────────────────────────────────────────
  subscribe(callback: (data: DataModel) => void): () => void;
  subscribeToPath(path: string, callback: (value: unknown) => void): () => void;
}

/**
 * Port for action management
 */
export interface ActionManagerPort {
  // ─────────────────────────────────────────────────────────────────────────
  // Loading states
  // ─────────────────────────────────────────────────────────────────────────
  isActionLoading(actionName: string): boolean;
  setActionLoading(actionName: string, loading: boolean): void;
  getLoadingActions(): Set<string>;

  // ─────────────────────────────────────────────────────────────────────────
  // Action execution
  // ─────────────────────────────────────────────────────────────────────────
  startAction(actionName: string, payload?: unknown): string;
  completeAction(id: string, result?: unknown): void;
  failAction(id: string, error: string): void;
  getActionStatus(id: string):
    | {
        status: "pending" | "running" | "success" | "error";
        error?: string;
        result?: unknown;
      }
    | undefined;

  // ─────────────────────────────────────────────────────────────────────────
  // Confirmations
  // ─────────────────────────────────────────────────────────────────────────
  showConfirmation(options: {
    actionName: string;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    payload?: unknown;
  }): string;
  hideConfirmation(id: string): void;
  getPendingConfirmations(): Array<{
    id: string;
    actionName: string;
    title: string;
    message: string;
  }>;

  // ─────────────────────────────────────────────────────────────────────────
  // Subscriptions
  // ─────────────────────────────────────────────────────────────────────────
  subscribeToLoading(
    actionName: string,
    callback: (loading: boolean) => void,
  ): () => void;
}

/**
 * Port for validation management
 */
export interface ValidationManagerPort {
  // ─────────────────────────────────────────────────────────────────────────
  // Field operations
  // ─────────────────────────────────────────────────────────────────────────
  touchField(path: string): void;
  untouchField(path: string): void;
  setFieldValidation(
    path: string,
    result: { isValid: boolean; errors: string[]; warnings?: string[] },
  ): void;
  clearFieldValidation(path: string): void;

  // ─────────────────────────────────────────────────────────────────────────
  // Field getters
  // ─────────────────────────────────────────────────────────────────────────
  isFieldTouched(path: string): boolean;
  isFieldValid(path: string): boolean;
  getFieldErrors(path: string): string[];

  // ─────────────────────────────────────────────────────────────────────────
  // Form-level
  // ─────────────────────────────────────────────────────────────────────────
  getFormState(): {
    isValid: boolean;
    isDirty: boolean;
    isValidating: boolean;
    touchedCount: number;
    errorCount: number;
  };
  touchAllFields(paths: string[]): void;
  clearAllValidation(): void;
  getFieldsWithErrors(): string[];

  // ─────────────────────────────────────────────────────────────────────────
  // Subscriptions
  // ─────────────────────────────────────────────────────────────────────────
  subscribeToField(
    path: string,
    callback: (state: {
      touched: boolean;
      valid: boolean;
      errors: string[];
    }) => void,
  ): () => void;
}

/**
 * Port for tool progress management
 */
export interface ToolProgressManagerPort {
  // ─────────────────────────────────────────────────────────────────────────
  // Progress operations
  // ─────────────────────────────────────────────────────────────────────────
  addProgress(event: {
    toolCallId: string;
    toolName: string;
    status: "starting" | "progress" | "complete" | "error";
    message?: string;
    data?: unknown;
    progress?: number;
  }): void;

  updateProgress(
    toolCallId: string,
    updates: {
      status?: "starting" | "progress" | "complete" | "error";
      message?: string;
      data?: unknown;
      progress?: number;
    },
  ): void;

  removeProgress(toolCallId: string): void;
  clearProgress(): void;
  clearCompletedOlderThan(ms: number): void;

  // ─────────────────────────────────────────────────────────────────────────
  // Getters
  // ─────────────────────────────────────────────────────────────────────────
  getProgress(toolCallId: string):
    | {
        toolName: string;
        status: string;
        message?: string;
        progress?: number;
      }
    | undefined;

  getActiveProgress(): Array<{
    toolCallId: string;
    toolName: string;
    status: string;
    message?: string;
  }>;

  isToolRunning(): boolean;
  isSpecificToolRunning(toolName: string): boolean;

  // ─────────────────────────────────────────────────────────────────────────
  // Subscriptions
  // ─────────────────────────────────────────────────────────────────────────
  subscribeToProgress(
    toolCallId: string,
    callback: (
      progress: { status: string; message?: string } | undefined,
    ) => void,
  ): () => void;

  subscribeToRunning(callback: (running: boolean) => void): () => void;
}
