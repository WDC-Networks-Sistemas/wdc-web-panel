'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { OrderCard } from './OrderCard';
import { OrderFilters } from './OrderFilters';
import { useOrders } from '../hooks/useOrders';
import { OrderFilters as OrderFiltersType } from '../types/orders';

export function OrdersList() {
  const router = useRouter();
  const [filters, setFilters] = useState<OrderFiltersType>({});
  const { data: orders, isLoading, error } = useOrders(filters);

  const handleOrderClick = (orderId: string) => {
    router.push(`/orders/${orderId}`);
  };

  return (
    <div className="space-y-6">
      <OrderFilters filters={filters} onFiltersChange={setFilters} />

      {isLoading && (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">
          Error loading orders: {error instanceof Error ? error.message : 'Unknown error'}
        </div>
      )}

      {!isLoading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders?.map(order => (
            <OrderCard 
              key={order.id} 
              order={order} 
              onClick={() => handleOrderClick(order.id)}
            />
          ))}

          {orders?.length === 0 && (
            <div className="col-span-full text-center py-8 text-gray-500">
              No orders found matching your criteria
            </div>
          )}
        </div>
      )}
    </div>
  );
}
