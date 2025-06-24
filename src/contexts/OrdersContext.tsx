import React, { createContext, useState, useContext, ReactNode, useMemo } from 'react';

export interface Order {
  id: string;
  customer: string;
  email: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
  address?: string;
  phone?: string;
  items?: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  paymentMethod?: 'credit' | 'debit' | 'cash' | 'bank_transfer';
  notes?: string;
  rejectionReason?: string;
}

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface PaginationConfig {
  pageSize: number;
  currentPage: number;
  totalItems: number;
  totalPages: number;
}

interface OrdersContextType {
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  updateOrderStatus: (orderId: string, newStatus: Order['status']) => void;
  updateOrderStatusWithReason: (orderId: string, newStatus: Order['status'], reason?: string) => void;
  selectedOrder: Order | null;
  setSelectedOrder: (order: Order | null) => void;
  getOrderById: (id: string) => Order | undefined;
  getCustomerOrders: (customerName: string) => Order[];
  pagination: PaginationConfig;
  paginatedOrders: Order[];
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  filteredOrders: (status?: Order['status']) => Order[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
  resetFilters: () => void;
  filteredBySearchAndDate: Order[];
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export const useOrders = () => {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrdersProvider');
  }
  return context;
};

interface OrdersProviderProps {
  children: ReactNode;
}

export const OrdersProvider: React.FC<OrdersProviderProps> = ({ children }) => {
  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);

  // Filtering state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined
  });

  // Handler for page size changes that also resets the current page
  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setDateRange({ from: undefined, to: undefined });
    setCurrentPage(1);
  };

  const [orders, setOrders] = useState<Order[]>([
    { 
      id: '#001', 
      customer: 'João Silva', 
      email: 'joao@email.com', 
      amount: 1250.00, 
      status: 'pending', 
      date: '2024-01-15',
      address: 'Rua das Flores, 123 - São Paulo, SP',
      phone: '(11) 98765-4321',
      paymentMethod: 'credit',
      items: [
        { name: 'Notebook Dell XPS', quantity: 1, price: 950.00 },
        { name: 'Mouse sem fio', quantity: 2, price: 150.00 }
      ],
      notes: 'Entregar em horário comercial'
    },
    { 
      id: '#006', 
      customer: 'João Silva', 
      email: 'joao@email.com', 
      amount: 780.50, 
      status: 'approved', 
      date: '2023-11-20',
      address: 'Rua das Flores, 123 - São Paulo, SP',
      phone: '(11) 98765-4321',
      paymentMethod: 'credit',
      items: [
        { name: 'Monitor LED 24"', quantity: 1, price: 780.50 }
      ]
    },
    { 
      id: '#012', 
      customer: 'João Silva', 
      email: 'joao@email.com', 
      amount: 350.25, 
      status: 'approved', 
      date: '2023-08-05',
      address: 'Av. Ipiranga, 500 - São Paulo, SP',
      phone: '(11) 98765-4321',
      paymentMethod: 'debit',
      items: [
        { name: 'Teclado Mecânico', quantity: 1, price: 350.25 }
      ]
    },
    { 
      id: '#018', 
      customer: 'João Silva', 
      email: 'joao@email.com', 
      amount: 2200.00, 
      status: 'approved', 
      date: '2023-05-12',
      address: 'Rua das Flores, 123 - São Paulo, SP',
      phone: '(11) 98765-4321',
      paymentMethod: 'credit',
      items: [
        { name: 'Smartphone iPhone', quantity: 1, price: 2200.00 }
      ]
    },
    { 
      id: '#025', 
      customer: 'João Silva', 
      email: 'joao@email.com', 
      amount: 120.00, 
      status: 'rejected', 
      date: '2023-03-18',
      address: 'Rua Augusta, 1500 - São Paulo, SP',
      phone: '(11) 98765-4321',
      paymentMethod: 'cash',
      items: [
        { name: 'Fones de Ouvido', quantity: 1, price: 120.00 }
      ],
      notes: 'Produto não disponível'
    },
    { 
      id: '#030', 
      customer: 'Maria Santos', 
      email: 'maria@email.com', 
      amount: 1500.00, 
      status: 'approved', 
      date: '2023-12-10',
      address: 'Av. Paulista, 1000 - São Paulo, SP',
      phone: '(11) 91234-5678',
      paymentMethod: 'credit',
      items: [
        { name: 'Tablet Samsung', quantity: 1, price: 1500.00 }
      ]
    },
    { 
      id: '#036', 
      customer: 'Maria Santos', 
      email: 'maria@email.com', 
      amount: 450.75, 
      status: 'approved', 
      date: '2023-09-28',
      address: 'Av. Rebouças, 750 - São Paulo, SP',
      phone: '(11) 91234-5678',
      paymentMethod: 'bank_transfer',
      items: [
        { name: 'Impressora HP', quantity: 1, price: 450.75 }
      ]
    },
    { 
      id: '#042', 
      customer: 'Pedro Costa', 
      email: 'pedro@email.com', 
      amount: 1200.00, 
      status: 'approved', 
      date: '2023-11-05',
      address: 'Rua Bela Vista, 45 - Rio de Janeiro, RJ',
      phone: '(21) 98877-6655',
      paymentMethod: 'credit',
      items: [
        { name: 'Console PlayStation', quantity: 1, price: 1200.00 }
      ]
    },
    { 
      id: '#048', 
      customer: 'Pedro Costa', 
      email: 'pedro@email.com', 
      amount: 300.00, 
      status: 'rejected', 
      date: '2023-07-22',
      address: 'Av. Atlântica, 200 - Rio de Janeiro, RJ',
      phone: '(21) 98877-6655',
      paymentMethod: 'debit',
      items: [
        { name: 'Jogo Digital', quantity: 1, price: 300.00 }
      ],
      notes: 'Cartão recusado'
    },
    { 
      id: '#002', 
      customer: 'Maria Santos', 
      email: 'maria@email.com', 
      amount: 890.50, 
      status: 'approved', 
      date: '2024-01-14',
      address: 'Av. Paulista, 1000 - São Paulo, SP',
      phone: '(11) 91234-5678',
      paymentMethod: 'debit',
      items: [
        { name: 'Smartphone Samsung', quantity: 1, price: 890.50 }
      ]
    },
    { 
      id: '#003', 
      customer: 'Pedro Costa', 
      email: 'pedro@email.com', 
      amount: 2100.00, 
      status: 'pending', 
      date: '2024-01-14',
      address: 'Rua Bela Vista, 45 - Rio de Janeiro, RJ',
      phone: '(21) 98877-6655',
      paymentMethod: 'bank_transfer',
      items: [
        { name: 'Smart TV 55"', quantity: 1, price: 2100.00 }
      ],
      notes: 'Confirmar pagamento antes do envio'
    },
    { 
      id: '#004', 
      customer: 'Ana Oliveira', 
      email: 'ana@email.com', 
      amount: 675.25, 
      status: 'rejected', 
      date: '2024-01-13',
      address: 'Av. Brasil, 789 - Belo Horizonte, MG',
      phone: '(31) 97777-8888',
      paymentMethod: 'credit',
      items: [
        { name: 'Tablet iPad', quantity: 1, price: 675.25 }
      ],
      notes: 'Cartão recusado'
    },
    { 
      id: '#005', 
      customer: 'Carlos Ferreira', 
      email: 'carlos@email.com', 
      amount: 1500.75, 
      status: 'approved', 
      date: '2024-01-13',
      address: 'Rua das Palmeiras, 222 - Curitiba, PR',
      phone: '(41) 96543-2109',
      paymentMethod: 'cash',
      items: [
        { name: 'Câmera DSLR', quantity: 1, price: 1200.75 },
        { name: 'Tripé', quantity: 1, price: 300.00 }
      ]
    },
  ]);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(currentOrders => 
      currentOrders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const updateOrderStatusWithReason = (orderId: string, newStatus: Order['status'], reason?: string) => {
    setOrders(currentOrders => 
      currentOrders.map(order => 
        order.id === orderId ? { 
          ...order, 
          status: newStatus,
          rejectionReason: newStatus === 'rejected' ? reason : order.rejectionReason 
        } : order
      )
    );
  };

  const getOrderById = (id: string) => {
    return orders.find(order => order.id === id);
  };

  const getCustomerOrders = (customerName: string) => {
    return orders.filter(order => order.customer === customerName);
  };

  // Filter orders by search query and date range
  const filteredBySearchAndDate = useMemo(() => {
    return orders.filter(order => {
      // Search filter
      const searchMatch = !searchQuery || 
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
        order.customer.toLowerCase().includes(searchQuery.toLowerCase());

      // Date range filter
      const orderDate = new Date(order.date);
      const dateMatch = (!dateRange.from || orderDate >= dateRange.from) && 
                        (!dateRange.to || orderDate <= new Date(dateRange.to.getTime() + 86400000)); // Add 1 day to include the end date fully

      return searchMatch && dateMatch;
    });
  }, [orders, searchQuery, dateRange]);

  // Get filtered orders by status, search, and date
  const filteredOrders = (status?: Order['status']) => {
    if (!status) return filteredBySearchAndDate;
    return filteredBySearchAndDate.filter(order => order.status === status);
  };

  // Calculate pagination data based on filtered results
  const totalItems = filteredBySearchAndDate.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  // Get paginated orders
  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredBySearchAndDate.slice(startIndex, endIndex);
  }, [filteredBySearchAndDate, currentPage, pageSize]);

  // Pagination config object
  const pagination: PaginationConfig = {
    pageSize,
    currentPage,
    totalItems,
    totalPages
  };

  return (
    <OrdersContext.Provider value={{ 
      orders, 
      setOrders, 
      updateOrderStatus, 
      updateOrderStatusWithReason,
      selectedOrder, 
      setSelectedOrder,
      getOrderById,
      getCustomerOrders,
      pagination,
      paginatedOrders,
      setCurrentPage,
      setPageSize: handlePageSizeChange,
      filteredOrders,
      searchQuery,
      setSearchQuery,
      dateRange,
      setDateRange,
      resetFilters,
      filteredBySearchAndDate
    }}>
      {children}
    </OrdersContext.Provider>
  );
};
