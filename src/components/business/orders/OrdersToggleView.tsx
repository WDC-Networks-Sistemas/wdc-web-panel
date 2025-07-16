import React from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { LayoutList, Trello } from 'lucide-react';

interface OrdersToggleViewProps {
  view: 'table' | 'kanban';
  onViewChange: (view: 'table' | 'kanban') => void;
}

const OrdersToggleView: React.FC<OrdersToggleViewProps> = ({
  view,
  onViewChange,
}) => {
  return (
    <ToggleGroup
      type="single"
      value={view}
      onValueChange={(value) => {
        if (value) onViewChange(value as 'table' | 'kanban');
      }}
      className="border rounded-md"
    >
      <ToggleGroupItem value="table" aria-label="Visualização em Tabela">
        <LayoutList className="h-5 w-5 mr-1" />
        <span className="hidden sm:inline">Tabela</span>
      </ToggleGroupItem>
      <ToggleGroupItem value="kanban" aria-label="Visualização em Kanban">
        <Trello className="h-5 w-5 mr-1" />
        <span className="hidden sm:inline">Kanban</span>
      </ToggleGroupItem>
    </ToggleGroup>
  );
};

export default OrdersToggleView;
