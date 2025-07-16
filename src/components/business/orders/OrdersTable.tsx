'use client'
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, X, Clock } from 'lucide-react';
import { useOrders } from '@/features/orders/hooks';
import { Order } from '@/features/orders/types/orders';
import OrderDetails from '@/components/business/orders/OrderDetails';
import OrdersPagination from '@/components/business/orders/OrdersPagination';
import PageSizeSelector from '@/components/common/PageSizeSelector';
import RejectOrderModal from '@/components/common/RejectOrderModal';
import { APPROVAL_STATUS_UI as APPROVAL_STATUS, APPROVAL_STATUS_UI_LABELS as APPROVAL_STATUS_LABELS } from '@/constants/statusTypes';

const OrdersTable: React.FC = () => {
  const { paginatedOrders, approveOrder, rejectOrder, setSelectedOrder, pagination } = useOrders();
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [orderToReject, setOrderToReject] = useState<Order | null>(null);

  const handleRowClick = (order: Order) => {
    setSelectedOrder(order);
    setDetailsOpen(true);
  };

  const getStatusBadge = (status: Order['status']) => {
    const variants = {
      [APPROVAL_STATUS.PENDING]: { variant: 'secondary' as const, text: APPROVAL_STATUS_LABELS[APPROVAL_STATUS.PENDING], icon: Clock },
      [APPROVAL_STATUS.WAITING_PREVIOUS_LEVEL]: { variant: 'secondary' as const, text: APPROVAL_STATUS_LABELS[APPROVAL_STATUS.WAITING_PREVIOUS_LEVEL], icon: Clock },
      [APPROVAL_STATUS.APPROVED]: { variant: 'default' as const, text: APPROVAL_STATUS_LABELS[APPROVAL_STATUS.APPROVED], icon: Check },
      [APPROVAL_STATUS.APPROVED_OTHER_APPROVER]: { variant: 'default' as const, text: APPROVAL_STATUS_LABELS[APPROVAL_STATUS.APPROVED_OTHER_APPROVER], icon: Check },
      [APPROVAL_STATUS.REJECTED]: { variant: 'destructive' as const, text: APPROVAL_STATUS_LABELS[APPROVAL_STATUS.REJECTED], icon: X },
      [APPROVAL_STATUS.BLOCKED]: { variant: 'destructive' as const, text: APPROVAL_STATUS_LABELS[APPROVAL_STATUS.BLOCKED], icon: X },
      [APPROVAL_STATUS.REJECTED_BLOCKED_OTHER_APPROVER]: { variant: 'destructive' as const, text: APPROVAL_STATUS_LABELS[APPROVAL_STATUS.REJECTED_BLOCKED_OTHER_APPROVER], icon: X },
    };

    // Default to pending if status is not recognized
    const statusData = variants[status] || variants[APPROVAL_STATUS.PENDING];
    const { variant, text, icon: Icon } = statusData;

    return (
      <Badge variant={variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {text}
      </Badge>
    );
  };

  const handleApprove = async (id: string) => {
    try {
      await approveOrder(id, 'default', '01,01');
    } catch (error) {
      console.error('Error approving order:', error);
    }
  };

  const handleRejectClick = (order: Order) => {
    setOrderToReject(order);
    setRejectModalOpen(true);
  };

  const handleRejectConfirm = async (reason: string) => {
    if (orderToReject) {
      try {
        await rejectOrder(orderToReject.id, 'default', '01,01', reason);
        setOrderToReject(null);
      } catch (error) {
        console.error('Error rejecting order:', error);
      }
    }
  };

  return (
    <div className="overflow-auto h-full flex flex-col">
      <OrderDetails open={detailsOpen} onOpenChange={setDetailsOpen} />

      <RejectOrderModal
        open={rejectModalOpen}
        onOpenChange={setRejectModalOpen}
        onConfirm={handleRejectConfirm}
        orderInfo={orderToReject ? {
          id: orderToReject.id,
          customer: orderToReject.customer,
          amount: orderToReject.amount,
        } : undefined}
      />

      <div className="overflow-auto flex-1">
        <table className="w-full border-collapse">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedOrders.length > 0 ? paginatedOrders.map((order) => (
              <tr 
                key={order.id} 
                className="hover:bg-gray-50 cursor-pointer" 
                onClick={() => handleRowClick(order)}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.customer}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  R$ {order.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(order.status)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(order.date).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {(order.status === APPROVAL_STATUS.PENDING || order.status === APPROVAL_STATUS.WAITING_PREVIOUS_LEVEL) && (
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="default"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApprove(order.id);
                        }}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRejectClick(order);
                        }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={7} className="px-6 py-10 text-center">
                  <p className="text-gray-500">Nenhum pedido para exibir</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="py-4 px-6 flex items-center justify-between border-t border-gray-200 bg-white sticky bottom-0">
        <div className="text-sm text-gray-500">
          {pagination.totalItems > 0 ? (
            <>Exibindo {pagination.pageSize * (pagination.currentPage - 1) + 1} a {Math.min(pagination.pageSize * pagination.currentPage, pagination.totalItems)} de {pagination.totalItems} pedidos</>
          ) : (
            <>Nenhum pedido encontrado</>
          )}
        </div>
        <div className="flex items-center gap-4">
          <PageSizeSelector />
          <OrdersPagination />
        </div>
      </div>
    </div>
  );
};

export default OrdersTable;
