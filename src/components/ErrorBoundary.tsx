/**
 * ErrorBoundary - React error boundary for graceful error handling
 * 
 * Catches JavaScript errors in child component tree, logs them,
 * and displays a fallback UI instead of crashing the whole app.
 * 
 * @example
 * <ErrorBoundary fallback={<ErrorFallback />}>
 *   <Renderer tree={tree} />
 * </ErrorBoundary>
 * 
 * @example
 * // With error callback
 * <ErrorBoundary 
 *   onError={(error, info) => reportToSentry(error, info)}
 *   fallback={<p>Something went wrong</p>}
 * >
 *   <App />
 * </ErrorBoundary>
 */

import { Component, type ReactNode, type ErrorInfo } from "react";
import { createLogger } from "@onegenui/utils";

const logger = createLogger({ prefix: "react:error-boundary" });

export interface ErrorBoundaryProps {
  /** Fallback UI to show when an error occurs */
  fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode);
  /** Callback when an error is caught */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  /** Children to render */
  children: ReactNode;
  /** Optional name for logging/debugging */
  name?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    const { onError, name } = this.props;
    
    logger.error(
      `Error caught${name ? ` in ${name}` : ""}:`,
      error.message,
      errorInfo.componentStack,
    );
    
    onError?.(error, errorInfo);
  }

  reset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    const { hasError, error } = this.state;
    const { children, fallback } = this.props;

    if (hasError && error) {
      if (typeof fallback === "function") {
        return fallback(error, this.reset);
      }
      
      if (fallback) {
        return fallback;
      }
      
      // Default fallback UI
      return (
        <div
          role="alert"
          className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive"
        >
          <h3 className="font-semibold mb-2">Something went wrong</h3>
          <p className="text-sm text-muted-foreground mb-3">{error.message}</p>
          <button
            onClick={this.reset}
            className="px-3 py-1.5 text-sm rounded bg-destructive/20 hover:bg-destructive/30 transition-colors"
          >
            Try again
          </button>
        </div>
      );
    }

    return children;
  }
}

/**
 * Default error fallback component
 */
export interface ErrorFallbackProps {
  error: Error;
  reset: () => void;
  title?: string;
}

export function ErrorFallback({ 
  error, 
  reset, 
  title = "Something went wrong" 
}: ErrorFallbackProps): ReactNode {
  return (
    <div
      role="alert"
      className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive"
    >
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-3">{error.message}</p>
      <button
        onClick={reset}
        className="px-3 py-1.5 text-sm rounded bg-destructive/20 hover:bg-destructive/30 transition-colors"
      >
        Try again
      </button>
    </div>
  );
}

/**
 * Higher-order component to wrap a component with error boundary
 */
export function withErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: Omit<ErrorBoundaryProps, "children"> = {},
): (props: P) => ReactNode {
  const displayName = WrappedComponent.displayName || WrappedComponent.name || "Component";

  function WithErrorBoundary(props: P): ReactNode {
    return (
      <ErrorBoundary {...options} name={displayName}>
        <WrappedComponent {...props} />
      </ErrorBoundary>
    );
  }

  WithErrorBoundary.displayName = `withErrorBoundary(${displayName})`;

  return WithErrorBoundary;
}
