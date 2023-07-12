import * as yup from 'yup';
import { debounce } from 'lodash-es';
import { CompanyService } from '@carrier-io/lynx-fleet-data-lib';

export const checkEmailAvailability = async (email: string): Promise<boolean> => {
  const {
    data: {
      isUserEmailAvailable: { success },
    },
  } = await CompanyService.isUserEmailAvailable({ email });

  return success;
};

export const checkEmailAvailabilityDebounced = debounce(checkEmailAvailability, 500);

export const newUserEmailValidationSchema = yup
  .string()
  .email('user.management.validation.error.valid-email')
  .required('user.management.validation.error.valid-email')
  .test('unique_email', 'user.management.validation.error.email-already-exists', async (email) => {
    const isValid = await yup.string().email().isValid(email);
    if (email && isValid) {
      try {
        const res = await checkEmailAvailabilityDebounced(email);

        return typeof res === 'undefined' ? true : res;
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
      }
    }

    return true;
  });
