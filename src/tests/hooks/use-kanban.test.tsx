import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useKanbanBoard, useKanbanCardDetails, useUpdateKanbanCardStatus } from '@/hooks/use-kanban';
import { api } from '@/lib/api';
import { APPROVAL_STATUS_UI as APPROVAL_STATUS } from '@/constants/statusTypes';
import { KanbanCardItem, KanbanBoardData } from '@/types/kanban';

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
const mockKanbanCardItem: KanbanCardItem = {
  id: 'card-1',
  orderNumber: 'ORD-001',
  customer: 'Test Customer',
  email: 'customer@example.com',
  amount: 1000.50,
  status: 'pending',
  date: '2025-06-15',
  branchCode: 'BR-001',
  branchName: 'Main Branch',
};

const mockKanbanBoardData: KanbanBoardData = {
  pending: [
    mockKanbanCardItem,
    {
      id: 'card-2',
      orderNumber: 'ORD-002',
      customer: 'Test Customer 2',
      email: 'customer2@example.com',
      amount: 2500.75,
      status: 'pending',
      date: '2025-06-20',
    },
  ],
  approved: [],
  rejected: [],
};

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

describe('Kanban Hooks', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('useKanbanBoard', () => {
    it('should fetch kanban board data with no filters', async () => {
      // Mock API response
      (api.get as jest.Mock).mockResolvedValueOnce(mockKanbanBoardData);

      const { result } = renderHook(() => useKanbanBoard(), {
        wrapper: createWrapper(),
      });

      // Initial state should be loading
      expect(result.current.isLoading).toBe(true);

      // Wait for the query to complete
      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // Check API was called correctly
      expect(api.get).toHaveBeenCalledWith('/api/v1/kanban/board', {
        params: {},
        headers: {},
      });

      // Verify data
      expect(result.current.data).toEqual(mockKanbanBoardData);
    });

    it('should fetch kanban board data with filters', async () => {
      // Mock API response
      (api.get as jest.Mock).mockResolvedValueOnce(mockKanbanBoardData);

      const filters = {
        searchQuery: 'test',
        dateRange: {
          from: new Date('2025-06-01'),
          to: new Date('2025-06-30'),
        },
        branchId: 'branch-1',
        tenantId: 'tenant-1',
      };

      const { result } = renderHook(() => useKanbanBoard(filters), {
        wrapper: createWrapper(),
      });

      // Wait for the query to complete
      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // Check API was called with correct parameters
      expect(api.get).toHaveBeenCalledWith('/api/v1/kanban/board', {
        params: {
          query: 'test',
          startDate: '2025-06-01',
          endDate: '2025-06-30',
          branchId: 'branch-1',
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

      const { result } = renderHook(() => useKanbanBoard(), {
        wrapper: createWrapper(),
      });

      // Wait for the query to fail
      await waitFor(() => expect(result.current.isError).toBe(true));

      // Check error
      expect(result.current.error).toBeDefined();
    });
  });

  describe('useKanbanCardDetails', () => {
    it('should fetch a single kanban card by ID', async () => {
      // Mock API response
      (api.get as jest.Mock).mockResolvedValueOnce(mockKanbanCardItem);

      const cardId = 'card-1';
      const tenantId = 'tenant-1';

      const { result } = renderHook(() => useKanbanCardDetails(cardId, tenantId), {
        wrapper: createWrapper(),
      });

      // Wait for the query to complete
      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // Check API was called correctly
      expect(api.get).toHaveBeenCalledWith(`/api/v1/kanban/cards/${cardId}`, {
        headers: { 'x-tenant-id': tenantId },
      });

      // Verify data
      expect(result.current.data).toEqual(mockKanbanCardItem);
    });

    it('should not fetch when ID is not provided', async () => {
      const { result } = renderHook(() => useKanbanCardDetails(''), {
        wrapper: createWrapper(),
      });

      // Query should be disabled
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isFetching).toBe(false);

      // API should not be called
      expect(api.get).not.toHaveBeenCalled();
    });
  });

  describe('useUpdateKanbanCardStatus', () => {
    it('should call approve endpoint with correct parameters', async () => {
      // Setup Jest spy
      jest.spyOn(api, 'post').mockResolvedValueOnce({});

      const { result } = renderHook(() => useUpdateKanbanCardStatus(), {
        wrapper: createWrapper(),
      });

      const params = {
        cardId: 'card-1',
        newStatus: APPROVAL_STATUS.APPROVED,
        approverCode: 'APR-001',
        tenantId: 'tenant-1',
      };

      // Execute the mutation with act
      act(() => {
        result.current.mutate(params);
      });

      // Wait for the mutation to complete using Jest's expect
      await waitFor(() => expect(result.current.isSuccess).toBeTruthy());

      // Check API was called correctly
      expect(api.post).toHaveBeenCalledWith(
        '/api/v1/kanban/cards/approve',
        {
          cardId: 'card-1',
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

      const { result } = renderHook(() => useUpdateKanbanCardStatus(), {
        wrapper: createWrapper(),
      });

      const params = {
        cardId: 'card-1',
        newStatus: APPROVAL_STATUS.REJECTED,
        reason: 'Product not available',
        tenantId: 'tenant-1',
      };

      // Execute the mutation
      result.current.mutate(params);

      // Wait for the mutation to complete
      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // Check API was called correctly
      expect(api.post).toHaveBeenCalledWith(
        '/api/v1/kanban/cards/reject',
        {
          cardId: 'card-1',
          reason: 'Product not available',
          approverCode: 'default',
        },
        {
          headers: { 'x-tenant-id': 'tenant-1' },
        }
      );
    });

    it('should throw error when rejecting without a reason', async () => {
      const { result } = renderHook(() => useUpdateKanbanCardStatus(), {
        wrapper: createWrapper(),
      });

      const params = {
        cardId: 'card-1',
        newStatus: APPROVAL_STATUS.REJECTED,
        // No reason provided
      };

      // Execute the mutation (should throw error)
      result.current.mutate(params);

      // Wait for the mutation to fail
      await waitFor(() => expect(result.current.isError).toBe(true));

      // Verify error message
      expect(result.current.error).toEqual(new Error('Reason is required for rejection'));

      // API should not be called
      expect(api.post).not.toHaveBeenCalled();
    });

    it('should handle API errors during status update', async () => {
      // Mock API error
      const mockError = new Error('Network error');
      (api.post as jest.Mock).mockRejectedValueOnce(mockError);

      const { result } = renderHook(() => useUpdateKanbanCardStatus(), {
        wrapper: createWrapper(),
      });

      const params = {
        cardId: 'card-1',
        newStatus: APPROVAL_STATUS.APPROVED,
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
