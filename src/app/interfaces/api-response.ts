export interface ApiResponse {
  status: 'success' | 'warning' | 'error';
  message?: string;
}
