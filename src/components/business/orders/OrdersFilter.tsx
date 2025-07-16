'use client'
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DateRangePicker } from '@/components/ui/date-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Calendar, X } from 'lucide-react';
import { useOrders } from '@/features/orders/hooks';
import { DateRange } from '@/features/orders/types/orders';

const OrdersFilter: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    dateRange,
    setDateRange,
    selectedTenant,
    setSelectedTenant,
    resetFilters
  } = useOrders();

  // No additional state or functions needed - the DateRangePicker component handles everything

  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <div className="relative flex-1">
        <Input
          placeholder="Buscar por número, cliente ou filial..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
      </div>

      <div>
        <DateRangePicker
          dateRange={dateRange}
          onChange={setDateRange}
          align="start"
        />
      </div>

      <Select 
        value={selectedTenant} 
        onValueChange={setSelectedTenant}
      >
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Filial" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="01,01">Filial 01</SelectItem>
          <SelectItem value="02,01">Filial 02</SelectItem>
          <SelectItem value="03,01">Filial 03</SelectItem>
        </SelectContent>
      </Select>

      <Button variant="ghost" size="icon" onClick={resetFilters} title="Limpar filtros">
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default OrdersFilter;