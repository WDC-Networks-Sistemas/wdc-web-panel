# Orders Feature

This folder contains the refactored orders feature, which replaces the previous `OrdersContext` with a more modular and maintainable architecture.

## Structure

- `types/`: Typescript interfaces and types for the orders domain
- `hooks/`: React hooks for consuming order data and actions
- `services/`: Business logic and service layer
- `api/`: API integration and network requests
- `adapters/`: Data transformation between API and application formats

## Migration from OrdersContext

The previous `OrdersContext` was a monolithic context that handled:
- Data fetching
- State management
- Filtering and pagination
- Actions (approve/reject)

This has been refactored into separate concerns:

### Main Hook: `useOrders`

Replaces the old context with a composable hook that provides the same API surface:

```tsx
const {
  orders,
  isLoading,
  filteredOrders,
  approveOrder,
  rejectOrder,
  // ... other properties and methods
} = useOrders();
```

### Specialized Hooks

- `useOrdersData`: Handles data fetching, filtering and pagination
- `useOrderActions`: Handles approving and rejecting orders
- `useOrderSelection`: Manages the selected order state

## How to Use

Replace imports from the old context:

```tsx
// Old way
import { useOrders } from '@/contexts/OrdersContext';

// New way
import { useOrders } from '@/features/orders/hooks';
```

The API remains largely the same, so components should work with minimal changes.

## Future Improvements

- Add more specialized hooks for specific use cases
- Implement optimistic updates for better UX
- Add caching strategies for frequently accessed data
- Implement proper error handling and retry logic
