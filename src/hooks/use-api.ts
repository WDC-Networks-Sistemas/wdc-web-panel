'use client'

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from '@/lib/api'
import { PendingBuyOrderProps} from "@/contexts/pendingBuyOrder";
import {ApproveProps} from "@/contexts/approve";


export function useGetPendingBuyOrders(props: PendingBuyOrderProps) {
    return useQuery({
        queryKey: ['buyOrders'],
        queryFn: () => api.get('/ApprovalPending')
    })
}

export function useGetBuyOrder(id: string) {
    return api.get(`/Purchaseorder/${id}`)
}

