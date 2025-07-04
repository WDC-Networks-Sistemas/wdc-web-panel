/**
 * Enum for UI approval status types (used with react-query and UI components)
 */
export enum APPROVAL_STATUS_UI {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

/**
 * Labels for UI approval status
 */
export const APPROVAL_STATUS_UI_LABELS = {
  [APPROVAL_STATUS_UI.PENDING]: 'Pending',
  [APPROVAL_STATUS_UI.APPROVED]: 'Approved',
  [APPROVAL_STATUS_UI.REJECTED]: 'Rejected'
} as const;

/**
 * Type for UI approval status
 */
export type ApprovalStatusUIType = 'pending' | 'approved' | 'rejected';
