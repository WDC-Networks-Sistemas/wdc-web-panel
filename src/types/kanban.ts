/**
 * Interface for kanban card item
 */
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

/**
 * Interface for kanban board data
 */
export interface KanbanBoardData {
  pending: KanbanCardItem[];
  approved: KanbanCardItem[];
  rejected: KanbanCardItem[];
}
