export interface KanbanCardItem {
  id: string;
  orderNumber: string;
  customer: string;
  email: string;
  amount: number;
  status: string;
  date: string;
  branchCode?: string;
  branchName?: string;
}

export interface KanbanBoardData {
  pending: KanbanCardItem[];
  approved: KanbanCardItem[];
  rejected: KanbanCardItem[];
  [key: string]: KanbanCardItem[];
}

export interface KanbanFilters {
  searchQuery?: string;
  dateRange?: {
    from?: Date;
    to?: Date;
  };
  branchId?: string;
  tenantId?: string;
}
