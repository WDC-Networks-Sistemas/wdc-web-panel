import {APPROVAL_STATUS} from "@/constants";

/**
 * Interface for pending buy order API request parameters
 */
export interface PendingBuyOrderProps {
    UserEmail: string;
    DateStart?: string;
    DateEnd?: string;
    Types: APPROVAL_STATUS;
    TenantId: string;
}

/**
 * Interface for individual order in pending buy orders
 */
export interface Order {
    Document: string;
    Type: string;
    Emission: string;
    Level: string;
    StatusCode: string;
    StatusDescription: string;
    Coin: number,
    CoinName: string,
    Amount: number,
    UserLiberation: string,
    UserLibnName: string,
    CurrencyRate: number,
    CoinSymbol: string,
    CoinValue: number,
    ReleaseValue: number,
    CodeGroup: string,
    NameGroup: string,
    Observations: string,
}

/**
 * Interface for pending buy order data
 */
export interface PendingBuyOrder {
    BranchCode: string;
    BranchName: string;
    UserEmail: string;
    UserCode: string;
    ApproverCode: string;
    UserName: string;
    NumberIssues: number;
    Interval: {
        StartIn: string;
        EndIn: string;
    }
    StatusFilter: string;
    Issues: Order[]
}

/**
 * Interface for buy order API response
 */
export interface PendingBuyOrderResponse {
    Approval: PendingBuyOrder[]
}