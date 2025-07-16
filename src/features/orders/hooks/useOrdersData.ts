import { useCallback, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ordersService } from '../services/ordersService';
import { DateRange, Order, OrderFilters, PaginationConfig } from '../types/orders';
import { APPROVAL_STATUS } from '@/constants/approvalStatus';
import { useAuth } from '@/features/auth/hooks/useAuth';

export const useOrdersData = (initialFilters?: Partial<OrderFilters>) => {
  const { user } = useAuth();
  const userEmail = user?.email || '';

  // Date range defaults
  const today = new Date();
  const twoWeeksAgo = new Date(today);
  twoWeeksAgo.setDate(today.getDate() - 15);

  // State for filters and pagination
  const [searchQuery, setSearchQuery] = useState<string>(initialFilters?.searchQuery || '');
  const [dateRange, setDateRange] = useState<DateRange>({
    from: initialFilters?.dateRange?.from || twoWeeksAgo,
    to: initialFilters?.dateRange?.to || today
  });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const [selectedTenant, setSelectedTenant] = useState<string>(initialFilters?.tenantId || '01,01');
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(initialFilters?.status || APPROVAL_STATUS.PENDING);

  // Format dates for API
  const formatDateForApi = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  // Build filters for API request
  const filters: OrderFilters = useMemo(() => ({
    status: selectedStatus,
    searchQuery,
    dateRange,
    tenantId: selectedTenant
  }), [selectedStatus, searchQuery, dateRange, selectedTenant]);

  // Fetch orders using React Query
  const { 
    data: orders = [],
    isLoading,
    error,
    refetch: refreshOrders
  } = useQuery({
    queryKey: ['orders', filters],
    queryFn: () => ordersService.getOrders(filters)
  });

  // Filter orders client-side based on search query and date range
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
  const pagination: PaginationConfig = useMemo(() => ({
    pageSize,
    currentPage,
    totalItems,
    totalPages
  }), [pageSize, currentPage, totalItems, totalPages]);

  // Handler for page size changes that also resets the current page
  const setPageSizeWithReset = useCallback((newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
  }, []);

  // Find an order by ID
  const getOrderById = useCallback((id: string) => {
    return orders.find(order => order.id === id);
  }, [orders]);

  // Reset all filters
  const resetFilters = useCallback(() => {
    setSearchQuery('');
    setDateRange({ from: twoWeeksAgo, to: today });
    setCurrentPage(1);
    setSelectedStatus(APPROVAL_STATUS.PENDING);
  }, [twoWeeksAgo, today]);

  return {
    // Data
    orders,
    filteredBySearchAndDate,
    filteredOrders,
    paginatedOrders,

    // Loading state
    isLoading,
    error,
    refreshOrders,

    // Filter state and setters
    searchQuery,
    setSearchQuery,
    dateRange,
    setDateRange,
    selectedStatus,
    setSelectedStatus,
    selectedTenant,
    setSelectedTenant,
    resetFilters,

    // Pagination state and setters
    pagination,
    setCurrentPage,
    setPageSize: setPageSizeWithReset,

    // Utility functions
    getOrderById
  };
};
