
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import OrdersTable from '@/components/OrdersTable';

const Approvals: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Aprovações de Pedidos</h1>
          <p className="text-gray-600 mt-2">Gerencie e aprove pedidos de clientes</p>
        </div>

        <OrdersTable />
      </div>
    </DashboardLayout>
  );
};

export default Approvals;
