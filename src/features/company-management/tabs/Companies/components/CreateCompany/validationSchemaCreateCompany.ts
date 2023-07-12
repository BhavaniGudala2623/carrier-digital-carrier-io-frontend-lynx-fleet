import * as yup from 'yup';
import { debounce } from 'lodash-es';
import { CompanyService } from '@carrier-io/lynx-fleet-data-lib';

import { companyContactInfoValidationSchemaCommon } from '../../validation/contactInfoValidation';
import { newUserEmailValidationSchema } from '../../../../validation';

const checkCompanyNameAvailability = async (name: string): Promise<boolean> => {
  const {
    data: {
      isTenantNameAvailable: { success },
    },
  } = await CompanyService.isTenantNameAvailable({ name });

  return success;
};

export const checkCompanyNameAvailabilityDebounced = debounce(checkCompanyNameAvailability, 500);

export const companyContactInfoValidationSchema = yup.object().shape({
  email: newUserEmailValidationSchema,
  ...companyContactInfoValidationSchemaCommon,
});

export const validationSchemaCreateCompany = yup.object().shape({
  name: yup.string().max(120),
  contactInfo: companyContactInfoValidationSchema,
});
