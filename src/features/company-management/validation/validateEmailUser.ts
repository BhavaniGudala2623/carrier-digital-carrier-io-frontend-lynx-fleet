import { checkEmailAvailabilityDebounced } from './createUserEmailValidation';

import { isEmailValid } from '@/utils';

export const validateEmailUser = async (email: string): Promise<string> => {
  if (!isEmailValid(email)) {
    return 'error.enter-valid-email';
  }

  try {
    const response = await checkEmailAvailabilityDebounced(email);

    return typeof response === 'undefined' || response
      ? ''
      : 'user.management.validation.error.email-already-exists';
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  }

  return '';
};
