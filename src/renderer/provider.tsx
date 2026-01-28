"use client";

import type { ReactNode } from "react";
import { DataProvider } from "../contexts/data";
import { VisibilityProvider } from "../contexts/visibility";
import { ActionProvider, useActions, ConfirmDialog } from "../contexts/actions";
import { ValidationProvider } from "../contexts/validation";
import { MarkdownProvider } from "../contexts/markdown";
import type { JSONUIProviderProps } from "./types";

/**
 * Renders the confirmation dialog when needed
 */
function ConfirmationDialogManager() {
  const { pendingConfirmation, confirm, cancel } = useActions();

  if (!pendingConfirmation?.action.confirm) {
    return null;
  }

  return (
    <ConfirmDialog
      confirm={pendingConfirmation.action.confirm}
      onConfirm={confirm}
      onCancel={cancel}
    />
  );
}

/**
 * Combined provider for all JSONUI contexts
 */
export function JSONUIProvider({
  registry,
  initialData,
  authState,
  actionHandlers,
  navigate,
  validationFunctions,
  onDataChange,
  children,
}: JSONUIProviderProps) {
  return (
    <MarkdownProvider>
      <DataProvider
        initialData={initialData}
        authState={authState}
        onDataChange={onDataChange}
      >
        <VisibilityProvider>
          <ActionProvider handlers={actionHandlers} navigate={navigate}>
            <ValidationProvider customFunctions={validationFunctions}>
              {children}
              <ConfirmationDialogManager />
            </ValidationProvider>
          </ActionProvider>
        </VisibilityProvider>
      </DataProvider>
    </MarkdownProvider>
  );
}
