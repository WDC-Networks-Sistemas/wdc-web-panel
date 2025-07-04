/**
 * Interface for order data
 */
export interface Order {
  id: string;
  orderNumber: string;
  customer: string;
  email: string;
  amount: number;
  status: string;
  date: string;
  items?: OrderItem[];
}

/**
 * Interface for order item
 */
export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}
