import { useEffect, useState } from 'react';
import { useOktaAuth } from '@okta/okta-react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';

import { useEmailValidationSchema } from '../hooks/useEmailValidationSchema';

import { localeToCountryCode, CountryCode, countryCodeToLocale, getAppLocaleOrDefault } from '@/utils';
import { showError } from '@/stores/actions';
import { useAppDispatch } from '@/stores';
import { I18N_LANGUAGE } from '@/constants';
import { useApplicationContext } from '@/providers/ApplicationContext';

const initialValues = {
  username: '',
  password: '',
  staySignedIn: false,
};

export const useLoginForm = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { oktaAuth } = useOktaAuth();
  const [loading, setLoading] = useState(false);
  const { appLanguage, setAppLanguage } = useApplicationContext();

  const [countryCode, setCountryCode] = useState(
    localeToCountryCode(getAppLocaleOrDefault(localStorage.getItem(I18N_LANGUAGE) || navigator.language))
  );

  useEffect(() => {
    const newLanguage = countryCodeToLocale(countryCode);

    if (newLanguage !== appLanguage) {
      setAppLanguage(newLanguage);
    }
  }, [countryCode, appLanguage, setAppLanguage]);

  const validationSchema = Yup.object().shape({
    username: useEmailValidationSchema(),
    password: Yup.string()
      .required('auth.celsius.login.password-required')
      .min(3, 'auth.celsius.forgot.password.minimum-3-symbols')
      .max(50, 'auth.celsius.forgot.password.maximum-50-symbols'),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: (values, { setSubmitting }) => {
      setLoading(true);
      oktaAuth
        .signInWithCredentials({ username: values.username.toLowerCase().trim(), password: values.password })
        .then((res) => {
          setLoading(false);
          // sessionToken is a one-use token, so make sure this is only called once
          oktaAuth.signInWithRedirect({ sessionToken: res.sessionToken });
        })
        .catch((err) => {
          // eslint-disable-next-line
          console.error(err);
          setLoading(false);
          setSubmitting(false);
          showError(dispatch, t('auth.celsius.login.sorry-try-again'));
        });
    },
  });

  const handleChangeLanguage = (code: string) => {
    setCountryCode(code as CountryCode);
  };

  return { loginForm: formik, countryCode, loginLoading: loading, handleChangeLanguage };
};
