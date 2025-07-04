import { ApiRequestOptions, ApiError } from '@/types/api';
import { env } from '@/lib/env';
import { getAuthHeaders } from '@/lib/auth';

const API_BASE_URL = env.apiBaseUrl;

    /**
     * Helper function to implement fetch with timeout
     */
    async function fetchWithTimeout(url: string, options: RequestInit, timeout: number): Promise<Response> {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(url, {
        ...options,
        signal: controller.signal
    });

    clearTimeout(id);
    return response;
    }

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url: string = `${API_BASE_URL}${endpoint}`;

    // Include authentication headers by default
    const authHeaders = getAuthHeaders();

    const config: RequestInit = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...authHeaders,
            ...options.headers,
        },
        ...options
    };

    try {
        const response = await fetchWithTimeout(url, config, env.apiTimeout);

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            const error: ApiError = new Error(
                errorData?.message || `API Error: ${response.status} ${response.statusText}`
            );
            error.statusCode = response.status;
            error.details = errorData;
            throw error;
        }

        // Handle empty responses
        const text = await response.text();
        if (!text) {
            return {} as T;
        }

        return JSON.parse(text) as T;
    } catch (error) {
        if (error instanceof Error && 'statusCode' in error) {
            throw error; // Rethrow ApiError
        }
        // Network errors or other unexpected errors
        throw new Error(`Network error: ${(error as Error).message}`);
    }
}

export const api = {
    get: <T, TParams = Record<string, any>, THeaders = Record<string, any>>(
        endpoint: string, 
        options?: ApiRequestOptions<TParams, THeaders>
    ) => {
        let url = endpoint;
        const requestOptions: RequestInit = {};

        if (options?.params) {
            const searchParams = new URLSearchParams(options.params as any);
            url += `?${searchParams.toString()}`;
        }

        // Add auth headers by default unless explicitly disabled
        if (options?.useAuth !== false) {
            requestOptions.headers = {
                ...getAuthHeaders(),
                ...(options?.headers as HeadersInit || {})
            };
        } else if (options?.headers) {
            requestOptions.headers = options.headers as HeadersInit;
        }

        return apiRequest<T>(url, requestOptions);
    },

    post: <T, TParams = Record<string, any>, THeaders = Record<string, any>>(
        endpoint: string, 
        body: any, 
        options?: ApiRequestOptions<TParams, THeaders>
    ) => {
        let url = endpoint;
        const requestOptions: RequestInit = {
            method: 'POST',
            body: JSON.stringify(body)
        };

        if (options?.params) {
            const searchParams = new URLSearchParams(options.params as any);
            url += `?${searchParams.toString()}`;
        }

        // Add auth headers by default unless explicitly disabled
        if (options?.useAuth !== false) {
            requestOptions.headers = {
                ...getAuthHeaders(),
                ...(options?.headers as HeadersInit || {})
            };
        } else if (options?.headers) {
            requestOptions.headers = options.headers as HeadersInit;
        }

        return apiRequest<T>(url, requestOptions);
    },

    put: <T, TParams = Record<string, any>, THeaders = Record<string, any>>(
        endpoint: string, 
        body: any, 
        options?: ApiRequestOptions<TParams, THeaders>
    ) => {
        let url = endpoint;
        const requestOptions: RequestInit = {
            method: 'PUT',
            body: JSON.stringify(body)
        };

        if (options?.params) {
            const searchParams = new URLSearchParams(options.params as any);
            url += `?${searchParams.toString()}`;
        }

        // Add auth headers by default unless explicitly disabled
        if (options?.useAuth !== false) {
            requestOptions.headers = {
                ...getAuthHeaders(),
                ...(options?.headers as HeadersInit || {})
            };
        } else if (options?.headers) {
            requestOptions.headers = options.headers as HeadersInit;
        }

        return apiRequest<T>(url, requestOptions);
    },

    delete: <T, TParams = Record<string, any>, THeaders = Record<string, any>>(
        endpoint: string, 
        options?: ApiRequestOptions<TParams, THeaders>
    ) => {
        let url = endpoint;
        const requestOptions: RequestInit = {
            method: 'DELETE'
        };

        if (options?.params) {
            const searchParams = new URLSearchParams(options.params as any);
            url += `?${searchParams.toString()}`;
        }

        // Add auth headers by default unless explicitly disabled
        if (options?.useAuth !== false) {
            requestOptions.headers = {
                ...getAuthHeaders(),
                ...(options?.headers as HeadersInit || {})
            };
        } else if (options?.headers) {
            requestOptions.headers = options.headers as HeadersInit;
        }

        return apiRequest<T>(url, requestOptions);
    },
}