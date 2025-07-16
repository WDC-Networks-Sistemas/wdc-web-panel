'use client'

import React from 'react';
import { useOrders } from '@/features/orders/hooks';

interface BranchSelectorProps {
  className?: string;
}

const BranchSelector: React.FC<BranchSelectorProps> = ({ className }) => {
  const { branches, selectedTenant, setSelectedTenant } = useOrders();

  return (
    <div className={`flex items-center gap-2 ${className || ''}`}>
      <label htmlFor="branch-select" className="text-sm font-medium text-gray-700">
        Filial:
      </label>
      <select
        id="branch-select"
        value={selectedTenant || ''}
        onChange={(e) => setSelectedTenant(e.target.value)}
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
