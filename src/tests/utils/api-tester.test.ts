import { testApiConnection, testApiEndpoint, runApiDiagnostics } from '@/utils/api-tester';
import { api } from '@/lib/api';
import { handleApiError } from '@/utils/error-handler';

// Mock the API module
jest.mock('@/lib/api', () => ({
  api: {
    get: jest.fn(),
  },
}));

// Mock error handler
jest.mock('@/utils/error-handler', () => ({
  handleApiError: jest.fn((context, error) => `Error in ${context}: ${error.message}`),
}));

describe('API Tester Utilities', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('testApiConnection', () => {
    it('should return success when API connection is successful', async () => {
      // Mock successful API response
      (api.get as jest.Mock).mockResolvedValueOnce({ status: 'OK' });

      const result = await testApiConnection();

      expect(result).toEqual({
        success: true,
        message: 'API connection successful: OK',
        data: { status: 'OK' },
      });

      expect(api.get).toHaveBeenCalledWith('/api/health', {
        headers: expect.any(Object),
      });
    });

    it('should return failure when API connection fails', async () => {
      // Mock API error
      const mockError = new Error('Connection refused');
      (api.get as jest.Mock).mockRejectedValueOnce(mockError);
      (handleApiError as jest.Mock).mockReturnValueOnce('Error in testApiConnection: Connection refused');

      const result = await testApiConnection();

      expect(result).toEqual({
        success: false,
        message: 'Error in testApiConnection: Connection refused',
        error: mockError,
      });
    });
  });

  describe('testApiEndpoint', () => {
    it('should test a specific endpoint successfully', async () => {
      // Mock successful API response
      (api.get as jest.Mock).mockResolvedValueOnce({ data: 'test-data' });

      const result = await testApiEndpoint('/api/test-endpoint');

      expect(result).toEqual({
        success: true,
        message: 'Endpoint /api/test-endpoint responded successfully',
        data: { data: 'test-data' },
      });

      expect(api.get).toHaveBeenCalledWith('/api/test-endpoint', {
        headers: expect.any(Object),
      });
    });

    it('should handle endpoint test failure', async () => {
      // Mock API error
      const mockError = new Error('Not found');
      (api.get as jest.Mock).mockRejectedValueOnce(mockError);
      (handleApiError as jest.Mock).mockReturnValueOnce(
        'Error in testApiEndpoint(/api/test-endpoint): Not found'
      );

      const result = await testApiEndpoint('/api/test-endpoint');

      expect(result).toEqual({
        success: false,
        message: 'Error in testApiEndpoint(/api/test-endpoint): Not found',
        error: mockError,
      });
    });
  });

  describe('runApiDiagnostics', () => {
    it('should run diagnostics on all configured endpoints', async () => {
      // Mock API responses
      (api.get as jest.Mock)
        .mockResolvedValueOnce({ status: 'OK' }) // Health check
        .mockResolvedValueOnce([{ id: 'order1' }]) // Orders
        .mockRejectedValueOnce(new Error('Unauthorized')); // Pending Buy Orders (fails)

      // Mock error handler for the failed request
      (handleApiError as jest.Mock).mockReturnValueOnce(
        'Error in testApiEndpoint(/api/v1/approvals/pending): Unauthorized'
      );

      const results = await runApiDiagnostics();

      // Should have 3 results (for 3 endpoints)
      expect(results.length).toBe(3);

      // Check first endpoint result (health check)
      expect(results[0]).toEqual({
        name: 'Health Check',
        endpoint: '/api/health',
        success: true,
        message: 'Endpoint /api/health responded successfully',
        data: { status: 'OK' },
      });

      // Check second endpoint result (orders)
      expect(results[1]).toEqual({
        name: 'Orders',
        endpoint: '/api/v1/orders',
        success: true,
        message: 'Endpoint /api/v1/orders responded successfully',
        data: [{ id: 'order1' }],
      });

      // Check third endpoint result (pending buy orders - should fail)
      expect(results[2]).toEqual({
        name: 'Pending Buy Orders',
        endpoint: '/api/v1/approvals/pending',
        success: false,
        message: 'Error in testApiEndpoint(/api/v1/approvals/pending): Unauthorized',
        error: expect.any(Error),
      });

      // Verify API was called 3 times (once for each endpoint)
      expect(api.get).toHaveBeenCalledTimes(3);
    });
  });
});
