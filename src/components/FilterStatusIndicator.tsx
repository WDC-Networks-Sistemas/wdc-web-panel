import React from 'react';
import { useOrders } from '@/contexts/OrdersContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

const FilterStatusIndicator: React.FC = () => {
  const { searchQuery, dateRange, filteredBySearchAndDate, orders, resetFilters } = useOrders();

  const isFiltered = searchQuery || dateRange.from || dateRange.to;

  if (!isFiltered) {
    return null;
  }

  return (
    <div className="px-6 py-2 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-500">
          Exibindo {filteredBySearchAndDate.length} de {orders.length} pedidos
        </span>

        <div className="flex flex-wrap gap-2">
          {searchQuery && (
            <Badge variant="outline" className="flex items-center gap-1 bg-blue-50 text-blue-700 border-blue-200">
              Busca: {searchQuery}
            </Badge>
          )}

          {dateRange.from && (
            <Badge variant="outline" className="flex items-center gap-1 bg-blue-50 text-blue-700 border-blue-200">
              De: {format(dateRange.from, "dd/MM/yyyy", { locale: ptBR })}
              {dateRange.to && ` até ${format(dateRange.to, "dd/MM/yyyy", { locale: ptBR })}`}
            </Badge>
          )}
        </div>
      </div>

      <button 
        onClick={resetFilters}
        className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
      >
        <X className="h-3 w-3" />
        Limpar filtros
      </button>
    </div>
  );
};

export default FilterStatusIndicator;
