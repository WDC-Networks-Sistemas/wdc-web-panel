export interface PendingBuyOrderProps {
    user_email: string;
    date_begin?: string;
    date_end?: string;
    types: string;
}

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

export interface BuyOrderResponse {
    approval: PendingBuyOrder[]
}