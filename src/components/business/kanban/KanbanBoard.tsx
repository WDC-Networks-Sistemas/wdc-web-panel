'use client'
import React, { useState, useMemo } from 'react';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { Draggable } from './Draggable';
import { Droppable } from './Droppable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, X, Clock } from 'lucide-react';
import { useOrders } from '@/features/orders/hooks';
import { Order } from '@/features/orders/types/orders';
import OrderDetails from '@/components/business/orders/OrderDetails';
import KanbanColumnPagination from './KanbanColumnPagination';
import RejectOrderModal from '@/components/common/RejectOrderModal';
import {APPROVAL_STATUS} from "@/constants";

  const ITEMS_PER_COLUMN = 3;

  const KanbanBoard: React.FC = () => {
  const { orders, approveOrder, rejectOrder, setSelectedOrder, filteredOrders, resetFilters, getFilteredOrdersByStatus } = useOrders();
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [orderToReject, setOrderToReject] = useState<Order | null>(null);


  // Column pagination state
  const [pendingPage, setPendingPage] = useState(1);
  const [approvedPage, setApprovedPage] = useState(1);
  const [rejectedPage, setRejectedPage] = useState(1);

  // Group orders by status (and apply search/date filters)
  const pendingOrders = getFilteredOrdersByStatus(APPROVAL_STATUS.PENDING).concat();
  const approvedOrders = getFilteredOrdersByStatus(APPROVAL_STATUS.APPROVED).concat();
  const rejectedOrders = getFilteredOrdersByStatus(APPROVAL_STATUS.REJECTED).concat();

  // Reset pagination when filtered results change
  React.useEffect(() => {
    setPendingPage(1);
    setApprovedPage(1);
    setRejectedPage(1);
  }, [pendingOrders.length, approvedOrders.length, rejectedOrders.length]);

  const getStatusBadge = (status: Order['status']) => {
    const variants = {
      pending: { variant: 'secondary' as const, text: 'Pendente', icon: Clock },
      approved: { variant: 'default' as const, text: 'Aprovado', icon: Check },
      rejected: { variant: 'destructive' as const, text: 'Rejeitado', icon: X },
    };

    const { variant, text, icon: Icon } = variants[status];

    return (
      <Badge variant={variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {text}
      </Badge>
    );
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const orderId = active.id.toString();
      const newStatus = over.id.toString() as Order['status'];

      // If dragging to rejected status, show the rejection modal instead of updating directly
      if (newStatus === 'rejected') {
        const order = orders.find(o => o.id === orderId);
        if (order) {
          setOrderToReject(order);
          setRejectModalOpen(true);
          return; // Don't update the status yet
        }
      }

      // Handle approval
      if (newStatus === 'approved') {
        approveOrder(orderId, 'default', '01,01').catch(error => {
          console.error('Error approving order:', error);
        });
      }
    }
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

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
    setDetailsOpen(true);
  };

  // Calculate total custompages for each column
  const pendingPages = Math.ceil(pendingOrders.length / ITEMS_PER_COLUMN);
  const approvedPages = Math.ceil(approvedOrders.length / ITEMS_PER_COLUMN);
  const rejectedPages = Math.ceil(rejectedOrders.length / ITEMS_PER_COLUMN);

  // Get paginated orders for each column
  const paginatedPendingOrders = useMemo(() => {
    const startIndex = (pendingPage - 1) * ITEMS_PER_COLUMN;
    return pendingOrders.slice(startIndex, startIndex + ITEMS_PER_COLUMN);
  }, [pendingOrders, pendingPage]);

  const paginatedApprovedOrders = useMemo(() => {
    const startIndex = (approvedPage - 1) * ITEMS_PER_COLUMN;
    return approvedOrders.slice(startIndex, startIndex + ITEMS_PER_COLUMN);
  }, [approvedOrders, approvedPage]);

  const paginatedRejectedOrders = useMemo(() => {
    const startIndex = (rejectedPage - 1) * ITEMS_PER_COLUMN;
    return rejectedOrders.slice(startIndex, startIndex + ITEMS_PER_COLUMN);
  }, [rejectedOrders, rejectedPage]);

      const renderEmptyState = () => (
    <div className="bg-gray-50 p-4 rounded-lg border border-dashed border-gray-300 mb-3 text-center">
      <p className="text-gray-500 text-sm">Nenhum pedido para exibir</p>
    </div>
      );

  const renderOrderCard = (order: Order) => (
    <Draggable id={order.id} key={order.id}>
      <div 
        className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-3 cursor-move hover:shadow-md transition-shadow"
        onClick={(e) => {
          // Prevent dragging when clicking to view details
          e.stopPropagation();
          handleOrderClick(order);
        }}
      >
        <div className="flex justify-between items-start mb-2">
          <span className="font-medium text-gray-900">{order.id}</span>
          {getStatusBadge(order.status)}
        </div>
        <div className="text-sm text-gray-900 mb-1">{order.customer}</div>
        <div className="text-xs text-gray-500 mb-2">{order.email}</div>
        <div className="text-sm font-medium text-gray-900">
          R$ {order.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </div>
        <div className="text-xs text-gray-500 mt-2">
          {new Date(order.date).toLocaleDateString('pt-BR')}
        </div>
      </div>
    </Draggable>
  );

  return (
    <div className="bg-gray-50 p-6 h-full overflow-auto">
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

      {pendingOrders.length === 0 && approvedOrders.length === 0 && rejectedOrders.length === 0 ? (
        <div className="flex items-center justify-center h-full min-h-[200px]">
          <div className="text-center p-8 bg-white rounded-lg shadow-sm border border-gray-200">
            <p className="text-gray-500 mb-2">Nenhum pedido encontrado com os filtros atuais</p>
            <Button variant="outline" onClick={() => resetFilters()} size="sm">Limpar filtros</Button>
          </div>
        </div>
      ) : (
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pending Column */}
                      <div className="bg-gray-100 rounded-lg p-4 min-h-[350px] flex flex-col">
            <div className="flex items-center mb-4">
              <Clock className="w-5 h-5 text-gray-500 mr-2" />
              <h3 className="font-medium text-gray-700">Pendente</h3>
              <span className="ml-2 bg-gray-200 text-gray-700 text-xs font-medium rounded-full px-2 py-0.5">
                {pendingOrders.length}
              </span>
            </div>

            <Droppable id="pending">
              <div className="min-h-[200px] flex-1">
                {paginatedPendingOrders.length > 0 ? 
                  paginatedPendingOrders.map(renderOrderCard) : 
                  renderEmptyState()
                }
              </div>
            </Droppable>

            <KanbanColumnPagination 
              currentPage={pendingPage}
              totalPages={pendingPages}
              onPageChange={setPendingPage}
            />
          </div>

          {/* Approved Column */}
          <div className="bg-gray-100 rounded-lg p-4 min-h-[350px] flex flex-col">
            <div className="flex items-center mb-4">
              <Check className="w-5 h-5 text-green-600 mr-2" />
              <h3 className="font-medium text-gray-700">Aprovado</h3>
              <span className="ml-2 bg-gray-200 text-gray-700 text-xs font-medium rounded-full px-2 py-0.5">
                {approvedOrders.length}
              </span>
            </div>

            <Droppable id="approved">
              <div className="min-h-[200px] flex-1">
                {paginatedApprovedOrders.length > 0 ? 
                  paginatedApprovedOrders.map(renderOrderCard) : 
                  renderEmptyState()
                }
              </div>
            </Droppable>

            <KanbanColumnPagination 
              currentPage={approvedPage}
              totalPages={approvedPages}
              onPageChange={setApprovedPage}
            />
          </div>

          {/* Rejected Column */}
                      <div className="bg-gray-100 rounded-lg p-4 min-h-[350px] flex flex-col">
            <div className="flex items-center mb-4">
              <X className="w-5 h-5 text-red-600 mr-2" />
              <h3 className="font-medium text-gray-700">Rejeitado</h3>
              <span className="ml-2 bg-gray-200 text-gray-700 text-xs font-medium rounded-full px-2 py-0.5">
                {rejectedOrders.length}
              </span>
            </div>

            <Droppable id="rejected">
              <div className="min-h-[200px] flex-1">
                {paginatedRejectedOrders.length > 0 ? 
                  paginatedRejectedOrders.map(renderOrderCard) : 
                  renderEmptyState()
                }
              </div>
            </Droppable>

            <KanbanColumnPagination 
              currentPage={rejectedPage}
              totalPages={rejectedPages}
              onPageChange={setRejectedPage}
            />
          </div>
        </div>
      </DndContext>
      )}
    </div>
  );
};

export default KanbanBoard;
