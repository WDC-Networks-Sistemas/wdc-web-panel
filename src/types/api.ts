/**
 * API request options interface
 */
export interface ApiRequestOptions<TParams = Record<string, any>, THeaders = Record<string, any>> {
    params?: TParams;
    headers?: THeaders;
    /**
     * Whether to include the auth token in the request
     * Defaults to true
     */
    useAuth?: boolean;
}

/**
 * Extended Error interface for API errors
 */
export interface ApiError extends Error {
    statusCode?: number;
    details?: any;
}

/**
 * Base API response interface
 */
export interface ApiResponse<T> {
    data: T;
    success: boolean;
    message?: string;
    timestamp?: string;
    meta?: {
        page?: number;
        pageSize?: number;
        totalCount?: number;
        totalPages?: number;
    };
}
