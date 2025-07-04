// Constants for document approval status
export const APPROVAL_STATUS = {
  WAITING_PREVIOUS_LEVEL: '01',
  PENDING: '02',
  APPROVED: '03',
  BLOCKED: '04',
  APPROVED_OTHER_APPROVER: '05',
  REJECTED: '06',
  REJECTED_BLOCKED_OTHER_APPROVER: '07'
} as const;

// Status labels mapping
export const APPROVAL_STATUS_LABELS = {
  [APPROVAL_STATUS.WAITING_PREVIOUS_LEVEL]: 'Aguardando nível anterior',
  [APPROVAL_STATUS.PENDING]: 'Pendente',
  [APPROVAL_STATUS.APPROVED]: 'Liberado',
  [APPROVAL_STATUS.BLOCKED]: 'Bloqueado',
  [APPROVAL_STATUS.APPROVED_OTHER_APPROVER]: 'Liberado outro aprov.',
  [APPROVAL_STATUS.REJECTED]: 'Rejeitado',
  [APPROVAL_STATUS.REJECTED_BLOCKED_OTHER_APPROVER]: 'Rej/Bloq outro aprov.'
} as const;

// Type for approval status values
export type ApprovalStatusType = typeof APPROVAL_STATUS[keyof typeof APPROVAL_STATUS];

// Helper function to get status label
export const getApprovalStatusLabel = (status: ApprovalStatusType): string => {
  return APPROVAL_STATUS_LABELS[status] || 'Status desconhecido';
};

// Helper function to check if status is approved
export const isApprovedStatus = (status: ApprovalStatusType): boolean => {
  return status === APPROVAL_STATUS.APPROVED || status === APPROVAL_STATUS.APPROVED_OTHER_APPROVER;
};

export const isRejectedOrBlockedStatus = (status: ApprovalStatusType): boolean => {
  const rejectedOrBlockedStatuses: ApprovalStatusType[] = [
    APPROVAL_STATUS.BLOCKED,
    APPROVAL_STATUS.REJECTED,
    APPROVAL_STATUS.REJECTED_BLOCKED_OTHER_APPROVER
  ] as const;
  
  return rejectedOrBlockedStatuses.includes(status);
};

const PENDING_STATUSES = [
  APPROVAL_STATUS.WAITING_PREVIOUS_LEVEL,
  APPROVAL_STATUS.PENDING
] as const;

export const isPendingStatus = (status: ApprovalStatusType): boolean => {
  return PENDING_STATUSES.includes(status);
};