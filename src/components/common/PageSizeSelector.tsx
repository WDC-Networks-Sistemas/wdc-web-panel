import React from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useOrders } from '@/features/orders/hooks'

interface PageSizeSelectorProps {
  className?: string;
}

const PageSizeSelector: React.FC<PageSizeSelectorProps> = ({ className }) => {
  const { pagination } = useOrders();

  const handleChange = (value: string) => {
    pagination.setPageSize(Number(value));
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-sm text-gray-500">Itens por página:</span>
      <Select value={String(pagination.pageSize)} onValueChange={handleChange}>
        <SelectTrigger className="w-[70px] h-8">
          <SelectValue placeholder="5" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="15">15</SelectItem>
            <SelectItem value="20">20</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default PageSizeSelector;
