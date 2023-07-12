import { FormikErrors } from 'formik';
import { TFunction } from 'i18next';

import { NotificationFormData } from '../../types';

import { isEmailValid } from '@/utils';

export const validateForm = (
  data: NotificationFormData,
  activeStep: number,
  t: TFunction
): {
  errors: FormikErrors<NotificationFormData>;
} => {
  const { name, conditions, assets, recipients } = data;
  const errors: FormikErrors<NotificationFormData> = {};

  if (activeStep >= 0) {
    if (!assets.assetIds?.length) {
      errors.assets = { ...errors.assets, assetIds: t('error.assets-required') };
    }
  }

  if (activeStep >= 1) {
    if (!name) {
      errors.name = t('notifications.error.name-required');
    }

    if (!conditions.length) {
      errors.conditions = t('notifications.error.condition-required');
    }
  }

  if (activeStep >= 2) {
    if (!recipients.length) {
      errors.recipients = t('error.recipients-required');
    }

    if (recipients.some((item) => !isEmailValid(item))) {
      errors.recipients = t('error.enter-valid-email');
    }
  }

  return { errors };
};
