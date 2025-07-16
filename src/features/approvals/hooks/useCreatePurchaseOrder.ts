import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useApiClient } from '@/lib/api';
import { CreatePurchaseOrderDTO } from '../types/create-purchase-order';

export function useCreatePurchaseOrder() {
    const { request } = useApiClient();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreatePurchaseOrderDTO) =>
            request('/purchase-orders', {
                method: 'POST',
                body: JSON.stringify(data),
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['purchase-orders'] });
        },
    });
}
