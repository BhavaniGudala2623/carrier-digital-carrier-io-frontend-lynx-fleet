import { isObject } from 'lodash-es';

export const getFirstErrorKey = (object: Record<string, unknown>, keys: string[] = []): string => {
  const firstErrorKey = Object.keys(object)[0];

  if (isObject(object[firstErrorKey])) {
    return getFirstErrorKey(object[firstErrorKey] as Record<string, unknown>, [...keys, firstErrorKey]);
  }

  return [...keys, firstErrorKey].join('.');
};
