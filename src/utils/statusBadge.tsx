import { Badge } from '@/components/ui/badge';
import { Check, X, Clock } from 'lucide-react';
import { APPROVAL_STATUS, APPROVAL_STATUS_LABELS } from '@/constants/approvalStatus';
import { Order } from '@/contexts/OrdersContext';

/**
 * Returns a styled badge component based on the approval status
 * @param status The order approval status
 * @returns A Badge component with appropriate styling and icon
 */
export const getStatusBadge = (status: Order['status']) => {
  const variants = {
    [APPROVAL_STATUS.PENDING]: { variant: 'secondary' as const, text: APPROVAL_STATUS_LABELS[APPROVAL_STATUS.PENDING], icon: Clock },
    [APPROVAL_STATUS.WAITING_PREVIOUS_LEVEL]: { variant: 'secondary' as const, text: APPROVAL_STATUS_LABELS[APPROVAL_STATUS.WAITING_PREVIOUS_LEVEL], icon: Clock },
    [APPROVAL_STATUS.APPROVED]: { variant: 'default' as const, text: APPROVAL_STATUS_LABELS[APPROVAL_STATUS.APPROVED], icon: Check },
    [APPROVAL_STATUS.APPROVED_OTHER_APPROVER]: { variant: 'default' as const, text: APPROVAL_STATUS_LABELS[APPROVAL_STATUS.APPROVED_OTHER_APPROVER], icon: Check },
    [APPROVAL_STATUS.REJECTED]: { variant: 'destructive' as const, text: APPROVAL_STATUS_LABELS[APPROVAL_STATUS.REJECTED], icon: X },
    [APPROVAL_STATUS.BLOCKED]: { variant: 'destructive' as const, text: APPROVAL_STATUS_LABELS[APPROVAL_STATUS.BLOCKED], icon: X },
    [APPROVAL_STATUS.REJECTED_BLOCKED_OTHER_APPROVER]: { variant: 'destructive' as const, text: APPROVAL_STATUS_LABELS[APPROVAL_STATUS.REJECTED_BLOCKED_OTHER_APPROVER], icon: X },
  };

  // Default to pending if status is not recognized
  const statusData = variants[status] || variants[APPROVAL_STATUS.PENDING];
  const { variant, text, icon: Icon } = statusData;

  return (
    <Badge variant={variant} className="flex items-center gap-1">
      <Icon className="w-3 h-3" />
      {text}
    </Badge>
  );
};
