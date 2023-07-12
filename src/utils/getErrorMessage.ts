import { hasOwnProperty } from '@/utils/hasOwnProperty';

export const getErrorMessage = (error: unknown): string => {
  if (typeof error === 'string') {
    return error;
  }

  if (error && typeof error === 'object' && hasOwnProperty(error, 'message')) {
    return error.message as string;
  }

  return 'Unknown error format';
};
