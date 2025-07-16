import { getAuthToken } from '../utils/auth';

interface ApiError extends Error {
  statusCode?: number;
  details?: any;
}

interface RequestOptions {
  params?: Record<string, any>;
  headers?: Record<string, string>;
}

export class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = process.env.NEXT_PUBLIC_API_URL || '') {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const token = getAuthToken();

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        const apiError = new Error(error.message || `API Error: ${response.status} ${response.statusText}`) as ApiError;
        apiError.statusCode = response.status;
        apiError.details = error;
        throw apiError;
      }

      // Handle empty responses
      if (response.status === 204) {
        return {} as T;
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Unknown error occurred');
    }
  }

  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    const searchParams = new URLSearchParams();

    if (options?.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
    }

    const url = searchParams.toString() ? `${endpoint}?${searchParams}` : endpoint;

    return this.request<T>(url, {
      method: 'GET',
      headers: options?.headers,
    });
  }

  async post<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: options?.headers,
    });
  }

  async put<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: options?.headers,
    });
  }

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
      headers: options?.headers,
    });
  }
}

export const api = new ApiClient();
