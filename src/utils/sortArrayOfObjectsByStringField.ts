import { sortStrings } from './sortStrings';

export const sortArrayOfObjectsByStringField = (
  a: Record<string, unknown>,
  b: Record<string, unknown>,
  fieldName: string,
  direction: 'asc' | 'desc' = 'asc'
): number => {
  if (!a || !b || typeof a[fieldName] !== 'string' || typeof b[fieldName] !== 'string') {
    return 0;
  }

  return sortStrings(a[fieldName] as string, b[fieldName] as string, direction);
};
