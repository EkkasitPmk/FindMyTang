export interface LoginRequest {
  email: string;
  password?: string;
}

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    displayName: string;
  };
}

export interface ApiErrorResponse {
  message: string | string[];
  error: string;
  statusCode: number;
}
