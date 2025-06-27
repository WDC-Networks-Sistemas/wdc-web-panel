'use client'

import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useOrders } from '@/contexts/OrdersContext';

interface OrderStatusGraphProps {
  customerName?: string;
  branchId?: string; // New prop for branch filtering
}

const OrderStatusGraph: React.FC<OrderStatusGraphProps> = ({ customerName, branchId }) => {
  const { 
    orders, 
    getCustomerOrders, 
    getOrdersByBranch, 
    getBranchOrders,
    selectedBranch,
    branches 
  } = useOrders();

  const data = useMemo(() => {
    let targetOrders = orders;

    // Apply branch filtering
    if (branchId) {
      targetOrders = getOrdersByBranch(branchId);
    } else if (selectedBranch) {
      targetOrders = getBranchOrders();
    }

    // Apply customer filtering if specified
    if (customerName) {
      targetOrders = targetOrders.filter(order => 
        order.customer.toLowerCase().includes(customerName.toLowerCase())
      );
    }

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
  }, [orders, customerName, branchId, selectedBranch, getOrdersByBranch, getBranchOrders]);

  // Get branch name for display
  const branchName = useMemo(() => {
    const targetBranchId = branchId || selectedBranch;
    if (!targetBranchId) return null;

    const branch = branches.find(b => b.id === targetBranchId);
    return branch?.name || null;
  }, [branchId, selectedBranch, branches]);

  // If there's no data, don't render the chart
  if (data.length === 0) {
    return (
      <div className="h-[200px] w-full flex items-center justify-center text-gray-500">
        <p>Nenhum pedido encontrado{branchName && ` para ${branchName}`}</p>
      </div>
    );
  }

  return (
    <div className="h-[200px] w-full" style={{ minHeight: '200px' }}>
      {branchName && (
        <div className="text-sm text-gray-600 mb-2 text-center">
          Filial: {branchName}
        </div>
      )}
      <ResponsiveContainer width="100%" height="100%">
        <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={70}
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
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OrderStatusGraph;
