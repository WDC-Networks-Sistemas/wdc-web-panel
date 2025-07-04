import { formatErrorMessage, logError, handleApiError } from '@/utils/error-handler';
import { env } from '@/lib/env';
import { ApiError } from '@/types/api';

// Mock console.error
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();

// Mock environment
jest.mock('@/lib/env', () => ({
  env: {
    isDevelopment: true,
    isProduction: false,
  },
}));

describe('Error Handler Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('formatErrorMessage', () => {
    it('should format an API error with status code', () => {
      const apiError = new Error('Resource not found') as ApiError;
      apiError.statusCode = 404;

      const formattedMessage = formatErrorMessage(apiError);
      expect(formattedMessage).toBe('Error 404: Resource not found');
    });

    it('should format a regular Error object', () => {
      const error = new Error('Something went wrong');
      const formattedMessage = formatErrorMessage(error);
      expect(formattedMessage).toBe('Something went wrong');
    });

    it('should handle non-Error objects', () => {
      const formattedMessage = formatErrorMessage('Just a string');
      expect(formattedMessage).toBe('An unknown error occurred');
    });

    it('should handle null or undefined', () => {
      const formattedMessage = formatErrorMessage(null);
      expect(formattedMessage).toBe('An unknown error occurred');
    });
  });

  describe('logError', () => {
    it('should log errors to console in development mode', () => {
      const error = new Error('Test error');
      logError('TestContext', error);

      expect(mockConsoleError).toHaveBeenCalledWith('[TestContext]', error);
    });

    it('should not log errors to console in production mode', () => {
      // Mock production environment
      jest.spyOn(env, 'isDevelopment', 'get').mockReturnValueOnce(false);
      jest.spyOn(env, 'isProduction', 'get').mockReturnValueOnce(true);

      const error = new Error('Test error');
      logError('TestContext', error);

      // Console.error should not be called in production
      expect(mockConsoleError).not.toHaveBeenCalled();
    });
  });

  describe('handleApiError', () => {
    it('should log and format errors', () => {
      const error = new Error('API failure');
      const result = handleApiError('ApiTest', error);

      // Should log the error
      expect(mockConsoleError).toHaveBeenCalledWith('[ApiTest]', error);

      // Should return formatted message
      expect(result).toBe('API failure');
    });

    it('should handle and format API errors with status codes', () => {
      const apiError = new Error('Not found') as ApiError;
      apiError.statusCode = 404;

      const result = handleApiError('ApiTest', apiError);

      // Should log the error
      expect(mockConsoleError).toHaveBeenCalledWith('[ApiTest]', apiError);

      // Should return formatted message with status code
      expect(result).toBe('Error 404: Not found');
    });
  });
});
