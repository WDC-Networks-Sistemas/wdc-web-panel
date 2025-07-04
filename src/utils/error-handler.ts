import { ApiError } from '@/types/api';
import { env } from '@/lib/env';

/**
 * Format error message for display
 */
export function formatErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    if ('statusCode' in error) {
      const apiError = error as ApiError;
      return `Error ${apiError.statusCode}: ${apiError.message}`;
    }
    return error.message;
  }
  return 'An unknown error occurred';
}

/**
 * Log errors to console with additional context
 */
export function logError(context: string, error: unknown): void {
  if (env.isDevelopment) {
    console.error(`[${context}]`, error);
  }

  // In production, you might want to send errors to a monitoring service
  if (env.isProduction) {
    // TODO: Implement error reporting to monitoring service
    // Example: sendToErrorMonitoring(context, error);
  }
}

/**
 * Handle API errors in a consistent way
 */
export function handleApiError(context: string, error: unknown): string {
  logError(context, error);
  return formatErrorMessage(error);
}
