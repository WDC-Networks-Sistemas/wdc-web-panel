'use client'
import React, { useState } from 'react';
import OrdersTable from '@/components/OrdersTable';
import KanbanBoard from '@/components/KanbanBoard';
import OrdersToggleView from '@/components/OrdersToggleView';
import ClientHistoryCard from '@/components/ClientHistoryCard';
import OrdersFilter from '@/components/OrdersFilter';
import FilterStatusIndicator from '@/components/FilterStatusIndicator';
import { OrdersProvider } from '@/contexts/OrdersContext';

const OrdersViewContainer: React.FC = () => {
  const [view, setView] = useState<'table' | 'kanban'>('table');

  return (
    <OrdersProvider>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full overflow-hidden">
                  <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Pedidos para Aprovação</h3>
            <OrdersToggleView view={view} onViewChange={setView} />
          </div>

          <div className="px-6 py-4 border-b border-gray-200">
            <OrdersFilter />
          </div>

          <FilterStatusIndicator />

          <div className="overflow-auto flex-1">
            {view === 'table' ? <OrdersTable /> : <KanbanBoard />}
          </div>
        </div>

        <div className="lg:col-span-1 h-full overflow-hidden">
          <ClientHistoryCard />
        </div>
      </div>
    </OrdersProvider>
  );
};

export default OrdersViewContainer;
