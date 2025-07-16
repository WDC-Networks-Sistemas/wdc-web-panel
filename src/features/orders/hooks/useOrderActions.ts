import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersService } from '../services/ordersService';
import { ApproveOrderParams, RejectOrderParams } from '../types/orders';

export const useOrderActions = () => {
  const queryClient = useQueryClient();

  // Mutation for approving orders
  const approvalMutation = useMutation({
    mutationFn: ({ orderId, approverCode, tenantId }: ApproveOrderParams) => 
      ordersService.updateOrderStatus(orderId, 'approved', undefined, approverCode, tenantId),
    onSuccess: () => {
      // Invalidate queries to refetch orders
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    }
  });

  // Mutation for rejecting orders
  const rejectionMutation = useMutation({
    mutationFn: ({ orderId, approverCode, tenantId, reason }: RejectOrderParams) => 
      ordersService.updateOrderStatus(orderId, 'rejected', reason, approverCode, tenantId),
    onSuccess: () => {
      // Invalidate queries to refetch orders
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    }
  });

  // Approve an order
  const approveOrder = async (orderId: string, approverCode: string, tenantId: string) => {
    try {
      await approvalMutation.mutateAsync({
        orderId,
        approverCode,
        tenantId
      });
    } catch (error) {
      console.error('Error approving order:', error);
      throw error;
    }
  };

  // Reject an order with reason
  const rejectOrder = async (orderId: string, approverCode: string, tenantId: string, reason: string) => {
    try {
      await rejectionMutation.mutateAsync({
        orderId,
        approverCode,
        tenantId,
        reason
      });
    } catch (error) {
      console.error('Error rejecting order:', error);
      throw error;
    }
  };

  return {
    approveOrder,
    rejectOrder,
    isApproving: approvalMutation.isPending,
    isRejecting: rejectionMutation.isPending,
    error: approvalMutation.error || rejectionMutation.error
  };
};
