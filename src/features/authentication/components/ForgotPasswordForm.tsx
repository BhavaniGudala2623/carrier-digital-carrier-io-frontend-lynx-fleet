import { KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
import ForgotPassword from '@carrier-io/fds-react/patterns/SignIn/ForgotPassword';
import Box from '@carrier-io/fds-react/Box';

import { useForgotPassword } from './useForgotPassword';

export const ForgotPasswordForm = () => {
  const { t } = useTranslation();

  const { values, status, errors, submitForm, resetForm, handleBlur, setFieldValue } = useForgotPassword();

  const handleKeyPress = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Enter') {
      submitForm();
    }
  };

  return (
    <Box display="flex">
      <Box sx={{ marginLeft: '0.25em' }}>
        <ForgotPassword
          currentEmail={values.email}
          onSubmit={submitForm}
          onEmailChange={(value) => setFieldValue('email', value.email)}
          emailSuccessfullySent={status?.type === 'success'}
          labelEntry={t('auth.celsius.forget-your-password')}
          errors={{
            submitAction: status?.type === 'error' ? status?.message : null,
          }}
          onClose={resetForm}
          CancelButtonProps={{ label: t('common.cancel') }}
          SubmitButtonProps={{
            label: t('common.submit'),
            disabled: status?.type === 'loading' || !values.email,
          }}
          TypographyModalTitleProps={{ label: t('auth.recover-password') }}
          TypographyMainTextProps={{ label: t('auth.celsius.forgot.password.reset-your-password') }}
          TextFieldProps={{
            label: t('common.email'),
            error: !!errors.email,
            helperText: t(errors.email ?? ''),
            onBlur: handleBlur,
            onKeyPress: handleKeyPress,
          }}
          SignInButtonProps={{ label: t('auth.sign-in') }}
          TypographySuccessTextProps={{
            label: (
              <>
                {t('auth.reset-password.instructions-sent')}&nbsp;
                <b>{values.email}</b>. {t('auth.reset-password.follow-instructions')}
              </>
            ),
          }}
        />
      </Box>
    </Box>
  );
};
