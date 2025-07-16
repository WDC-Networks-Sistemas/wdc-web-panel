import React from 'react';
import KanbanBoard from '@/components/business/kanban/KanbanBoard';

const KanbanOrdersPage: React.FC = () => {
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gerenciamento de Pedidos</h1>
      </div>
      <KanbanBoard />
    </div>
  );
};

export default KanbanOrdersPage;
