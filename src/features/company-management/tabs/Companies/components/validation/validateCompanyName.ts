import { checkCompanyNameAvailabilityDebounced } from '../CreateCompany/validationSchemaCreateCompany';

export const validateCompanyName = async (name: string, initialNameValue: string): Promise<string> => {
  let validateMessage;

  if (!name) {
    validateMessage = 'company.management.validation.error.company-name-required';

    return validateMessage;
  }

  if (!/^[a-z0-9-_:\s]+$/im.test(name)) {
    validateMessage = 'company.management.validation.error.company-name-matches';

    return validateMessage;
  }

  if (name && name !== initialNameValue) {
    try {
      const response = await checkCompanyNameAvailabilityDebounced(name);

      validateMessage =
        typeof response === 'undefined' || response
          ? ''
          : 'company.management.validation.error.company-already-exists';
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  }

  return validateMessage as string;
};
