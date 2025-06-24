import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useOrders } from '@/contexts/OrdersContext';

interface OrderStatusGraphProps {
  customerName?: string;
}

const OrderStatusGraph: React.FC<OrderStatusGraphProps> = ({ customerName }) => {
  const { orders, getCustomerOrders } = useOrders();

  const data = useMemo(() => {
    const targetOrders = customerName ? getCustomerOrders(customerName) : orders;

    // Count order statuses
    const statusCounts = targetOrders.reduce<Record<string, number>>(
      (acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      },
      {}
    );

    // Transform to chart data format
    return [
      { name: 'Pendente', value: statusCounts['pending'] || 0, color: '#f59e0b' },
      { name: 'Aprovado', value: statusCounts['approved'] || 0, color: '#10b981' },
      { name: 'Rejeitado', value: statusCounts['rejected'] || 0, color: '#ef4444' },
    ].filter(item => item.value > 0);
  }, [orders, customerName, getCustomerOrders]);

  // If there's no data, don't render the chart
  if (data.length === 0) {
    return null;
  }

  return (
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => [`${value} pedido${value !== 1 ? 's' : ''}`, '']}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OrderStatusGraph;
