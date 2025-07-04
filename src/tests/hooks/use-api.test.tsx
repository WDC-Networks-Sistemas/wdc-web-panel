import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useGetPendingBuyOrders,
  useGetBuyOrder,
  useGetPurchaseOrderDetails,
  useApproveUpdateDocuments,
  useRejectDocument,
  usePurchaseOrderApproval,
  usePurchaseOrderRejection,
} from '@/hooks/use-api';
import { api } from '@/lib/api';
import { PendingBuyOrderProps } from '@/types/pending-buy-order';
import { GetPurchaseOrderDetailsProps } from '@/types/purchase-order';
import { UpdateDocumentsProps, RejectDocumentProps } from '@/types/approval';

// Mock the API module
jest.mock('@/lib/api', () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

// Sample mock data
const mockBuyOrderResponse = {
  approval: [
    {
      BranchCode: 'BR001',
      BranchName: 'Main Branch',
      UserEmail: 'user@example.com',
      UserCode: 'U001',
      ApproverCode: 'A001',
      UserName: 'Test User',
      NumberIssues: 2,
      Interval: {
        StartIn: '2025-06-01',
        EndIn: '2025-06-30',
      },
      StatusFilter: 'pending',
      Issues: [
        {
          Document: 'DOC001',
          Type: 'Purchase',
          Emission: '2025-06-15',
          Level: '1',
          StatusCode: 'P',
          StatusDescription: 'Pending',
          Coin: 1,
          CoinName: 'USD',
          Amount: 1000.5,
          UserLiberation: 'U001',
          UserLibnName: 'Approver 1',
          CurrencyRate: 1,
          CoinSymbol: '$',
          CoinValue: 1000.5,
          ReleaseValue: 1000.5,
          CodeGroup: 'G001',
          NameGroup: 'Office Supplies',
          Observations: 'Monthly order',
        },
      ],
    },
  ],
};

const mockBuyOrder = mockBuyOrderResponse.approval[0].Issues[0];

const mockPurchaseOrderDetails = {
  id: 'PO001',
  orderNumber: 'ORD-001',
  createdAt: '2025-06-15',
  status: 'pending',
  totalAmount: 1000.5,
  currency: 'USD',
  items: [
    {
      id: 'ITEM001',
      productId: 'PROD001',
      productName: 'Office Chair',
      quantity: 5,
      unitPrice: 200.1,
      totalPrice: 1000.5,
    },
  ],
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

describe('API Hooks', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('useGetPendingBuyOrders', () => {
    it('should fetch pending buy orders with given parameters', async () => {
      // Mock API response
      (api.get as jest.Mock).mockResolvedValueOnce(mockBuyOrderResponse);

      const params: PendingBuyOrderProps = {
        user_email: 'user@example.com',
        date_begin: '2025-06-01',
        date_end: '2025-06-30',
        types: 'purchase',
      };

      const { result } = renderHook(() => useGetPendingBuyOrders(params), {
        wrapper: createWrapper(),
      });

      // Wait for the query to complete
      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // Check API was called correctly
      expect(api.get).toHaveBeenCalledWith('/api/v1/approvals/pending', {
        params: {
          userEmail: 'user@example.com',
          startDate: '2025-06-01',
          endDate: '2025-06-30',
          documentTypes: 'purchase',
        },
      });

      // Verify data
      expect(result.current.data).toEqual(mockBuyOrderResponse);
    });

    it('should not fetch when user email is not provided', async () => {
      const params: PendingBuyOrderProps = {
        user_email: '', // Empty email
        types: 'purchase',
      };

      const { result } = renderHook(() => useGetPendingBuyOrders(params), {
        wrapper: createWrapper(),
      });

      // Query should be disabled
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isFetching).toBe(false);

      // API should not be called
      expect(api.get).not.toHaveBeenCalled();
    });

    it('should handle API errors', async () => {
      // Mock API error
      const mockError = new Error('Network error');
      (api.get as jest.Mock).mockRejectedValueOnce(mockError);

      const params: PendingBuyOrderProps = {
        user_email: 'user@example.com',
        types: 'purchase',
      };

      const { result } = renderHook(() => useGetPendingBuyOrders(params), {
        wrapper: createWrapper(),
      });

      // Wait for the query to fail
      await waitFor(() => expect(result.current.isError).toBe(true));

      // Check error
      expect(result.current.error).toBeDefined();
    });
  });

  describe('useGetBuyOrder', () => {
    it('should fetch a single buy order by ID', async () => {
      // Mock API response
      (api.get as jest.Mock).mockResolvedValueOnce(mockBuyOrder);

      const orderId = 'DOC001';

      const { result } = renderHook(() => useGetBuyOrder(orderId), {
        wrapper: createWrapper(),
      });

      // Wait for the query to complete
      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // Check API was called correctly
      expect(api.get).toHaveBeenCalledWith(`/api/v1/purchase-orders/${orderId}`);

      // Verify data
      expect(result.current.data).toEqual(mockBuyOrder);
    });
  });

  describe('useGetPurchaseOrderDetails', () => {
    it('should fetch purchase order details with given parameters', async () => {
      // Mock API response with data property
      (api.get as jest.Mock).mockResolvedValueOnce({ data: mockPurchaseOrderDetails });

      const params: GetPurchaseOrderDetailsProps = {
        OrderId: 'PO001',
        TenantId: 'tenant-1',
      };

      const { result } = renderHook(() => useGetPurchaseOrderDetails(params), {
        wrapper: createWrapper(),
      });

      // Wait for the query to complete
      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // Check API was called correctly
      expect(api.get).toHaveBeenCalledWith('/api/v1/purchase-orders/details', {
        params: { orderId: 'PO001' },
        headers: { 'x-tenant-id': 'tenant-1' },
      });

      // Verify data
      expect(result.current.data).toEqual({ data: mockPurchaseOrderDetails });
    });
  });

  describe('useApproveUpdateDocuments', () => {
    it('should call approve endpoint with correct parameters', async () => {
      // Setup Jest spy
      jest.spyOn(api, 'post').mockResolvedValueOnce({ approval: 'SUCCESS' });

      const { result } = renderHook(() => useApproveUpdateDocuments(), {
        wrapper: createWrapper(),
      });

      const params: UpdateDocumentsProps = {
        OrderId: 'DOC001',
        Type: 'Purchase',
        ApproverCode: 'A001',
        SystemCode: 'SYS001',
        Tenant: 'tenant-1',
      };

      // Execute the mutation
      act(() => {
        result.current.mutate(params);
      });

      // Wait for the mutation to complete using Jest's expect
      await waitFor(() => {
        expect(result.current.isSuccess).toBeTruthy();
      });

      // Check API was called correctly with Jest's expectations
      expect(api.post).toHaveBeenCalledTimes(1);
      expect(api.post).toHaveBeenCalledWith(
        '/api/v1/documents/approve',
        {
          documentId: 'DOC001',
          documentType: 'Purchase',
          approverCode: 'A001',
          systemCode: 'SYS001',
        },
        {
          headers: {
            'x-tenant-id': 'tenant-1',
          },
        }
      );

      // Verify query invalidation
      // This requires access to the queryClient, which we can get by modifying the test setup
      // But this approach demonstrates the concept
      expect(result.current.data).toEqual({ approval: 'SUCCESS' });
    });

    it('should handle API errors appropriately', async () => {
      // Setup Jest spy to return an error
      const testError = new Error('API Error');
      jest.spyOn(api, 'post').mockRejectedValueOnce(testError);

      const { result } = renderHook(() => useApproveUpdateDocuments(), {
        wrapper: createWrapper(),
      });

      const params: UpdateDocumentsProps = {
        OrderId: 'DOC001',
        Type: 'Purchase',
        ApproverCode: 'A001',
        SystemCode: 'SYS001',
        Tenant: 'tenant-1',
      };

      // Execute the mutation
      act(() => {
        result.current.mutate(params);
      });

      // Wait for the mutation to fail
      await waitFor(() => {
        expect(result.current.isError).toBeTruthy();
      });

      // Verify the error is captured correctly
      expect(result.current.error).toEqual(testError);
    });
  });

  describe('useRejectDocument', () => {
    it('should call reject endpoint with correct parameters including reason', async () => {
      // Mock API response
      (api.post as jest.Mock).mockResolvedValueOnce({ approval: 'SUCCESS' });

      const { result } = renderHook(() => useRejectDocument(), {
        wrapper: createWrapper(),
      });

      const params: RejectDocumentProps = {
        OrderId: 'DOC001',
        Type: 'Purchase',
        ApproverCode: 'A001',
        SystemCode: 'SYS001',
        Tenant: 'tenant-1',
        Reason: 'Budget constraints',
      };

      // Execute the mutation
      result.current.mutate(params);

      // Wait for the mutation to complete
      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // Check API was called correctly
      expect(api.post).toHaveBeenCalledWith(
        '/api/v1/documents/reject',
        {
          documentId: 'DOC001',
          documentType: 'Purchase',
          approverCode: 'A001',
          systemCode: 'SYS001',
          reason: 'Budget constraints',
        },
        {
          headers: {
            'x-tenant-id': 'tenant-1',
          },
        }
      );
    });
  });

  describe('usePurchaseOrderApproval', () => {
    it('should call purchase order approve endpoint with correct parameters', async () => {
      // Mock API response
      (api.post as jest.Mock).mockResolvedValueOnce({});

      const { result } = renderHook(() => usePurchaseOrderApproval(), {
        wrapper: createWrapper(),
      });

      // Execute the mutation
      result.current.mutate({
        orderId: 'PO001',
        approverCode: 'A001',
        tenantId: 'tenant-1',
      });

      // Wait for the mutation to complete
      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // Check API was called correctly
      expect(api.post).toHaveBeenCalledWith(
        '/api/v1/purchase-orders/approve',
        {
          orderId: 'PO001',
          approverCode: 'A001',
        },
        {
          headers: {
            'x-tenant-id': 'tenant-1',
          },
        }
      );
    });
  });

  describe('usePurchaseOrderRejection', () => {
    it('should call purchase order reject endpoint with correct parameters', async () => {
      // Mock API response
      (api.post as jest.Mock).mockResolvedValueOnce({});

      const { result } = renderHook(() => usePurchaseOrderRejection(), {
        wrapper: createWrapper(),
      });

      // Execute the mutation
      result.current.mutate({
        orderId: 'PO001',
        approverCode: 'A001',
        tenantId: 'tenant-1',
        reason: 'Budget constraints',
      });

      // Wait for the mutation to complete
      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // Check API was called correctly
      expect(api.post).toHaveBeenCalledWith(
        '/api/v1/purchase-orders/reject',
        {
          orderId: 'PO001',
          approverCode: 'A001',
          reason: 'Budget constraints',
        },
        {
          headers: {
            'x-tenant-id': 'tenant-1',
          },
        }
      );
    });
  });
});
