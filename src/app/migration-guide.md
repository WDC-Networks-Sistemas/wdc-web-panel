# OrdersContext Migration Guide

## Why We're Migrating

The `OrdersContext` was initially created when the project didn't have real APIs. It served as both a data provider and state manager. Now that we have real APIs, we've refactored this approach to follow best practices:

- **Separation of concerns**: Data fetching, state management, and UI logic are now separated
- **Improved maintainability**: Smaller, focused modules instead of one large context
- **Better testing**: Each piece can be tested in isolation
- **Performance**: More granular rendering control and better caching

## Migration Steps

### 1. Update Imports

Replace imports from the old context:

```diff
- import { useOrders, Order } from '@/contexts/OrdersContext';
+ import { useOrders } from '@/features/orders/hooks';
+ import { Order } from '@/features/orders/types/orders';
```

### 2. Replace Provider in Layout

If you were wrapping components with `OrdersProvider`, remove it:

```diff
- <OrdersProvider>
    <YourComponent />
- </OrdersProvider>
```

The new hooks handle their own state internally.

### 3. Use Component-Specific Hooks

For better performance in components that only need specific functionality:

```tsx
// Instead of using the full useOrders
import { useOrderSelection } from '@/features/orders/hooks';

function OrderDetails() {
  const { selectedOrder, setSelectedOrder } = useOrderSelection();
  // Component logic...
}
```

### 4. Update API Calls

If you were making direct API calls related to orders, use the service:

```tsx
import { ordersService } from '@/features/orders/services/ordersService';

// Then use it in your code
const orders = await ordersService.getOrders(filters);
```

## Common Use Cases

### Filtering Orders

```tsx
const { filteredOrders } = useOrders();
const pendingOrders = filteredOrders('pending');
```

### Pagination

```tsx
const { paginatedOrders, pagination, setCurrentPage, setPageSize } = useOrders();

// Use in your component
<PaginationComponent 
  currentPage={pagination.currentPage}
  totalPages={pagination.totalPages}
  onPageChange={setCurrentPage}
/>
```

### Order Actions

```tsx
const { approveOrder, rejectOrder } = useOrders();

// Then in event handlers
const handleApprove = async () => {
  await approveOrder(orderId, approverCode, tenantId);
  // Handle success
};
```

## Need Help?

Check the README in the `src/features/orders` directory for more details, or contact the architecture team for assistance with the migration.
