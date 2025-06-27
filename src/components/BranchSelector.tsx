'use client'

import React from 'react';
import { useOrders } from '@/contexts/OrdersContext';

interface BranchSelectorProps {
  className?: string;
}

const BranchSelector: React.FC<BranchSelectorProps> = ({ className }) => {
  const { branches, selectedBranch, setBranch } = useOrders();

  return (
    <div className={`flex items-center gap-2 ${className || ''}`}>
      <label htmlFor="branch-select" className="text-sm font-medium text-gray-700">
        Filial:
      </label>
      <select
        id="branch-select"
        value={selectedBranch || ''}
        onChange={(e) => setBranch(e.target.value || null)}
        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
      >
        <option value="">Todas as Filiais</option>
        {branches.map((branch) => (
          <option key={branch.id} value={branch.id}>
            {branch.name} ({branch.code})
          </option>
        ))}
      </select>
    </div>
  );
};

export default BranchSelector;
