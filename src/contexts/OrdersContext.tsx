'use client'
import React, { createContext, useState, useContext, ReactNode, useMemo, useCallback } from 'react';
import { APPROVAL_STATUS } from '@/constants/approvalStatus';
import { useGetPendingBuyOrders, usePurchaseOrderApproval, usePurchaseOrderRejection } from '@/hooks/use-api';
import { useAuth } from '@/hooks/use-auth';

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

interface DateRange {
  from?: Date;
  to?: Date;
}

interface PaginationConfig {
  pageSize: number;
  currentPage: number;
  totalItems: number;
  totalPages: number;
}

interface OrdersContextType {
  orders: Order[];
  isLoading: boolean;
  error: Error | null;
  refreshOrders: () => void;
  approveOrder: (orderId: string, approverCode: string, tenantId: string) => Promise<void>;
  rejectOrder: (orderId: string, approverCode: string, tenantId: string, reason: string) => Promise<void>;
  selectedOrder: Order | null;
  setSelectedOrder: (order: Order | null) => void;
  getOrderById: (id: string) => Order | undefined;
  pagination: PaginationConfig;
  paginatedOrders: Order[];
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  filteredOrders: (status?: Order['status']) => Order[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
  resetFilters: () => void;
  filteredBySearchAndDate: Order[];
  // Branch/Tenant filtering
  selectedTenant: string;
  setSelectedTenant: (tenantId: string) => void;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export const useOrders = () => {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrdersProvider');
  }
  return context;
};

interface OrdersProviderProps {
  children: ReactNode;
}

export const OrdersProvider: React.FC<OrdersProviderProps> = ({ children }) => {
  // Get user data from our custom auth hook
  const { userInfo, isAuthenticated } = useAuth();
  const userEmail = userInfo?.email || '';
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  
  // Tenant/branch selection (defaults to '01,01' if none selected)
  const [selectedTenant, setSelectedTenant] = useState<string>('01,01');
  
  // Date range for filtering
  const today = new Date();
  const twoWeeksAgo = new Date(today);
  twoWeeksAgo.setDate(today.getDate() - 15);
  
  const formatDateForApi = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  // Filtering state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dateRange, setDateRange] = useState<DateRange>({
    from: twoWeeksAgo,
    to: today
  });
  
  // Order selection state
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  // API hooks
  const { 
    data: pendingBuyOrdersData, 
    isLoading, 
    error,
    refetch: refreshOrders 
  } = useGetPendingBuyOrders({
    UserEmail: userEmail,
    DateStart: dateRange.from ? formatDateForApi(dateRange.from) : formatDateForApi(twoWeeksAgo),
    DateEnd: dateRange.to ? formatDateForApi(dateRange.to) : formatDateForApi(today),
    Types: APPROVAL_STATUS.PENDING, // Default to pending
    TenantId: selectedTenant
  });
  
  // Mutations for approvals and rejections
  const purchaseOrderApproval = usePurchaseOrderApproval();
  const purchaseOrderRejection = usePurchaseOrderRejection();

  // Transform API data to our Order interface
  const orders = useMemo(() => {
    if (!pendingBuyOrdersData?.Approval) return [];
    
    const transformedOrders: Order[] = [];
    
    pendingBuyOrdersData.Approval.forEach(branch => {
      branch.Issues.forEach(issue => {
        transformedOrders.push({
          id: issue.Document,
          orderNumber: issue.Document,
          customer: issue.NameGroup || 'Unknown',
          email: branch.UserEmail,
          amount: issue.Amount,
          status: issue.StatusCode,
          date: issue.Emission,
          branchId: branch.BranchCode,
          branchCode: branch.BranchCode,
          branchName: branch.BranchName,
          approverCode: branch.ApproverCode,
          type: issue.Type,
          level: issue.Level,
          observations: issue.Observations
        });
      });
    });
    
    return transformedOrders;
  }, [pendingBuyOrdersData]);

  // Handler for page size changes that also resets the current page
  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  // Find an order by ID
  const getOrderById = useCallback((id: string) => {
    return orders.find(order => order.id === id);
  }, [orders]);
  
  // Filter orders by search query and date range
  const filteredBySearchAndDate = useMemo(() => {
    return orders.filter(order => {
      // Search filter
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = !searchQuery || 
        order.id.toLowerCase().includes(searchLower) ||
        order.customer.toLowerCase().includes(searchLower) ||
        order.branchName.toLowerCase().includes(searchLower);
      
      // Date filter
      const orderDate = new Date(order.date);
      const matchesDateFrom = !dateRange.from || orderDate >= dateRange.from;
      const matchesDateTo = !dateRange.to || orderDate <= dateRange.to;
      
      return matchesSearch && matchesDateFrom && matchesDateTo;
    });
  }, [orders, searchQuery, dateRange]);
  
  // Filter orders by status
  const filteredOrders = useCallback((status?: string) => {
    if (!status) return filteredBySearchAndDate;
    return filteredBySearchAndDate.filter(order => order.status === status);
  }, [filteredBySearchAndDate]);
  
  // Pagination logic
  const totalItems = filteredBySearchAndDate.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  
  // Get paginated orders
  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredBySearchAndDate.slice(startIndex, startIndex + pageSize);
  }, [filteredBySearchAndDate, currentPage, pageSize]);
  
  // Pagination config object
  const pagination = useMemo(() => ({
    pageSize,
    currentPage,
    totalItems,
    totalPages
  }), [pageSize, currentPage, totalItems, totalPages]);

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setDateRange({ from: twoWeeksAgo, to: today });
    setCurrentPage(1);
  };
  
  // Approve an order
  const approveOrder = async (orderId: string, approverCode: string, tenantId: string) => {
    try {
      await purchaseOrderApproval.mutateAsync({
        orderId,
        approverCode,
        tenantId
      });
      
      // Refresh the orders list after approval
      refreshOrders();
    } catch (error) {
      console.error('Error approving order:', error);
      throw error;
    }
  };
  
  // Reject an order with reason
  const rejectOrder = async (orderId: string, approverCode: string, tenantId: string, reason: string) => {
    try {
      await purchaseOrderRejection.mutateAsync({
        orderId,
        approverCode,
        tenantId,
        reason
      });
      
      // Refresh the orders list after rejection
      refreshOrders();
    } catch (error) {
      console.error('Error rejecting order:', error);
      throw error;
    }
  };

  return (
    <OrdersContext.Provider value={{
      orders,
      isLoading,
      error,
      refreshOrders,
      approveOrder,
      rejectOrder,
      selectedOrder,
      setSelectedOrder,
      getOrderById,
      pagination,
      paginatedOrders,
      setCurrentPage,
      setPageSize: handlePageSizeChange,
      filteredOrders,
      searchQuery,
      setSearchQuery,
      dateRange,
      setDateRange,
      resetFilters,
      filteredBySearchAndDate,
      selectedTenant,
      setSelectedTenant
    }}>
      {children}
    </OrdersContext.Provider>
  );
};