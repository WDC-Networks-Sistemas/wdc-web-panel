import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useOrders, useOrder, useUpdateOrderStatus } from '@/hooks/use-orders';
import { api } from '@/lib/api';
import { APPROVAL_STATUS_UI as APPROVAL_STATUS } from '@/constants/statusTypes';
import { Order } from '@/types/order';

// Mock the API module
jest.mock('@/lib/api', () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

// Sample data for tests
const mockOrders: Order[] = [
  {
    id: 'order-1',
    orderNumber: 'ORD-001',
    customer: 'Test Customer 1',
    email: 'customer1@example.com',
    amount: 1000.50,
    status: 'pending',
    date: '2025-06-15',
  },
  {
    id: 'order-2',
    orderNumber: 'ORD-002',
    customer: 'Test Customer 2',
    email: 'customer2@example.com',
    amount: 2500.75,
    status: 'approved',
    date: '2025-06-20',
  },
];

const mockSingleOrder: Order = mockOrders[0];

// Wrapper for React Query
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('Order Hooks', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('useOrders', () => {
    it('should fetch orders with no filters', async () => {
      // Mock API response
      (api.get as jest.Mock).mockResolvedValueOnce(mockOrders);

      const { result } = renderHook(() => useOrders(), {
        wrapper: createWrapper(),
      });

      // Initial state should be loading
      expect(result.current.isLoading).toBe(true);

      // Wait for the query to complete
      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // Check API was called correctly
      expect(api.get).toHaveBeenCalledWith('/api/v1/orders', {
        params: {},
        headers: {},
      });

      // Verify data
      expect(result.current.data).toEqual(mockOrders);
    });

    it('should fetch orders with filters', async () => {
      // Mock API response
      (api.get as jest.Mock).mockResolvedValueOnce(mockOrders);

      const filters = {
        status: 'pending',
        searchQuery: 'test',
        dateRange: {
          from: new Date('2025-06-01'),
          to: new Date('2025-06-30'),
        },
        tenantId: 'tenant-1',
      };

      const { result } = renderHook(() => useOrders(filters), {
        wrapper: createWrapper(),
      });

      // Wait for the query to complete
      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // Check API was called with correct parameters
      expect(api.get).toHaveBeenCalledWith('/api/v1/orders', {
        params: {
          status: 'pending',
          query: 'test',
          startDate: '2025-06-01',
          endDate: '2025-06-30',
        },
        headers: {
          'x-tenant-id': 'tenant-1',
        },
      });
    });

    it('should handle API errors', async () => {
      // Mock API error
      const mockError = new Error('Network error');
      (api.get as jest.Mock).mockRejectedValueOnce(mockError);

      const { result } = renderHook(() => useOrders(), {
        wrapper: createWrapper(),
      });

      // Wait for the query to fail
      await waitFor(() => expect(result.current.isError).toBe(true));

      // Check error
      expect(result.current.error).toBeDefined();
    });
  });

  describe('useOrder', () => {
    it('should fetch a single order by ID', async () => {
      // Mock API response
      (api.get as jest.Mock).mockResolvedValueOnce(mockSingleOrder);

      const orderId = 'order-1';
      const tenantId = 'tenant-1';

      const { result } = renderHook(() => useOrder(orderId, tenantId), {
        wrapper: createWrapper(),
      });

      // Wait for the query to complete
      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // Check API was called correctly
      expect(api.get).toHaveBeenCalledWith(`/api/v1/orders/${orderId}`, {
        headers: { 'x-tenant-id': tenantId },
      });

      // Verify data
      expect(result.current.data).toEqual(mockSingleOrder);
    });

    it('should not fetch when ID is not provided', async () => {
      const { result } = renderHook(() => useOrder(''), {
        wrapper: createWrapper(),
      });

      // Query should be disabled
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isFetching).toBe(false);

      // API should not be called
      expect(api.get).not.toHaveBeenCalled();
    });
  });

  describe('useUpdateOrderStatus', () => {
    it('should call approve endpoint with correct parameters', async () => {
      // Setup Jest spy
      jest.spyOn(api, 'post').mockResolvedValueOnce({});

      const { result } = renderHook(() => useUpdateOrderStatus(), {
        wrapper: createWrapper(),
      });

      const params = {
        id: 'order-1',
        status: APPROVAL_STATUS.APPROVED,
        approverCode: 'APR-001',
        tenantId: 'tenant-1',
      };

      // Execute the mutation with act
      act(() => {
        result.current.mutate(params);
      });

      // Wait for the mutation to complete using Jest's assertions
      await waitFor(() => expect(result.current.isSuccess).toBeTruthy());

      // Check API was called correctly
      expect(api.post).toHaveBeenCalledWith(
        '/api/v1/orders/approve',
        {
          orderId: 'order-1',
          reason: undefined,
          approverCode: 'APR-001',
        },
        {
          headers: { 'x-tenant-id': 'tenant-1' },
        }
      );
    });

    it('should call reject endpoint with reason', async () => {
      // Mock API response
      (api.post as jest.Mock).mockResolvedValueOnce({});

      const { result } = renderHook(() => useUpdateOrderStatus(), {
        wrapper: createWrapper(),
      });

      const params = {
        id: 'order-1',
        status: APPROVAL_STATUS.REJECTED,
        reason: 'Product not available',
        tenantId: 'tenant-1',
      };

      // Execute the mutation
      result.current.mutate(params);

      // Wait for the mutation to complete
      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // Check API was called correctly
      expect(api.post).toHaveBeenCalledWith(
        '/api/v1/orders/reject',
        {
          orderId: 'order-1',
          reason: 'Product not available',
          approverCode: 'default',
        },
        {
          headers: { 'x-tenant-id': 'tenant-1' },
        }
      );
    });

    it('should handle API errors during status update', async () => {
      // Mock API error
      const mockError = new Error('Network error');
      (api.post as jest.Mock).mockRejectedValueOnce(mockError);

      const { result } = renderHook(() => useUpdateOrderStatus(), {
        wrapper: createWrapper(),
      });

      const params = {
        id: 'order-1',
        status: APPROVAL_STATUS.APPROVED,
      };

      // Execute the mutation
      result.current.mutate(params);

      // Wait for the mutation to fail
      await waitFor(() => expect(result.current.isError).toBe(true));

      // Check error
      expect(result.current.error).toBeDefined();
    });
  });
});
