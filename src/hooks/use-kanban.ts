import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { APPROVAL_STATUS_UI as APPROVAL_STATUS } from '@/constants/statusTypes';
import { KanbanCardItem, KanbanBoardData } from '@/types/kanban';

/**
 * Hook to fetch kanban board data
 */
export function useKanbanBoard(filters?: {
  searchQuery?: string;
  dateRange?: { from?: Date; to?: Date };
  branchId?: string;
  tenantId?: string;
}) {
  return useQuery<KanbanBoardData>({
    queryKey: ['kanbanBoard', filters],
    queryFn: async () => {
      const params: Record<string, any> = {};

      if (filters?.searchQuery) {
        params.query = filters.searchQuery;
      }

      if (filters?.dateRange?.from) {
        params.startDate = filters.dateRange.from.toISOString().split('T')[0]; // YYYY-MM-DD
      }

      if (filters?.dateRange?.to) {
        params.endDate = filters.dateRange.to.toISOString().split('T')[0]; // YYYY-MM-DD
      }

      if (filters?.branchId) {
        params.branchId = filters.branchId;
      }

      const headers: Record<string, string> = {};

      if (filters?.tenantId) {
        headers['x-tenant-id'] = filters.tenantId;
      }

      try {
        const response = await api.get<KanbanBoardData>('/api/v1/kanban/board', { 
          params,
          headers 
        });
        return response;
      } catch (error) {
        console.error('Error fetching kanban board data:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2
  });
}

/**
 * Hook to update a kanban card status
 */
export function useUpdateKanbanCardStatus() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { cardId: string; newStatus: string; reason?: string; tenantId?: string; approverCode?: string }>({
    mutationFn: async ({ cardId, newStatus, reason, tenantId, approverCode }) => {
      if (newStatus === APPROVAL_STATUS.REJECTED && !reason) {
        throw new Error('Reason is required for rejection');
      }

      const endpoint = newStatus === APPROVAL_STATUS.REJECTED
        ? '/api/v1/kanban/cards/reject'
        : '/api/v1/kanban/cards/approve';

      const headers: Record<string, string> = {};

      if (tenantId) {
        headers['x-tenant-id'] = tenantId;
      }

      try {
        await api.post(endpoint, { 
          cardId,
          reason,
          approverCode: approverCode || 'default'
        }, {
          headers
        });
      } catch (error) {
        console.error(`Error updating card ${cardId} status to ${newStatus}:`, error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kanbanBoard'] });
      queryClient.invalidateQueries({ queryKey: ['kanbanCard'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    }
  });
}

/**
 * Hook to get a specific kanban card details
 */
export function useKanbanCardDetails(cardId: string, tenantId?: string) {
  return useQuery<KanbanCardItem>({
    queryKey: ['kanbanCard', cardId, tenantId],
    queryFn: async () => {
      const headers: Record<string, string> = {};

      if (tenantId) {
        headers['x-tenant-id'] = tenantId;
      }

      try {
        return await api.get<KanbanCardItem>(`/api/v1/kanban/cards/${cardId}`, { headers });
      } catch (error) {
        console.error(`Error fetching kanban card ${cardId}:`, error);
        throw error;
      }
    },
    enabled: Boolean(cardId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2
  });
}
