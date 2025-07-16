import { Order } from '../types/orders';

// Define the API response types to match the old context transformation
interface Issue {
  Document: string;
  NameGroup?: string;
  Amount: number;
  StatusCode: string;
  Emission: string;
  Type?: string;
  Level?: string;
  Observations?: string;
}

interface Branch {
  BranchCode: string;
  BranchName: string;
  UserEmail: string;
  ApproverCode?: string;
  Issues: Issue[];
}

interface PendingBuyOrdersResponse {
  Approval?: Branch[];
}

export const orderAdapter = {
  /**
   * Transform API data to our Order interface
   */
  transformApiResponse: (data: PendingBuyOrdersResponse): Order[] => {
    if (!data?.Approval) return [];

    const transformedOrders: Order[] = [];

    data.Approval.forEach(branch => {
      branch.Issues.forEach(issue => {
        transformedOrders.push({
          id: issue.Document,
          orderNumber: issue.Document,
          customer: issue.NameGroup || 'Unknown',
          email: branch.UserEmail,
          amount: issue.Amount,
          status: issue.StatusCode,
          date: issue.Emission,
          branchId: branch.BranchCode,
          branchCode: branch.BranchCode,
          branchName: branch.BranchName,
          approverCode: branch.ApproverCode,
          type: issue.Type,
          level: issue.Level,
          observations: issue.Observations
        });
      });
    });

    return transformedOrders;
  }
};
