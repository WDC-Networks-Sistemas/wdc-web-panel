import { api } from '@/shared/services/api';
import { Order, OrderFilters, PendingBuyOrdersParams, ApproveOrderParams, RejectOrderParams } from '../types/orders';
import { ordersApi } from '../api/ordersApi';

export const ordersService = {
  async getOrders(filters?: OrderFilters): Promise<Order[]> {
    const params: Record<string, any> = {};

    if (filters?.status) params.status = filters.status;
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

    // For now we're using the pending buy orders endpoint with filtering
    // but in a real implementation this would call a different endpoint
    const today = new Date();
    const twoWeeksAgo = new Date(today);
    twoWeeksAgo.setDate(today.getDate() - 15);

    return ordersApi.getPendingBuyOrders({
      UserEmail: '',  // This would come from auth in a real implementation
      DateStart: filters?.dateRange?.from?.toISOString().split('T')[0] || twoWeeksAgo.toISOString().split('T')[0],
      DateEnd: filters?.dateRange?.to?.toISOString().split('T')[0] || today.toISOString().split('T')[0],
      Types: filters?.status || '',
      TenantId: filters?.tenantId || '01,01'
    });
  },

  async getOrder(id: string, tenantId?: string): Promise<Order> {
    const headers: Record<string, string> = {};
    if (tenantId) {
      headers['x-tenant-id'] = tenantId;
    }

    return api.get<Order>(`/api/v1/orders/${id}`, { headers });
  },

  async updateOrderStatus(id: string, status: string, reason?: string, approverCode?: string, tenantId?: string): Promise<void> {
    if (status === 'rejected') {
      return ordersApi.rejectPurchaseOrder({
        orderId: id,
        approverCode: approverCode || 'default',
        tenantId: tenantId || '01,01',
        reason: reason || 'No reason provided'
      });
    } else {
      return ordersApi.approvePurchaseOrder({
        orderId: id,
        approverCode: approverCode || 'default',
        tenantId: tenantId || '01,01'
      });
    }
  },

  // Added for compatibility with the old context
  async getPendingBuyOrders(params: PendingBuyOrdersParams): Promise<Order[]> {
    return ordersApi.getPendingBuyOrders(params);
  },

  async approvePurchaseOrder(params: ApproveOrderParams): Promise<void> {
    return ordersApi.approvePurchaseOrder(params);
  },

  async rejectPurchaseOrder(params: RejectOrderParams): Promise<void> {
    return ordersApi.rejectPurchaseOrder(params);
  }
};
