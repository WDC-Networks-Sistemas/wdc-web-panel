import { api } from '@/lib/api';
import { getAuthHeaders } from '@/lib/auth';
import { env } from '@/lib/env';

// Mock fetch function
global.fetch = jest.fn();

// Mock the auth module
jest.mock('@/lib/auth', () => ({
  getAuthHeaders: jest.fn().mockReturnValue({
    'Authorization': 'Bearer test-token',
  }),
}));

// Mock environment variables
jest.mock('@/lib/env', () => ({
  env: {
    apiBaseUrl: 'https://api.example.com',
    apiTimeout: 5000,
  },
}));

describe('API Module', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('api.get', () => {
    it('should make a GET request with correct parameters', async () => {
      // Mock successful response
      const mockResponse = {
        ok: true,
        text: jest.fn().mockResolvedValue(JSON.stringify({ data: 'test' })),
      };
      (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

      // Call the API
      const result = await api.get('/test-endpoint', {
        params: { id: '123', filter: 'active' },
        headers: { 'Custom-Header': 'test-value' },
      });

      // Check that fetch was called with correct parameters
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/test-endpoint?id=123&filter=active',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer test-token',
            'Custom-Header': 'test-value',
          }),
        })
      );

      // Check the result
      expect(result).toEqual({ data: 'test' });
    });

    it('should handle empty response', async () => {
      // Mock empty response
      const mockResponse = {
        ok: true,
        text: jest.fn().mockResolvedValue(''),
      };
      (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

      // Call the API
      const result = await api.get('/test-endpoint');

      // Check the result is an empty object
      expect(result).toEqual({});
    });

    it('should handle API errors', async () => {
      // Mock error response
      const mockResponse = {
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: jest.fn().mockResolvedValue({ message: 'Resource not found' }),
      };
      (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

      // Call the API and expect it to throw
      await expect(api.get('/test-endpoint')).rejects.toThrow('API Error: 404 Not Found');

      // Check that the error has the correct properties
      try {
        await api.get('/test-endpoint');
      } catch (error) {
        expect(error).toHaveProperty('statusCode', 404);
        expect(error).toHaveProperty('details', { message: 'Resource not found' });
      }
    });

    it('should handle network errors', async () => {
      // Mock network error
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network failure'));

      // Call the API and expect it to throw
      await expect(api.get('/test-endpoint')).rejects.toThrow('Network error: Network failure');
    });

    it('should not include auth headers when useAuth is false', async () => {
      // Mock successful response
      const mockResponse = {
        ok: true,
        text: jest.fn().mockResolvedValue(JSON.stringify({ data: 'test' })),
      };
      (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

      // Call the API with useAuth: false
      await api.get('/test-endpoint', {
        useAuth: false,
        headers: { 'Custom-Header': 'test-value' },
      });

      // Check that fetch was called without auth headers
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/test-endpoint',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Custom-Header': 'test-value',
          }),
        })
      );

      // Verify that the auth headers are not included
      const fetchCall = (global.fetch as jest.Mock).mock.calls[0][1];
      expect(fetchCall.headers).not.toHaveProperty('Authorization');
    });
  });

  describe('api.post', () => {
    it('should make a POST request with correct parameters', async () => {
      // Mock successful response
      const mockResponse = {
        ok: true,
        text: jest.fn().mockResolvedValue(JSON.stringify({ id: '123', success: true })),
      };
      (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

      // Call the API
      const result = await api.post(
        '/test-endpoint',
        { name: 'Test', value: 42 },
        {
          params: { action: 'create' },
          headers: { 'Custom-Header': 'test-value' },
        }
      );

      // Check that fetch was called with correct parameters
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/test-endpoint?action=create',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ name: 'Test', value: 42 }),
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer test-token',
            'Custom-Header': 'test-value',
          }),
        })
      );

      // Check the result
      expect(result).toEqual({ id: '123', success: true });
    });

    it('should handle empty body', async () => {
      // Mock successful response
      const mockResponse = {
        ok: true,
        text: jest.fn().mockResolvedValue(JSON.stringify({ success: true })),
      };
      (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

      // Call the API with null body
      await api.post('/test-endpoint', null);

      // Check that fetch was called with correct parameters
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/test-endpoint',
        expect.objectContaining({
          method: 'POST',
          body: 'null', // Stringified null
        })
      );
    });
  });

  describe('api.put', () => {
    it('should make a PUT request with correct parameters', async () => {
      // Mock successful response
      const mockResponse = {
        ok: true,
        text: jest.fn().mockResolvedValue(JSON.stringify({ id: '123', updated: true })),
      };
      (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

      // Call the API
      const result = await api.put(
        '/test-endpoint/123',
        { name: 'Updated Test', value: 99 },
        {
          headers: { 'Custom-Header': 'test-value' },
        }
      );

      // Check that fetch was called with correct parameters
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/test-endpoint/123',
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify({ name: 'Updated Test', value: 99 }),
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer test-token',
            'Custom-Header': 'test-value',
          }),
        })
      );

      // Check the result
      expect(result).toEqual({ id: '123', updated: true });
    });
  });

  describe('api.delete', () => {
    it('should make a DELETE request with correct parameters', async () => {
      // Mock successful response
      const mockResponse = {
        ok: true,
        text: jest.fn().mockResolvedValue(JSON.stringify({ success: true })),
      };
      (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

      // Call the API
      const result = await api.delete('/test-endpoint/123', {
        params: { permanent: 'true' },
        headers: { 'Custom-Header': 'test-value' },
      });

      // Check that fetch was called with correct parameters
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/test-endpoint/123?permanent=true',
        expect.objectContaining({
          method: 'DELETE',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer test-token',
            'Custom-Header': 'test-value',
          }),
        })
      );

      // Check the result
      expect(result).toEqual({ success: true });
    });
  });
});
