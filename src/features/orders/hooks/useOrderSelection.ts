import { useState } from 'react';
import { Order } from '../types/orders';

export const useOrderSelection = () => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  return {
    selectedOrder,
    setSelectedOrder
  };
};
