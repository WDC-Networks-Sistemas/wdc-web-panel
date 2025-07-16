import { useQuery } from '@tanstack/react-query';
import { useApiClient } from '@/lib/api';

export function usePurchaseOrders() {
    const { request } = useApiClient();

    return useQuery({
        queryKey: ['purchase-orders'],
        queryFn: () => request('/purchase-orders'),
    });
}
