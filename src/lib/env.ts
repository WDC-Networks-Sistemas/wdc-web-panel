/**
 * Environment variables with type safety
 */
export const env = {
  /**
   * Base URL for API requests
   */
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://172.19.1.31:26501/rest01/',

  /**
   * Default tenant ID
   */
  defaultTenantId: process.env.NEXT_PUBLIC_DEFAULT_TENANT_ID || '01',

  /**
   * Default approver code
   */
  defaultApproverCode: process.env.NEXT_PUBLIC_DEFAULT_APPROVER_CODE || 'DEFAULT',

  /**
   * API request timeout in milliseconds
   */
  apiTimeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000', 10),

  /**
   * Environment name
   */
  environment: process.env.NEXT_PUBLIC_ENVIRONMENT || 'development',

  /**
   * Check if we're in development mode
   */
  isDevelopment: process.env.NODE_ENV === 'development',

  /**
   * Check if we're in production mode
   */
  isProduction: process.env.NODE_ENV === 'production',

  /**
   * Default authorization token for API requests
   * This should be obtained from a secure authentication process in production
   */
  authToken: process.env.NEXT_PUBLIC_AUTH_TOKEN || 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InBKd3RQdWJsaWNLZXlGb3IyNTYifQ.eyJpc3MiOiJUT1RWUy1BRFZQTC1GV0pXVCIsInN1YiI6IndvcmtmbG93LnRlYW1zIiwiaWF0IjoxNzUxMjk2MTU3LCJ1c2VyaWQiOiIwMDExNzAiLCJleHAiOjE3NTEyOTk3NTcsImVudklkIjoiV0RDX0NPTlNVTFQ1In0.XK_Rm1IZ_EJ1zD4yaxj72O97izdOcoLWLYcOz4TKwG81J__RktyQbQpyAEHWA43HR8UufDqGTfIBpj_2TI-yvvSY9TiIVPwJL31Xya0jcLB28vkr6ghrG0cVhKiBm0M6yPfmLvAae4wQQPdfE6N2zSKSDAylkkUlmNXbl-gM8RVFjKwHnwx8rcyIVQpfd5PeyLIhl14t2vr4d18VyyGF3x_jtWC_ZTM7hUKwWRD-QkVIzyVS3u0FG6XL-3vnKu8OEyzwlD0VlJN-FhSO01PUo6QxmJ-jRmDfyS4JrZ-NNmAkrD4QjP7F2Uu-L5mhj8RJWnu5BLxN9MoJS3o77XuCPA'
};
