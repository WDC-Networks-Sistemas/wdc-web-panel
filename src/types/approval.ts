/**
 * Interface for UpdateDocuments API parameters
 */
export interface UpdateDocumentsProps {
  OrderId: string;
  Type: string;
  ApproverCode: string;
  SystemCode: string;
  Tenant: string;
}

/**
 * Interface for rejecting documents with reason
 */
export interface RejectDocumentProps extends UpdateDocumentsProps {
  Reason: string;
}

/**
 * Interface for approval API response
 */
export interface ApproveResponse {
  approval: string;
}
