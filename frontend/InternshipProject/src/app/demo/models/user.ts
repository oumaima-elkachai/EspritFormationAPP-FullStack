export interface User {
  id?: number;
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
  phoneNumber?: string;
  address?: string;
  roleType?: string;
  apiKeys?: string[];
  defaultModel?: string;
  usageQuota?: number;
  createdAt?: string;
  updatedAt?: string;
  lastLogin?: string;
  avatar?: string;
}