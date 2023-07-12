import * as yup from 'yup';

export const companyContactInfoValidationSchemaCommon = {
  name: yup.string().min(1).max(150).required('user.management.validation.error.valid-first-name').nullable(),
  lastName: yup
    .string()
    .min(1)
    .max(150)
    .required('user.management.validation.error.valid-last-name')
    .nullable(),
  phone: yup.string().min(1).max(30).required('user.management.validation.error.valid-phone').nullable(),
};
