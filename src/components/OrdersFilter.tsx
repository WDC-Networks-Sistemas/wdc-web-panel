import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, Search, X } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useOrders } from '@/contexts/OrdersContext';

const OrdersFilter: React.FC = () => {
  const { setSearchQuery, setDateRange, searchQuery, dateRange, resetFilters } = useOrders();
  const [searchText, setSearchText] = useState(searchQuery || '');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchText);
  };

  const handleResetSearch = () => {
    setSearchText('');
    setSearchQuery('');
  };

  const handleResetDateRange = () => {
    setDateRange({ from: undefined, to: undefined });
  };

  const handleResetAll = () => {
    resetFilters();
    setSearchText('');
  };

  return (
    <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:space-x-4 lg:items-center">
      {/* Search by ID or Customer */}
      <form onSubmit={handleSearchSubmit} className="flex-1 flex">
        <div className="relative w-full">
          <Input
            placeholder="Buscar por ID ou cliente..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="pr-8"
          />
          {searchText && (
            <button
              type="button"
              onClick={handleResetSearch}
              className="absolute right-10 top-0 h-full flex items-center justify-center text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            type="submit"
            className="absolute right-2 top-0 h-full flex items-center justify-center text-gray-500 hover:text-gray-700"
          >
            <Search className="h-4 w-4" />
          </button>
        </div>
      </form>

      {/* Date Range Picker */}
      <div className="flex items-center space-x-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "justify-start text-left font-normal w-[240px]",
                !dateRange.from && !dateRange.to && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "dd/MM/yyyy", { locale: ptBR })} - {format(dateRange.to, "dd/MM/yyyy", { locale: ptBR })}
                  </>
                ) : (
                  format(dateRange.from, "dd/MM/yyyy", { locale: ptBR })
                )
              ) : (
                "Filtrar por data"
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange.from || new Date()}
              selected={{
                from: dateRange.from,
                to: dateRange.to,
              }}
              onSelect={setDateRange}
              numberOfMonths={2}
              locale={ptBR}
            />
            <div className="p-3 border-t border-border">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleResetDateRange}
                className="text-xs text-muted-foreground"
              >
                Limpar datas
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* Reset All Filters */}
        {(searchQuery || dateRange.from || dateRange.to) && (
          <Button variant="ghost" size="sm" onClick={handleResetAll}>
            <X className="h-4 w-4 mr-1" />
            Limpar filtros
          </Button>
        )}
      </div>
    </div>
  );
};

export default OrdersFilter;
