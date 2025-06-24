import React, { useMemo } from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useOrders, Order } from '@/contexts/OrdersContext';
import { MapPin, ShoppingBag, Calendar, TrendingUp, PieChart } from 'lucide-react';
import OrderStatusGraph from '@/components/OrderStatusGraph';

const ClientHistoryCard: React.FC = () => {
  const { orders, selectedOrder, getCustomerOrders } = useOrders();

  // Get customer from selected order
  const customerName = selectedOrder?.customer;

  // Compute client history data
  const clientData = useMemo(() => {
    if (!customerName) return null;

    // Get all orders for this customer
    const customerOrders = getCustomerOrders(customerName);

    // Sort by date (newest first)
    const sortedOrders = [...customerOrders].sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    // Get last 3 orders
    const lastOrders = sortedOrders.slice(0, 3);

    // Calculate total amount in the last 12 months
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const totalLast12Months = customerOrders
      .filter(order => new Date(order.date) >= twelveMonthsAgo)
      .reduce((sum, order) => sum + order.amount, 0);

    // Extract unique locations from customer orders
    const locations = Array.from(new Set(
      customerOrders
        .filter(order => order.address)
        .map(order => {
          // Extract city and state from address
          const addressParts = order.address?.split(' - ');
          return addressParts && addressParts.length > 1 ? addressParts[1] : order.address;
        })
    ));

    return {
      totalOrders: customerOrders.length,
      lastOrders,
      totalLast12Months,
      locations
    };
  }, [customerName, orders]);

  // If no client is selected or data is not available
  if (!customerName || !clientData) {
    return (
      <Card className="h-full bg-gray-50 border-dashed border-gray-200 flex flex-col">
        <CardContent className="flex items-center justify-center flex-1">
          <p className="text-gray-500 text-center p-6">
            Selecione um pedido para ver o histórico do cliente
          </p>
        </CardContent>
      </Card>
    );
  }

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    });
  };

  const getOrderStatusBadge = (status: Order['status']) => {
    const variants = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };

    const labels = {
      pending: 'Pendente',
      approved: 'Aprovado',
      rejected: 'Rejeitado',
    };

    return (
      <Badge className={`${variants[status]} font-medium text-xs`}>
        {labels[status]}
      </Badge>
    );
  };

  return (
    <Card className="h-full overflow-hidden flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <ShoppingBag className="h-5 w-5" />
          Histórico do Cliente
        </CardTitle>
        <CardDescription>
          Informações de {customerName}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 overflow-auto flex-1">
        {/* Total de compras nos últimos 12 meses */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-gray-500" />
            <h4 className="font-medium text-sm">Total nos últimos 12 meses</h4>
          </div>
          <p className="text-2xl font-bold text-green-600">
            {formatCurrency(clientData.totalLast12Months)}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {clientData.totalOrders} pedido{clientData.totalOrders !== 1 ? 's' : ''} no total
          </p>
        </div>

        {/* Últimos 3 pedidos */}
        <div>
          <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            Últimos Pedidos
          </h4>
          <div className="space-y-3">
            {clientData.lastOrders.map(order => (
              <div key={order.id} className="bg-gray-50 p-3 rounded-md">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-medium text-sm">{order.id}</span>
                  {getOrderStatusBadge(order.status)}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {new Date(order.date).toLocaleDateString('pt-BR')}
                  </span>
                  <span className="font-medium">
                    {formatCurrency(order.amount)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Localizações */}
        {clientData.locations.length > 0 && (
          <div>
            <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              Localizações
            </h4>
            <div className="flex flex-wrap gap-2">
              {clientData.locations.map((location, index) => (
                <Badge key={index} variant="outline" className="bg-gray-50">
                  {location}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Status dos Pedidos */}
        <div>
          <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
            <PieChart className="h-4 w-4 text-gray-500" />
            Status dos Pedidos
          </h4>
          <OrderStatusGraph customerName={customerName} />
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientHistoryCard;
