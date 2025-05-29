/** @format */

import { ErrorItem, ErrorResponse, SuccessResponse } from "../interfaces/response.interfaces";

export const formatError = (message: string, errors?: ErrorItem[]): ErrorResponse => ({
  success: false,
  message,
  errors,
});

export const formatSuccess = <T = unknown>(message: string, data?: T): SuccessResponse<T> => ({
  success: true,
  message,
  ...(data !== undefined && { data }),
});
