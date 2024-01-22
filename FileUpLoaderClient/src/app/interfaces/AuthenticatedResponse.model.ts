export interface AuthenticatedResponse{
  id: number;
  token: string;
  refreshToken: string;
  errorMessage: string;
  role: string;  
  expireTimeInMinutes: number;
}