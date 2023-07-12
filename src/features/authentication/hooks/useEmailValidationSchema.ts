import * as Yup from 'yup';

export const useEmailValidationSchema = () =>
  Yup.string()
    .trim()
    .email('auth.celsius.forgot.password.wrong-email-format')
    .required('auth.celsius.forgot.email-required')
    .min(3, 'auth.celsius.forgot.password.minimum-3-symbols')
    .max(50, 'auth.celsius.forgot.password.maximum-50-symbols');
