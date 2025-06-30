'use client'

import * as React from 'react';
import { useMemo } from 'react';
import { useOrders } from '@/contexts/OrdersContext';

interface OrderMatrixDisplayProps {
  orderNumber: string;
  className?: string;
}

const OrderMatrixDisplay: React.FC<OrderMatrixDisplayProps> = ({ orderNumber, className }) => {
  const { getOrdersByNumber, branches } = useOrders();

  const matrixOrders = useMemo(() => {
    return getOrdersByNumber(orderNumber);
  }, [orderNumber, getOrdersByNumber]);

  if (matrixOrders.length <= 1) {
    return null; // Don't display if there's only one order with this number
  }

  return (
    <div className={`rounded-md border border-gray-200 overflow-hidden ${className || ''}`}>
      <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
        <h3 className="text-sm font-medium">Pedido #{orderNumber} em múltiplas filiais</h3>
      </div>
      <div className="divide-y divide-gray-200">
        {matrixOrders.map(order => {
          const branch = branches.find(b => b.id === order.branchId);
          return (
            <div key={order.matrixId} className="px-4 py-3 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">{branch?.name || 'Filial desconhecida'}</p>
                <p className="text-xs text-gray-500">{order.matrixId}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span 
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${order.status === 'approved' ? 'bg-green-100 text-green-800' : order.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}
                >
                  {order.status === 'approved' ? 'Aprovado' : order.status === 'rejected' ? 'Rejeitado' : 'Pendente'}
                </span>
                <span className="text-sm font-medium">R$ {order.amount.toFixed(2)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderMatrixDisplay;
