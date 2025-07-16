import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useMemo } from 'react';
import { ordersService } from '../services/ordersService';
import { Order, DateRange, OrderFilters } from '../types/orders';

export function useOrders() {
  const queryClient = useQueryClient();

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState<DateRange>({ from: undefined, to: undefined });
  const [selectedTenant, setSelectedTenant] = useState('01,01');
  const [branches, setBranches] = useState(['01,01'])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Build filters object for the query
  const filters: OrderFilters = useMemo(() => ({
    searchQuery,
    dateRange,
    tenantId: selectedTenant
  }), [searchQuery, dateRange, selectedTenant]);

  // Fetch orders using React Query with proper filters
  const ordersQuery = useQuery<Order[]>({
    queryKey: ['orders', filters],
    queryFn: () => ordersService.getOrders(filters),
    staleTime: 5 * 60 * 1000,
    retry: 2
  });

  // Extract orders from query result
  const orders = ordersQuery.data || [];

  // Apply additional client-side filtering if needed
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      // Search filter (additional client-side filtering)
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch =
            order.id.toLowerCase().includes(searchLower) ||
            order.customer.toLowerCase().includes(searchLower) ||
            (order.branchName && order.branchName.toLowerCase().includes(searchLower));

        if (!matchesSearch) return false;
      }

      return true;
    });
  }, [orders, searchQuery]);

  // Function to get filtered orders by status
  const getFilteredOrdersByStatus = (status: string) => {
    return filteredOrders.filter(order => order.status === status);
  };

  const getCustomerOrders = (customerEmail: string) => {
    return filteredOrders.filter(order => order.email === customerEmail);
  };

  const getOrdersByBranch = (branchId: string) => {
    return filteredOrders.filter(order => order.branchId === branchId);
  }


  // Pagination
  const totalItems = filteredOrders.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + pageSize);

  // Mutations - using updateOrderStatus from the service
  const approveMutation = useMutation({
    mutationFn: ({ orderId, approverCode, tenantId }: { orderId: string; approverCode: string; tenantId: string }) =>
        ordersService.updateOrderStatus(orderId, 'approved', undefined, approverCode, tenantId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    }
  });

  const rejectMutation = useMutation({
    mutationFn: ({ orderId, approverCode, tenantId, reason }: { orderId: string; approverCode: string; tenantId: string; reason: string }) =>
        ordersService.updateOrderStatus(orderId, 'rejected', reason, approverCode, tenantId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    }
  });

  // Actions
  const approveOrder = async (orderId: string, approverCode: string, tenantId: string) => {
    return approveMutation.mutateAsync({ orderId, approverCode, tenantId });
  };

  const rejectOrder = async (orderId: string, approverCode: string, tenantId: string, reason: string) => {
    return rejectMutation.mutateAsync({ orderId, approverCode, tenantId, reason });
  };

  const resetFilters = () => {
    setSearchQuery('');
    setDateRange({ from: undefined, to: undefined });
    setSelectedTenant('01,01');
    setCurrentPage(1);
  };

  const pagination = {
    currentPage,
    totalPages,
    totalItems,
    pageSize,
    setCurrentPage,
    setPageSize
  };

  return {
    // Data
    orders,
    filteredOrders,
    paginatedOrders,
    selectedOrder,
    branches,

    // Loading states
    isLoading: ordersQuery.isLoading,
    isError: ordersQuery.isError,
    error: ordersQuery.error,

    // Filters
    searchQuery,
    dateRange,
    selectedTenant,

    // Filter setters
    setSearchQuery,
    setBranches,
    setDateRange,
    setSelectedTenant,
    setSelectedOrder,

    // Actions
    approveOrder,
    rejectOrder,
    resetFilters,

    // Helper functions
    getFilteredOrdersByStatus,
    getCustomerOrders,
    getOrdersByBranch,

    // Pagination
    pagination
  };
}