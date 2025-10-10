export interface AuthRequest {
  email: string;
  password: string;
  apiKey?: string;
  modelPreference?: string;
  rememberMe?: boolean;
}