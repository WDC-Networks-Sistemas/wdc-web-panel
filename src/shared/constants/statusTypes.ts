// API Status types (as received from the backend)
export const APPROVAL_STATUS_API = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;

// UI Status types (as displayed in the frontend)
export const APPROVAL_STATUS_UI = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;

// Status type guards
export type ApprovalStatus = typeof APPROVAL_STATUS_API[keyof typeof APPROVAL_STATUS_API];

export function isValidStatus(status: string): status is ApprovalStatus {
  return Object.values(APPROVAL_STATUS_API).includes(status as ApprovalStatus);
}
