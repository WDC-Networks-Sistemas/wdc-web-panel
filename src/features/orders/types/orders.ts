export interface Order {
  id: string;
  orderNumber: string;
  customer: string;
  email: string;
  amount: number;
  status: string;
  date: string;
  branchCode?: string;
  branchName?: string;
  items?: OrderItem[];
  shippingAddress?: Address;
  billingAddress?: Address;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}
export interface Order {
  id: string;                  // Document from API
  orderNumber: string;         // Document from API (formatted)
  customer: string;            // SupplierName or User details from API
  email: string;               // UserEmail from API
  amount: number;              // TotalValue or Amount from API
  status: string;              // StatusCode from API
  date: string;                // Emission or CreatedAt from API
  branchId: string;            // BranchCode
  branchCode: string;          // BranchCode
  branchName: string;          // BranchName
  approverCode?: string;       // ApproverCode
  type?: string;               // Type from API
  level?: string;              // Level from API
  observations?: string;       // Observations from API
  rejectionReason?: string;    // For storing rejection reasons
}

export interface DateRange {
  from?: Date;
  to?: Date;
}

export interface PaginationConfig {
  pageSize: number;
  currentPage: number;
  totalItems: number;
  totalPages: number;
}

export interface OrderFilters {
  status?: string;
  searchQuery?: string;
  dateRange?: DateRange;
  branchId?: string;
  tenantId?: string;
}

export interface PendingBuyOrdersParams {
  UserEmail: string;
  DateStart: string;
  DateEnd: string;
  Types: string;
  TenantId: string;
}

export interface ApproveOrderParams {
  orderId: string;
  approverCode: string;
  tenantId: string;
}

export interface RejectOrderParams extends ApproveOrderParams {
  reason: string;
}
export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface OrderFilters {
  status?: string;
  searchQuery?: string;
  dateRange?: {
    from?: Date;
    to?: Date;
  };
  branchId?: string;
  tenantId?: string;
}
