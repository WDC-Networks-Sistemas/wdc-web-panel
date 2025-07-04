import { APPROVAL_STATUS as API_APPROVAL_STATUS, ApprovalStatusType } from '@/constants/approvalStatus';
import { APPROVAL_STATUS_UI, ApprovalStatusUIType } from '@/constants/statusTypes';

/**
 * Maps API approval status codes to UI approval status values
 */
export const mapApiStatusToUiStatus = (apiStatus: ApprovalStatusType): ApprovalStatusUIType => {
  // Map API statuses to UI statuses
  switch (apiStatus) {
    case API_APPROVAL_STATUS.APPROVED:
    case API_APPROVAL_STATUS.APPROVED_OTHER_APPROVER:
      return APPROVAL_STATUS_UI.APPROVED;

    case API_APPROVAL_STATUS.REJECTED:
    case API_APPROVAL_STATUS.REJECTED_BLOCKED_OTHER_APPROVER:
    case API_APPROVAL_STATUS.BLOCKED:
      return APPROVAL_STATUS_UI.REJECTED;

    case API_APPROVAL_STATUS.PENDING:
    case API_APPROVAL_STATUS.WAITING_PREVIOUS_LEVEL:
    default:
      return APPROVAL_STATUS_UI.PENDING;
  }
};

/**
 * Maps UI approval status to API approval status codes
 */
export const mapUiStatusToApiStatus = (uiStatus: ApprovalStatusUIType): ApprovalStatusType => {
  // Map UI statuses to API statuses (default to most common values)
  switch (uiStatus) {
    case APPROVAL_STATUS_UI.APPROVED:
      return API_APPROVAL_STATUS.APPROVED;

    case APPROVAL_STATUS_UI.REJECTED:
      return API_APPROVAL_STATUS.REJECTED;

    case APPROVAL_STATUS_UI.PENDING:
    default:
      return API_APPROVAL_STATUS.PENDING;
  }
};
