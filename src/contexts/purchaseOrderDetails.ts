/**
 * Interface for getPurchaseOrderDetails API parameters
 */
export interface GetPurchaseOrderDetailsProps {
  /**
   * The ID of the purchase order to retrieve
   */
  OrderId: string;
  Type: string;

  /**
   * The tenant ID for the request header
   */
  TenantId: string;
}

/**
 * Interface for purchase order details response
 * (Extend this interface based on the actual API response structure)
 */
export interface PurchaseOrderItem{
  ItemId: string;
  ProductId: string;
  ProductDescription: string;
  PartNumber: string;
  Unit:  string;
  Amount: number;
  UnitPrice: number;
  TotalPrice: number;
  CostCenter: string;
  Accounting: string;
}

export interface PurchaseOrderDetails {
  BranchCode: string;
  OrderNumber: string;
  CreatedAt: string;
  SupplierCode: string
  SupplierBranch: string;
  SupplierName: string;
  ShortenedName: string;
  PaymentCode: string;
  PaymentDescription: string;
  TotalValue: number;
  BuyerCode: string;
  BuyerName: string;
  Items: PurchaseOrderItem[];
}