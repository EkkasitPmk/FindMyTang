export interface RegisterRequest {
  email: string;
  password?: string;
  confirmPassword?: string;
  displayName?: string;
}

export interface RegisterResponse {
  id: string;
  email: string;
  displayName: string;
  createdAt: string;
}

export interface ApiErrorResponse {
  message: string | string[];
  error: string;
  statusCode: number;
}
