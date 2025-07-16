export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  tenantId?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}
