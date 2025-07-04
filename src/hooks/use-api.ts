'use client'

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from '@/lib/api'
import {PendingBuyOrderResponse, PendingBuyOrderProps} from "@/contexts/pendingBuyOrder";
import {ApproveResponse, UpdateDocumentsProps} from "@/contexts/approve";
import { GetPurchaseOrderDetailsProps, PurchaseOrderDetails } from "@/contexts/purchaseOrderDetails";

/**
 *
 * @param props - The params needed by the api
 * @param props.UserEmail - The user Email
 * @param props.DateStart - The initial date for the period search (default: today)
 * @param props.DateEnd - The final date for the period search (default: today - 15 days)
 * @param props.Types - The order status types (APPROVAL_STATUS constant)
 * @param props.TenantId - The TenantIds for the search (default: 01,01)
 */
export function useGetPendingBuyOrders(props: PendingBuyOrderProps) {
    return useQuery<PendingBuyOrderResponse>({
        queryKey: ['buyOrders', props],
        queryFn: () => api.get<PendingBuyOrderResponse>('/ApprovalPending', {
            params: {
                user_email: props.UserEmail,
                date_begin: props.DateStart,
                date_end: props.DateEnd,
                types: props.Types,
            },
            headers: {
                tenantid: props.TenantId,
            }
        }),
        enabled: Boolean(props.UserEmail) // Only run query when user email is provided
    })
}

/**
 * Hook to fetch purchase order details
 * @param params.OrderId - The purchase order id
 * @param params.TenantId - The tenants for the search (default: 01,01)
 * @returns PurchaseOrderDetails Query result with purchase order details
 */
export function useGetPurchaseOrderDetails(params: GetPurchaseOrderDetailsProps) {
    const { OrderId, TenantId } = params;

    return useQuery<PurchaseOrderDetails>({
        queryKey: ['purchaseOrderDetails', OrderId, TenantId],
        queryFn: async () => {
            return await api.get<PurchaseOrderDetails>(`/Purchaseorder/${OrderId}`, {
                params: { OrderId },
                headers: { TenantId }
            });
        },
        enabled: Boolean(OrderId) && Boolean(TenantId)
    });
}

export function useApproveUpdateDocuments() {
    const queryClient = useQueryClient();

    return useMutation<ApproveResponse, Error, UpdateDocumentsProps>({
        mutationFn: async (params: UpdateDocumentsProps) => {
            const { OrderId, Type, ApproverCode, SystemCode, Tenant } = params;

            const response = await api.post<ApproveResponse>('/UpdateDocuments/Approval', null, {
                params: {
                    OrderId,
                    Type,
                    ApproverCode,
                    SystemCode
                },
                headers: {
                    Tenant
                }
            });

            return response;
        },
        onSuccess: () => {
            // Invalidate related queries after successful update
            queryClient.invalidateQueries({queryKey: ['buyOrders']});
        }
    });
}

/**
 * Interface for rejecting documents
 */
export interface RejectDocumentProps extends UpdateDocumentsProps {
    Reason: string;
}

/**
 * Hook to reject documents
 * @returns Mutation function for rejecting documents
 */
export function useRejectDocument() {
    const queryClient = useQueryClient();

    return useMutation<ApproveResponse, Error, RejectDocumentProps>({
        mutationFn: async (params: RejectDocumentProps) => {
            const {OrderId, Type, ApproverCode, SystemCode, Tenant, Reason} = params;

            const response = await api.post<ApproveResponse>('/UpdateDocuments/Rejection', null, {
                params: {
                    OrderId,
                    Type,
                    ApproverCode,
                    SystemCode,
                    Reason
                },
                headers: {
                    Tenant
                }
            });

            return response;
        },
        onSuccess: () => {
            // Invalidate related queries after successful rejection
            queryClient.invalidateQueries({queryKey: ['buyOrders']});
        }
    });
}

/**
 * Hook for approving purchase orders
 */
export function usePurchaseOrderApproval() {
    const queryClient = useQueryClient();

    return useMutation<void, Error, PurchaseOrderApprovalParams>({
        mutationFn: async ({ orderId, approverCode, tenantId }) => {
            await api.post('/purchaseOrders/approve', null, {
                params: {
                    id: orderId,
                    approverCode
                },
                headers: {
                    TenantId: tenantId
                }
            });
        },
        onSuccess: () => {
            // Invalidate related queries
            queryClient.invalidateQueries({ queryKey: ['buyOrders'] });
            queryClient.invalidateQueries({ queryKey: ['purchaseOrderDetails'] });
        }
    });
}

/**
 * Hook for rejecting purchase orders with reason
 */
export function usePurchaseOrderRejection() {
    const queryClient = useQueryClient();

    return useMutation<void, Error, PurchaseOrderRejectionParams>({
        mutationFn: async ({ orderId, approverCode, tenantId, reason }) => {
            await api.post('/purchaseOrders/reject', { reason }, {
                params: {
                    id: orderId,
                    approverCode
                },
                headers: {
                    TenantId: tenantId
                }
            });
        },
        onSuccess: () => {
            // Invalidate related queries
            queryClient.invalidateQueries({ queryKey: ['buyOrders'] });
            queryClient.invalidateQueries({ queryKey: ['purchaseOrderDetails'] });
        }
    });
}


