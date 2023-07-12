import { useCallback } from 'react';

import { AddUserInput, EditUserState } from '../types';
import { validateEmailUser } from '../../../validation';

export const useValidateUser = (authTenantId: string, initialEmail: string, isEdit?: boolean) => {
  const validate = useCallback(
    async (values: AddUserInput | EditUserState) => {
      const errors: Record<string, string> = {};
      const errorLenData = {
        firstName: 'user.management.validation.error.valid-first-name',
        lastName: 'user.management.validation.error.valid-last-name',
        phone: 'user.management.validation.error.valid-phone',
      };

      Object.entries(errorLenData).forEach(([key, error]) => {
        if (!values[key]?.length || (values[key].length < 1 && values[key].length > 50)) {
          errors[key] = error;
        }
      });

      if (!values.tenantId) {
        errors.company = 'common.required';
      }

      const hasNewEmail = !isEdit || initialEmail.toLowerCase() !== values.email.toLowerCase();
      const errorEmail = hasNewEmail && (await validateEmailUser(values.email));

      if (errorEmail) {
        errors.email = errorEmail;
      }

      if (isEdit) {
        return errors;
      }

      if (authTenantId === values.tenantId) {
        const isOneGroupAvailable = values.availableTenantGroups.find(({ id }) =>
          values.accessibleGroupsIds.includes(id)
        );

        if (!isOneGroupAvailable) {
          errors.tenantId = 'user.management.validation.error.not-allowed';
        }
      }

      return errors;
    },
    [authTenantId, initialEmail, isEdit]
  );

  return validate;
};
