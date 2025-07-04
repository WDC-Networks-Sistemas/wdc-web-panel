/**
 * Parameter types for purchase order approval
 */
interface PurchaseOrderApprovalParams {
  orderId: string;
  approverCode: string;
  tenantId: string;
}

/**
 * Parameter types for purchase order rejection
 */
interface PurchaseOrderRejectionParams extends PurchaseOrderApprovalParams {
  reason: string;
}
