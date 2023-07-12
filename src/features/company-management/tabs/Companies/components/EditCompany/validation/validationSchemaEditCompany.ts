import * as yup from 'yup';

import { companyContactInfoValidationSchemaCommon } from '../../../validation/contactInfoValidation';

export const companyContactInfoValidationSchema = yup.object().shape({
  // todo: change it after edit company admin story is implemented
  email: yup
    .string()
    .trim()
    .email('user.management.validation.error.valid-email')
    .required('user.management.validation.error.valid-email')
    .nullable(),
  ...companyContactInfoValidationSchemaCommon,
});

export const validationSchemaEditCompany = yup.object().shape({
  name: yup.string().max(120),
  contactInfo: companyContactInfoValidationSchema,
});
