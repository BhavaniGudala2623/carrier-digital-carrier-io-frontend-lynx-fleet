import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { ResetPasswordResponse, ResetPasswordArgs } from '@carrier-io/lynx-fleet-types';

import { useEmailValidationSchema } from '../hooks/useEmailValidationSchema';

import { fetchPublicApi } from '@/utils/fetchPublicApi';

const initialValues = {
  email: '',
};

export const useForgotPassword = () => {
  const { t } = useTranslation();

  const validationSchema = Yup.object().shape({
    email: useEmailValidationSchema(),
  });

  return useFormik({
    initialValues,
    validationSchema,
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: (values, { setSubmitting, setStatus }) => {
      setStatus({ type: 'loading' });

      fetchPublicApi<ResetPasswordResponse, ResetPasswordArgs>('user/reset-password', { email: values.email })
        .then((response) => {
          setSubmitting(false);

          if (response.success) {
            setStatus({ type: 'success' });
          } else {
            setStatus({
              type: 'error',
              message: response.error?.includes('USER_NOT_FOUND')
                ? t('auth.reset-password.no-user-found-error')
                : response.error ?? null,
            });
          }
        })
        .catch((err) => {
          setSubmitting(false);
          setStatus({ type: 'error', message: err });
        });
    },
  });
};
