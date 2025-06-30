const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url: string = `${API_BASE_URL}${endpoint}`;

    const config: RequestInit = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        ...options
    };

    const response = await fetch(url, config);

    if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
}

export const api = {
    get: <T> (endpoint: string) => apiRequest<T>(endpoint),
    post: <T> (endpoint: string, body: JSON) => apiRequest<T>(endpoint, { method: 'POST', body: JSON.stringify(body) }),
    put: <T> (endpoint: string, body: JSON) => apiRequest<T>(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
    delete: <T> (endpoint: string) => apiRequest<T>(endpoint, { method: 'DELETE' }),
}