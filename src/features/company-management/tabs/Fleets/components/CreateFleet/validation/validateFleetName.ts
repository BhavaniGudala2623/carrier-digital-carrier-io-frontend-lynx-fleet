import { checkFleetNameUniqueDebounced } from '../checkFleetNameUniqueDebounced';

export const validateFleetName = async (name: string, tenantId?: string): Promise<string> => {
  let validateMessage;

  if (!name) {
    validateMessage = 'company.management.validation.error.fleet-name-required';

    return validateMessage;
  }

  if (!/^[a-z0-9-_:\s]+$/im.test(name)) {
    validateMessage = 'company.management.validation.error.fleet-name-matches';

    return validateMessage;
  }

  if (!tenantId) {
    return '';
  }

  try {
    const response = await checkFleetNameUniqueDebounced(name, tenantId);

    if (response?.result === false) {
      validateMessage = 'company.management.validation.error.fleet-name-exist';
    } else if (response?.result === true) {
      validateMessage = '';
    } else if (response?.error) {
      validateMessage = response?.error;
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  }

  return validateMessage as string;
};
