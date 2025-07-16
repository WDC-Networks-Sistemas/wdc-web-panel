import { api } from '@/shared/services/api';
import { Order, PendingBuyOrdersParams, ApproveOrderParams, RejectOrderParams } from '../types/orders';
import { orderAdapter } from '../adapters/orderAdapter';

export const ordersApi = {
  async getPendingBuyOrders(params: PendingBuyOrdersParams) {
    const response = await api.get('/api/v1/orders/pending', { 
      params: {
        userEmail: params.UserEmail,
        dateStart: params.DateStart,
        dateEnd: params.DateEnd,
        types: params.Types,
        tenantId: params.TenantId
      }
    });

    return orderAdapter.transformApiResponse(response);
  },

  async approvePurchaseOrder({ orderId, approverCode, tenantId }: ApproveOrderParams) {
    return api.post('/api/v1/orders/approve', {
      orderId,
      approverCode,
      tenantId
    });
  },

  async rejectPurchaseOrder({ orderId, approverCode, tenantId, reason }: RejectOrderParams) {
    return api.post('/api/v1/orders/reject', {
      orderId,
      approverCode,
      tenantId,
      reason
    });
  }
};
