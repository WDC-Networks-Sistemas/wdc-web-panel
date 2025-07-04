import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { APPROVAL_STATUS_UI as APPROVAL_STATUS } from '@/constants/statusTypes';
import { Order } from '@/types/order';

/**
 * Hook to fetch orders with filters
 */
export function useOrders(filters?: {
  status?: string;
  searchQuery?: string;
  dateRange?: { from?: Date; to?: Date };
  tenantId?: string;
}) {
  return useQuery<Order[]>({
    queryKey: ['orders', filters],
    queryFn: async () => {
      const params: Record<string, any> = {};

      if (filters?.status) {
        params.status = filters.status;
      }

      if (filters?.searchQuery) {
        params.query = filters.searchQuery;
      }

      if (filters?.dateRange?.from) {
        params.startDate = filters.dateRange.from.toISOString().split('T')[0]; // YYYY-MM-DD
      }

      if (filters?.dateRange?.to) {
        params.endDate = filters.dateRange.to.toISOString().split('T')[0]; // YYYY-MM-DD
      }

      const headers: Record<string, string> = {};

      if (filters?.tenantId) {
        headers['x-tenant-id'] = filters.tenantId;
      }

      try {
        return await api.get<Order[]>('/api/v1/orders', { 
          params,
          headers
        });
      } catch (error) {
        console.error('Error fetching orders:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2
  });
}

/**
 * Hook to fetch a single order by ID
 */
export function useOrder(id: string, tenantId?: string) {
  return useQuery<Order>({
    queryKey: ['order', id, tenantId],
    queryFn: async () => {
      const headers: Record<string, string> = {};

      if (tenantId) {
        headers['x-tenant-id'] = tenantId;
      }

      try {
        return await api.get<Order>(`/api/v1/orders/${id}`, { headers });
      } catch (error) {
        console.error(`Error fetching order ${id}:`, error);
        throw error;
      }
    },
    enabled: Boolean(id),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2
  });
}

/**
 * Hook to update order status
 */
export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { id: string; status: string; reason?: string; tenantId?: string; approverCode?: string }>({
    mutationFn: async ({ id, status, reason, tenantId, approverCode }) => {
      const endpoint = status === APPROVAL_STATUS.REJECTED
        ? '/api/v1/orders/reject'
        : '/api/v1/orders/approve';

      const headers: Record<string, string> = {};

      if (tenantId) {
        headers['x-tenant-id'] = tenantId;
      }

      try {
        await api.post(endpoint, { 
          orderId: id,
          reason,
          approverCode: approverCode || 'default'
        }, {
          headers
        });
      } catch (error) {
        console.error(`Error updating order ${id} status to ${status}:`, error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order'] });
      queryClient.invalidateQueries({ queryKey: ['kanbanBoard'] });
    }
  });
}
