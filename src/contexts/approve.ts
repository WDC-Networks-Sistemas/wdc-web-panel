export interface UpdateDocumentsProps {
    OrderId: string;
    Type: string;
    ApproverCode: string;
    SystemCode: string;
    Tenant: string;
}

export interface ApproveResponse {
    approval: string;
}