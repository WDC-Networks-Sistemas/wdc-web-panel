'use client';

import { useState } from 'react';
import { OrderFilters as OrderFiltersType } from '../types/orders';

interface OrderFiltersProps {
  filters: OrderFiltersType;
  onFiltersChange: (filters: OrderFiltersType) => void;
}

export function OrderFilters({ filters, onFiltersChange }: OrderFiltersProps) {
  const [localFilters, setLocalFilters] = useState<OrderFiltersType>(filters);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFilters = {
      ...localFilters,
      status: e.target.value || undefined,
    };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFilters = {
      ...localFilters,
      searchQuery: e.target.value || undefined,
    };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFilters = {
      ...localFilters,
      dateRange: {
        ...localFilters.dateRange,
        from: e.target.value ? new Date(e.target.value) : undefined,
      },
    };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFilters = {
      ...localFilters,
      dateRange: {
        ...localFilters.dateRange,
        to: e.target.value ? new Date(e.target.value) : undefined,
      },
    };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleResetFilters = () => {
    const emptyFilters: OrderFiltersType = {};
    setLocalFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            value={localFilters.status || ''}
            onChange={handleStatusChange}
            className="w-full p-2 border rounded"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Search</label>
          <input
            type="text"
            value={localFilters.searchQuery || ''}
            onChange={handleSearchChange}
            placeholder="Search orders..."
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Start Date</label>
          <input
            type="date"
            value={localFilters.dateRange?.from
              ? new Date(localFilters.dateRange.from).toISOString().split('T')[0]
              : ''}
            onChange={handleStartDateChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">End Date</label>
          <input
            type="date"
            value={localFilters.dateRange?.to
              ? new Date(localFilters.dateRange.to).toISOString().split('T')[0]
              : ''}
            onChange={handleEndDateChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          onClick={handleResetFilters}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
