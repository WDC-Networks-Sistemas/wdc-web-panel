import { api } from '@/lib/api';
import { handleApiError } from './error-handler';
import { getAuthHeaders } from '@/lib/auth';

/**
 * Test API connection with the provided token
 */
export async function testApiConnection() {
  try {
    // Simple health check endpoint
    const response = await api.get<{ status: string }>('/api/health', {
      headers: getAuthHeaders()
    });

    return {
      success: true,
      message: `API connection successful: ${response.status || 'OK'}`,
      data: response
    };
  } catch (error) {
    return {
      success: false,
      message: handleApiError('testApiConnection', error),
      error
    };
  }
}

/**
 * Test specific API endpoint
 */
export async function testApiEndpoint<T>(endpoint: string): Promise<{
  success: boolean;
  message: string;
  data?: T;
  error?: any;
}> {
  try {
    const response = await api.get<T>(endpoint, {
      headers: getAuthHeaders()
    });

    return {
      success: true,
      message: `Endpoint ${endpoint} responded successfully`,
      data: response
    };
  } catch (error) {
    return {
      success: false,
      message: handleApiError(`testApiEndpoint(${endpoint})`, error),
      error
    };
  }
}

/**
 * Run diagnostics on all API endpoints
 */
export async function runApiDiagnostics() {
  const testEndpoints = [
    { name: 'Health Check', endpoint: '/api/health' },
    { name: 'Orders', endpoint: '/api/v1/orders' },
    { name: 'Pending Buy Orders', endpoint: '/api/v1/approvals/pending' },
    // Add more endpoints to test
  ];

  const results = [];

  for (const test of testEndpoints) {
    const result = await testApiEndpoint(test.endpoint);
    results.push({
      name: test.name,
      endpoint: test.endpoint,
      ...result
    });
  }

  return results;
}
