import { TFunction } from 'i18next';

export const MovementStatusFormatter = (t: TFunction, value?: string | null) => {
  if (!value) {
    return '';
  }

  switch (value.toLowerCase()) {
    case 'no':
      return t('common.no');
    case 'yes':
      return t('common.yes');
    default:
      return value;
  }
};
