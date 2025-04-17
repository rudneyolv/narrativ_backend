/** @format */

interface ErrorItem {
  message?: string;
  field?: string | number;
}

// Retorna: { success: false, message: string, errors: ErrorItem[] }
export const formatError = (message: string, errors: ErrorItem[]) => ({
  success: false,
  message,
  errors: errors || undefined,
});

// Retorna: { success: true, message: string, data?: any }
export const formatSuccess = (message: string, data?: any) => ({
  success: true,
  message,
  ...(data && { data }),
});
