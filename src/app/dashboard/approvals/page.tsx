
import React from 'react';
import DashboardLayout from '@/components/business/dashboard/DashboardLayout';
import OrdersViewContainer from '@/components/business/orders/OrdersViewContainer';

const Approvals: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="h-screen flex flex-col overflow-hidden">
        <div className="p-8 pb-4">
          <h1 className="text-3xl font-bold text-gray-900">Aprovações de Pedidos</h1>
          <p className="text-gray-600 mt-2">Gerencie e aprove pedidos de clientes</p>
        </div>

        <div className="flex-1 overflow-hidden px-8 pb-8">
          <OrdersViewContainer />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Approvals;
