import { useAuth } from '@/features/auth/hooks/useAuth';

export const useApiClient = () => {
    const { getAccessToken } = useAuth();

    const request = async (input: RequestInfo, init: RequestInit = {}) => {
        const token = await getAccessToken();

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${input}`, {
            ...init,
            headers: {
                ...init.headers,
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!res.ok) throw new Error(`Erro ${res.status}`);
        return res.json();
    };

    return { request };
};
