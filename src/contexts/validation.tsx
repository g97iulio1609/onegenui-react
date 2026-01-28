"use client";

import React, {
  createContext,
  useContext,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import {
  runValidation,
  type ValidationConfig,
  type ValidationFunction,
  type ValidationResult,
} from "@onegenui/core";
import { useData } from "./data";
import { useStore } from "../store";

/**
 * Field validation state
 */
export interface FieldValidationState {
  /** Whether the field has been touched */
  touched: boolean;
  /** Whether the field has been validated */
  validated: boolean;
  /** Validation result */
  result: ValidationResult | null;
}

/**
 * Validation context value
 */
export interface ValidationContextValue {
  /** Custom validation functions from catalog */
  customFunctions: Record<string, ValidationFunction>;
  /** Validation state by field path */
  fieldStates: Record<string, FieldValidationState>;
  /** Validate a field */
  validate: (path: string, config: ValidationConfig) => ValidationResult;
  /** Mark field as touched */
  touch: (path: string) => void;
  /** Clear validation for a field */
  clear: (path: string) => void;
  /** Validate all fields */
  validateAll: () => boolean;
  /** Register field config */
  registerField: (path: string, config: ValidationConfig) => void;
}

const ValidationContext = createContext<ValidationContextValue | null>(null);

/**
 * Props for ValidationProvider
 */
export interface ValidationProviderProps {
  /** Custom validation functions from catalog */
  customFunctions?: Record<string, ValidationFunction>;
  children: ReactNode;
}

/**
 * Provider for validation - Now uses Zustand for state
 */
export function ValidationProvider({
  customFunctions = {},
  children,
}: ValidationProviderProps) {
  const { data, authState } = useData();

  // Bridge to Zustand store for field states
  const fieldStates = useStore((s) => s.fieldStates);
  const touchField = useStore((s) => s.touchField);
  const setFieldValidation = useStore((s) => s.setFieldValidation);
  const clearFieldValidation = useStore((s) => s.clearFieldValidation);

  // Local state for field configs (not serializable - contains functions)
  const [fieldConfigs, setFieldConfigs] = React.useState<
    Record<string, ValidationConfig>
  >({});

  const registerField = useCallback(
    (path: string, config: ValidationConfig) => {
      setFieldConfigs((prev) => ({ ...prev, [path]: config }));
    },
    [],
  );

  const validate = useCallback(
    (path: string, config: ValidationConfig): ValidationResult => {
      const value = data[path.split("/").filter(Boolean).join(".")];
      const result = runValidation(config, {
        value,
        dataModel: data,
        customFunctions,
        authState,
      });

      // Store validation result in Zustand
      setFieldValidation(path, {
        isValid: result.valid,
        errors: result.errors,
        // ValidationResult from core doesn't have warnings, use empty array
        warnings: [],
      });

      return result;
    },
    [data, customFunctions, authState, setFieldValidation],
  );

  const touch = useCallback(
    (path: string) => {
      touchField(path);
    },
    [touchField],
  );

  const clear = useCallback(
    (path: string) => {
      clearFieldValidation(path);
    },
    [clearFieldValidation],
  );

  const validateAll = useCallback(() => {
    let allValid = true;

    for (const [path, config] of Object.entries(fieldConfigs)) {
      const result = validate(path, config);
      if (!result.valid) {
        allValid = false;
      }
    }

    return allValid;
  }, [fieldConfigs, validate]);

  // Convert Zustand field states to context format
  const contextFieldStates = useMemo(() => {
    const result: Record<string, FieldValidationState> = {};
    for (const [path, state] of Object.entries(fieldStates)) {
      result[path] = {
        touched: state.touched,
        validated: state.validationResult !== null,
        result: state.validationResult
          ? {
              valid: state.validationResult.isValid,
              errors: state.validationResult.errors,
              checks: [], // ValidationResult requires checks
            }
          : null,
      };
    }
    return result;
  }, [fieldStates]);

  const value = useMemo<ValidationContextValue>(
    () => ({
      customFunctions,
      fieldStates: contextFieldStates,
      validate,
      touch,
      clear,
      validateAll,
      registerField,
    }),
    [
      customFunctions,
      contextFieldStates,
      validate,
      touch,
      clear,
      validateAll,
      registerField,
    ],
  );

  return (
    <ValidationContext.Provider value={value}>
      {children}
    </ValidationContext.Provider>
  );
}

/**
 * Hook to access validation context
 */
export function useValidation(): ValidationContextValue {
  const ctx = useContext(ValidationContext);
  if (!ctx) {
    throw new Error("useValidation must be used within a ValidationProvider");
  }
  return ctx;
}

/**
 * Hook to get validation state for a field
 */
export function useFieldValidation(
  path: string,
  config?: ValidationConfig,
): {
  state: FieldValidationState;
  validate: () => ValidationResult;
  touch: () => void;
  clear: () => void;
  errors: string[];
  isValid: boolean;
} {
  const {
    fieldStates,
    validate: validateField,
    touch: touchField,
    clear: clearField,
    registerField,
  } = useValidation();

  // Stabilize config reference to avoid infinite loops
  const configJson = config ? JSON.stringify(config) : null;

  // Register field on mount or when config changes
  React.useEffect(() => {
    if (config && configJson) {
      registerField(path, config);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, configJson, registerField]);

  const state = fieldStates[path] ?? {
    touched: false,
    validated: false,
    result: null,
  };

  const validate = useCallback(
    () => validateField(path, config ?? { checks: [] }),
    [path, config, validateField],
  );

  const touch = useCallback(() => touchField(path), [path, touchField]);
  const clear = useCallback(() => clearField(path), [path, clearField]);

  return {
    state,
    validate,
    touch,
    clear,
    errors: state.result?.errors ?? [],
    isValid: state.result?.valid ?? true,
  };
}
