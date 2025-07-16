import { Order } from '../types/orders';
import { formatCurrency, formatDate } from '@/shared/utils/formatters';

interface OrderCardProps {
  order: Order;
  onClick?: () => void;
}

export function OrderCard({ order, onClick }: OrderCardProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div 
      className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-medium text-lg">{order.orderNumber}</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
          {order.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <div>
          <p className="text-gray-500">Customer</p>
          <p className="font-medium">{order.customer}</p>
        </div>

        <div>
          <p className="text-gray-500">Amount</p>
          <p className="font-medium">{formatCurrency(order.amount)}</p>
        </div>

        <div>
          <p className="text-gray-500">Date</p>
          <p className="font-medium">{formatDate(order.date)}</p>
        </div>

        {order.branchName && (
          <div>
            <p className="text-gray-500">Branch</p>
            <p className="font-medium">{order.branchName}</p>
          </div>
        )}
      </div>
    </div>
  );
}
