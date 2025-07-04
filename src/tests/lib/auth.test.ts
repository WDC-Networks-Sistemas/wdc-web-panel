import { getAuthToken, isAuthenticated, getAuthHeaders, parseJwt } from '@/lib/auth';
import { env } from '@/lib/env';

// Mock environment variables
jest.mock('@/lib/env', () => ({
  env: {
    authToken: 'test-token',
  },
}));

describe('Auth Module', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAuthToken', () => {
    it('should return the token from environment', () => {
      const token = getAuthToken();
      expect(token).toBe('test-token');
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when token exists', () => {
      expect(isAuthenticated()).toBe(true);
    });

    it('should return false when token does not exist', () => {
      // Temporarily mock env to return null token
      jest.spyOn(env, 'authToken', 'get').mockReturnValueOnce(null);
      expect(isAuthenticated()).toBe(false);
    });
  });

  describe('getAuthHeaders', () => {
    it('should return headers with authorization token', () => {
      const headers = getAuthHeaders();
      expect(headers).toEqual({
        'Authorization': 'Bearer test-token',
      });
    });

    it('should return empty headers when no token exists', () => {
      // Temporarily mock getAuthToken to return null
      jest.spyOn({ getAuthToken }, 'getAuthToken').mockReturnValueOnce(null);
      const headers = getAuthHeaders();
      expect(headers).toEqual({});
    });
  });

  describe('parseJwt', () => {
    it('should correctly parse a valid JWT token', () => {
      // This is a sample JWT token with the payload: { "sub": "1234567890", "name": "Test User", "iat": 1516239022 }
      const sampleToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlRlc3QgVXNlciIsImlhdCI6MTUxNjIzOTAyMn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

      const parsed = parseJwt(sampleToken);
      expect(parsed).toEqual({
        sub: '1234567890',
        name: 'Test User',
        iat: 1516239022,
      });
    });

    it('should return null for invalid tokens', () => {
      const invalidToken = 'invalid-token';
      const parsed = parseJwt(invalidToken);
      expect(parsed).toBeNull();
    });

    it('should return null for empty tokens', () => {
      const parsed = parseJwt('');
      expect(parsed).toBeNull();
    });
  });
});
