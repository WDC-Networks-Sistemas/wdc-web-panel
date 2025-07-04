// Configure jest-dom extensions
import '@testing-library/jest-dom';

// Polyfill for TextEncoder/TextDecoder used in JWT parsing
global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;

// Mock fetch globally
global.fetch = jest.fn();
global.AbortController = jest.fn(() => ({
  abort: jest.fn(),
  signal: {}
})) as any;

// Mock localStorage
class LocalStorageMock {
  private store: Record<string, string> = {};

  clear() {
    this.store = {};
  }

  getItem(key: string) {
    return this.store[key] || null;
  }

  setItem(key: string, value: string) {
    this.store[key] = String(value);
  }

  removeItem(key: string) {
    delete this.store[key];
  }
}

global.localStorage = new LocalStorageMock() as any;

// Mock environment variables
process.env = {
  ...process.env,
  NEXT_PUBLIC_API_BASE_URL: 'http://172.19.1.31:26501/rest01/',
  NEXT_PUBLIC_DEFAULT_TENANT_ID: '01',
  NEXT_PUBLIC_DEFAULT_APPROVER_CODE: 'TEST001',
  NEXT_PUBLIC_API_TIMEOUT: '5000',
  NEXT_PUBLIC_ENVIRONMENT: 'test',
  NEXT_PUBLIC_AUTH_TOKEN: 'test-token',
};

// Mock timers
jest.useFakeTimers();

// Suppress console errors/warnings during tests
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

console.error = (...args: any[]) => {
  // Check if this is a React warning/error we want to silence during tests
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('Warning:') || args[0].includes('Error:'))
  ) {
    return;
  }
  originalConsoleError(...args);
};

console.warn = (...args: any[]) => {
  // Check if this is a React warning we want to silence during tests
  if (typeof args[0] === 'string' && args[0].includes('Warning:')) {
    return;
  }
  originalConsoleWarn(...args);
};

// Cleanup after tests
afterAll(() => {
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
  jest.useRealTimers();
});
