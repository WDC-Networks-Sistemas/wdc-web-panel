/**
 * Extended Error interface for API errors
 */
export interface ApiError extends Error {
  statusCode?: number;
  details?: any;
}

/**
 * Log error to console with context
 */
export function logError(context: string, error: unknown): void {
  if (error instanceof Error) {
    console.error(`[${context}] ${error.message}`, error);
  } else {
    console.error(`[${context}] Unknown error:`, error);
  }
}

/**
 * Format error messages for display
 */
export function formatErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    const apiError = error as ApiError;
    if (apiError.statusCode === 401) {
      return 'Your session has expired. Please log in again.';
    }
    if (apiError.statusCode === 403) {
      return 'You do not have permission to perform this action.';
    }
    if (apiError.statusCode === 404) {
      return 'The requested resource was not found.';
    }
    if (apiError.statusCode >= 500) {
      return 'A server error occurred. Please try again later.';
    }
    return apiError.message || 'An error occurred';
  }
  return 'An unexpected error occurred';
}

/**
 * Handle API errors in a consistent way
 */
export function handleApiError(context: string, error: unknown): string {
  logError(context, error);
  return formatErrorMessage(error);
}
