import { api } from '@/shared/services/api';
import { KanbanBoardData, KanbanCardItem, KanbanFilters } from '../types/kanban';

export const kanbanService = {
  async getKanbanBoard(filters?: KanbanFilters): Promise<KanbanBoardData> {
    const params: Record<string, any> = {};

    if (filters?.searchQuery) params.query = filters.searchQuery;
    if (filters?.dateRange?.from) {
      params.startDate = filters.dateRange.from.toISOString().split('T')[0];
    }
    if (filters?.dateRange?.to) {
      params.endDate = filters.dateRange.to.toISOString().split('T')[0];
    }
    if (filters?.branchId) params.branchId = filters.branchId;

    const headers: Record<string, string> = {};
    if (filters?.tenantId) {
      headers['x-tenant-id'] = filters.tenantId;
    }

    return api.get<KanbanBoardData>('/api/v1/kanban/board', { params, headers });
  },

  async getKanbanCard(cardId: string, tenantId?: string): Promise<KanbanCardItem> {
    const headers: Record<string, string> = {};
    if (tenantId) {
      headers['x-tenant-id'] = tenantId;
    }

    return api.get<KanbanCardItem>(`/api/v1/kanban/cards/${cardId}`, { headers });
  },

  async updateCardStatus(cardId: string, newStatus: string, reason?: string, approverCode?: string, tenantId?: string): Promise<void> {
    const endpoint = newStatus === 'rejected' 
      ? '/api/v1/kanban/cards/reject' 
      : '/api/v1/kanban/cards/approve';

    const headers: Record<string, string> = {};
    if (tenantId) {
      headers['x-tenant-id'] = tenantId;
    }

    await api.post(endpoint, {
      cardId,
      reason,
      approverCode: approverCode || 'default',
    }, { headers });
  },

  async moveCard(cardId: string, sourceColumn: string, targetColumn: string, tenantId?: string): Promise<void> {
    const headers: Record<string, string> = {};
    if (tenantId) {
      headers['x-tenant-id'] = tenantId;
    }

    await api.post('/api/v1/kanban/cards/move', {
      cardId,
      sourceColumn,
      targetColumn,
    }, { headers });
  },
};
