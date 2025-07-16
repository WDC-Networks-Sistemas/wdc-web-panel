import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { kanbanService } from '../services/kanbanService';
import { KanbanBoardData, KanbanCardItem, KanbanFilters } from '../types/kanban';

/**
 * Hook to fetch kanban board data
 */
export function useKanbanBoard(filters?: KanbanFilters) {
  return useQuery<KanbanBoardData>({
    queryKey: ['kanbanBoard', filters],
    queryFn: () => kanbanService.getKanbanBoard(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}

/**
 * Hook to fetch details for a specific kanban card
 */
export function useKanbanCardDetails(cardId: string, tenantId?: string) {
  return useQuery<KanbanCardItem>({
    queryKey: ['kanbanCard', cardId, tenantId],
    queryFn: () => kanbanService.getKanbanCard(cardId, tenantId),
    enabled: Boolean(cardId),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}

/**
 * Hook to update a kanban card's status
 */
export function useUpdateKanbanCardStatus() {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    Error,
    {
      cardId: string;
      newStatus: string;
      reason?: string;
      approverCode?: string;
      tenantId?: string;
    }
  >({
    mutationFn: async ({ cardId, newStatus, reason, approverCode, tenantId }) => {
      if (newStatus === 'rejected' && !reason) {
        throw new Error('Reason is required for rejection');
      }

      await kanbanService.updateCardStatus(cardId, newStatus, reason, approverCode, tenantId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kanbanBoard'] });
      queryClient.invalidateQueries({ queryKey: ['kanbanCard'] });
    },
  });
}

/**
 * Hook to move a card between columns
 */
export function useMoveKanbanCard() {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    Error,
    {
      cardId: string;
      sourceColumn: string;
      targetColumn: string;
      tenantId?: string;
    }
  >({
    mutationFn: async ({ cardId, sourceColumn, targetColumn, tenantId }) => {
      await kanbanService.moveCard(cardId, sourceColumn, targetColumn, tenantId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kanbanBoard'] });
    },
  });
}
