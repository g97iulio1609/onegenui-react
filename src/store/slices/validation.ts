/**
 * Validation Slice - Field validation state management
 *
 * Manages:
 * - Field touched states
 * - Validation results per field
 * - Form-level validation state
 */
import type { SliceCreator } from "../types";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Validation result for a single field
 */
export interface FieldValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}

/**
 * State for a single field
 */
export interface FieldState {
  path: string;
  touched: boolean;
  validated: boolean;
  validationResult: FieldValidationResult | null;
  lastValidatedAt?: number;
}

/**
 * Form-level validation state
 */
export interface FormValidationState {
  isValid: boolean;
  isDirty: boolean;
  isValidating: boolean;
  touchedCount: number;
  errorCount: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Slice Interface
// ─────────────────────────────────────────────────────────────────────────────

export interface ValidationSlice {
  // Field states (keyed by path)
  fieldStates: Record<string, FieldState>;

  // Field operations
  touchField: (path: string) => void;
  untouchField: (path: string) => void;
  setFieldValidation: (path: string, result: FieldValidationResult) => void;
  clearFieldValidation: (path: string) => void;

  // Getters
  getFieldState: (path: string) => FieldState | undefined;
  isFieldTouched: (path: string) => boolean;
  isFieldValid: (path: string) => boolean;
  getFieldErrors: (path: string) => string[];

  // Form-level operations
  isValidating: boolean;
  setIsValidating: (validating: boolean) => void;

  // Form state
  getFormState: () => FormValidationState;
  touchAllFields: (paths: string[]) => void;
  clearAllValidation: () => void;

  // Bulk operations
  setMultipleFieldValidations: (
    results: Array<{ path: string; result: FieldValidationResult }>,
  ) => void;

  getFieldsWithErrors: () => string[];
  getTouchedFields: () => string[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Slice Implementation
// ─────────────────────────────────────────────────────────────────────────────

export const createValidationSlice: SliceCreator<ValidationSlice> = (
  set,
  get,
) => ({
  fieldStates: {},

  touchField: (path) =>
    set((state) => {
      const existing = state.fieldStates[path];
      state.fieldStates[path] = {
        path,
        touched: true,
        validated: existing?.validated ?? false,
        validationResult: existing?.validationResult ?? null,
        lastValidatedAt: existing?.lastValidatedAt,
      };
    }),

  untouchField: (path) =>
    set((state) => {
      if (state.fieldStates[path]) {
        state.fieldStates[path].touched = false;
      }
    }),

  setFieldValidation: (path, result) =>
    set((state) => {
      const existing = state.fieldStates[path];
      state.fieldStates[path] = {
        path,
        touched: existing?.touched ?? false,
        validated: true,
        validationResult: result,
        lastValidatedAt: Date.now(),
      };
    }),

  clearFieldValidation: (path) =>
    set((state) => {
      if (state.fieldStates[path]) {
        state.fieldStates[path].validated = false;
        state.fieldStates[path].validationResult = null;
        state.fieldStates[path].lastValidatedAt = undefined;
      }
    }),

  getFieldState: (path) => {
    return get().fieldStates[path];
  },

  isFieldTouched: (path) => {
    return get().fieldStates[path]?.touched ?? false;
  },

  isFieldValid: (path) => {
    const state = get().fieldStates[path];
    return state?.validationResult?.isValid ?? true;
  },

  getFieldErrors: (path) => {
    return get().fieldStates[path]?.validationResult?.errors ?? [];
  },

  isValidating: false,

  setIsValidating: (validating) => set({ isValidating: validating }),

  getFormState: () => {
    const { fieldStates, isValidating } = get();
    let touchedCount = 0;
    let errorCount = 0;
    let isValid = true;
    let isDirty = false;

    for (const state of Object.values(fieldStates)) {
      if (state.touched) {
        touchedCount++;
        isDirty = true;
      }
      if (state.validationResult && !state.validationResult.isValid) {
        isValid = false;
        errorCount += state.validationResult.errors.length;
      }
    }

    return { isValid, isDirty, isValidating, touchedCount, errorCount };
  },

  touchAllFields: (paths) =>
    set((state) => {
      for (const path of paths) {
        const existing = state.fieldStates[path];
        state.fieldStates[path] = {
          path,
          touched: true,
          validated: existing?.validated ?? false,
          validationResult: existing?.validationResult ?? null,
          lastValidatedAt: existing?.lastValidatedAt,
        };
      }
    }),

  clearAllValidation: () => {
    set({ fieldStates: {}, isValidating: false });
  },

  setMultipleFieldValidations: (results) =>
    set((state) => {
      for (const { path, result } of results) {
        const existing = state.fieldStates[path];
        state.fieldStates[path] = {
          path,
          touched: existing?.touched ?? false,
          validated: true,
          validationResult: result,
          lastValidatedAt: Date.now(),
        };
      }
    }),

  getFieldsWithErrors: () => {
    const result: string[] = [];
    for (const [path, state] of Object.entries(get().fieldStates)) {
      if (state.validationResult && !state.validationResult.isValid) {
        result.push(path);
      }
    }
    return result;
  },

  getTouchedFields: () => {
    const result: string[] = [];
    for (const [path, state] of Object.entries(get().fieldStates)) {
      if (state.touched) {
        result.push(path);
      }
    }
    return result;
  },
});
