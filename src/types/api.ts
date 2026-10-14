export interface ApiResponse<T = unknown> {
  status?: number | string;
  success?: boolean;
  message?: string;
  data?: T;
  response?: T;
  error?: string;
}

export interface PaginatedResult<T> {
  results: T[];
  total_pages: number;
  total_results?: number;
  current_page?: number;
}

export interface ApiErrorResponse {
  message: string;
  code?: number | string;
  details?: Record<string, unknown>;
}
