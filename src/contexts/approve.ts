export interface ApproveProps {
    OrderId: string;
    Type: string;
    ApproverCode: string;
    SystemCode: string;
}

export interface ApproveResponse {
    approval: string;
}