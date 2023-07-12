import { FormikErrors } from 'formik';
import * as yup from 'yup';
import { has, debounce } from 'lodash-es';
import { CompanyService } from '@carrier-io/lynx-fleet-data-lib';
import { Group } from '@carrier-io/lynx-fleet-types';

import { CreateGroupFormValuesType } from './types';
import { isAdminGroup } from './utils';

export const validGroupNameRegex = /^[a-z0-9-_:\s]{2,50}$/i;

const checkGroupNameAvailability = async (name: string, tenantId: string): Promise<boolean> => {
  const {
    data: {
      isGroupNameAvailable: { isAvailable },
    },
  } = await CompanyService.isGroupNameAvailable({ name, tenantId });

  return isAvailable;
};

export const checkGroupNameAvailabilityDebounced = debounce(checkGroupNameAvailability, 500);

export const isStepValid = (step: number, errors: FormikErrors<CreateGroupFormValuesType>) => {
  const hasStepErrorList = [has(errors, 'name') || has(errors, 'ownerEmail')];

  return !hasStepErrorList[step];
};

export const validateGroupName = async (name: string, initialNameValue: string, tenantId: string) => {
  let validateMessage;

  if (!name) {
    validateMessage = 'user.management.add.group.validation.error.name-required';

    return validateMessage;
  }

  if (!validGroupNameRegex.test(name)) {
    validateMessage = 'user.management.add.group.validation.error.name';

    return validateMessage;
  }

  if (name.toLowerCase() !== initialNameValue.toLowerCase()) {
    try {
      const response = await checkGroupNameAvailabilityDebounced(name, tenantId);

      const isAvailable = typeof response === 'undefined' || response;
      validateMessage = isAvailable ? '' : 'user.management.add.group.validation.error.name-already-exists';
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  }

  return validateMessage as string;
};

export const getValidationSchemaUserGroup = (groupName: Group['name']) =>
  yup.object().shape({
    ownerEmail: isAdminGroup(groupName)
      ? yup.string().nullable()
      : yup
          .string()
          .email('user.management.validation.error.valid-email')
          .required('user.management.user-group.errors.group-owner-required'),
  });
