import { env } from './env';

/**
 * Get the current authentication token
 * In a real application, this would likely be stored in a more secure way
 * and refreshed when needed
 */
export function getAuthToken(): string | null {
  // Use token from environment for testing
  // In production, this would come from a secure storage or auth service
  return env.authToken;
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return Boolean(getAuthToken());
}

/**
 * Get standard authorization headers for API requests
 */
export function getAuthHeaders(): Record<string, string> {
  const token = getAuthToken();
  if (!token) {
    return {};
  }

  return {
    'Authorization': `Bearer ${token}`
  };
}

/**
 * Parse JWT token to get user info (for development only)
 * DO NOT use this in production for sensitive operations
 */
export function parseJwt(token: string): any {
  if (!token) return null;

  try {
    // Split the token and get the payload part
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

    // Decode the base64 string
    const jsonPayload = decodeURIComponent(
      atob(base64).split('').map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join('')
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error parsing JWT token:', error);
    return null;
  }
}
