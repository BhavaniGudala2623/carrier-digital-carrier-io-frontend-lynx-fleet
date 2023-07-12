import { SignInForm } from '@carrier-io/fds-react/patterns/SignIn/SignInForm';
import { useTranslation } from 'react-i18next';
import { KeyboardEvent } from 'react';

import { useLoginForm } from './useLoginForm';

import { getAppCountryCodes, getLanguageLabels } from '@/utils';

export const LoginForm = () => {
  const { t } = useTranslation();
  const { loginForm, loginLoading, countryCode, handleChangeLanguage } = useLoginForm();
  const { values, errors, handleChange, handleBlur, submitForm } = loginForm;

  const handleKeyPress = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Enter') {
      submitForm();
    }
  };

  return (
    <SignInForm
      showStaySingIn={false}
      CountrySelectProps={{
        countries: getAppCountryCodes(),
        customLabels: getLanguageLabels(t),
        onSelect: handleChangeLanguage,
        selected: countryCode,
        label: t('common.language'),
        showBorder: true,
        sortingByLabel: 'asc',
      }}
      EmailInputProps={{
        name: 'username',
        onChange: handleChange,
        onBlur: handleBlur,
        onKeyPress: handleKeyPress,
        value: values.username,
        label: t('common.email'),
        error: !!errors.username,
        helperText: t(errors.username ?? ''),
      }}
      PasswordInputProps={{
        name: 'password',
        value: values.password,
        label: t('common.password'),
        onChange: handleChange,
        onBlur: handleBlur,
        onKeyPress: handleKeyPress,
        error: !!errors.password,
        helperText: t(errors.password ?? ''),
      }}
      SubmitButtonProps={{
        disabled: loginLoading,
        label: t('auth.sign-in'),
        onClick: submitForm,
      }}
      showCountrySelect
    />
  );
};
