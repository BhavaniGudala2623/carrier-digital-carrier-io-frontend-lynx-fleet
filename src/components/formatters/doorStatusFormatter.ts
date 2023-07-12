import { TFunction } from 'i18next';

interface FlattenParams {
  value: null | undefined | string | boolean | number;
}

export const doorStatusFormatter = (params: FlattenParams, t: TFunction): string => {
  if (!params) {
    return '';
  }

  const { value } = params;

  if (value === null || value === undefined) {
    return '';
  }

  if (value === true || value === 'true' || value === 1) {
    return t('assets.door.status.closed');
  }

  if (value === false || value === 'false' || value === 0) {
    return t('assets.door.status.open');
  }

  return value.toString();
};
