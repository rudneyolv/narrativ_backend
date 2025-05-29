/** @format */

export interface ErrorItem {
  message?: string;
  field?: string | number;
}

export interface SuccessResponse<T = unknown> {
  success: true;
  message: string;
  data?: T;
}

export interface ErrorResponse {
  success: false;
  message: string;
  errors?: ErrorItem[];
}
