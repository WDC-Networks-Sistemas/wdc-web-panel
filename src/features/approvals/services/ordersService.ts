export const ordersService = {
    getPendingOrders: (params: GetPendingOrdersParams) => {...},
    approveOrder: (orderId: string, approverCode: string, tenantId: string) => {...},
    rejectOrder: (orderId: string, approverCode: string, tenantId: string, reason: string) => {...}
};