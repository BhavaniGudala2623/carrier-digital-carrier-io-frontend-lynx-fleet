import { ChangeEvent } from 'react';
import { getIn, useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import TextField from '@carrier-io/fds-react/TextField';
import Typography from '@carrier-io/fds-react/Typography';
import Box from '@carrier-io/fds-react/Box';
import Button from '@carrier-io/fds-react/Button';
import { Close, Done } from '@mui/icons-material';
import { isString } from 'lodash-es';
import { CreateUserInput } from '@carrier-io/lynx-fleet-types';
import PhoneNumber from '@carrier-io/fds-react/patterns/PhoneNumber';

import { textFieldStyle } from '../../../../common/styles';

import { CreateCompanyFormData } from '@/features/company-management/types';
import { Loader } from '@/components';
import { defAppPreferences } from '@/constants';

interface CreateAdminProps {
  onCancel: () => void;
  onSave: (values: CreateUserInput) => void;
  editMode: boolean;
  loading: boolean;
}

export const CreateAdmin = ({ onCancel, editMode, onSave, loading }: CreateAdminProps) => {
  const { t } = useTranslation();

  const { values, handleChange, handleBlur, setFieldValue, setFieldTouched, touched, errors } =
    useFormikContext<CreateCompanyFormData>();

  const phoneFieldName = 'contactInfo.phone';
  const nameFieldName = 'contactInfo.name';
  const lastNameFieldName = 'contactInfo.lastName';
  const emailFieldName = 'contactInfo.email';

  const handlePhoneChange = (_value, _country, _e, formattedValue) => {
    setFieldTouched(phoneFieldName, true);
    setFieldValue(phoneFieldName, formattedValue);
  };

  const handleEmailChange = (e: ChangeEvent<{ name?: string; value: unknown }>) => {
    handleChange(e);
    const value = isString(e?.target?.value) ? e.target.value.toLowerCase() : '';
    setFieldValue(emailFieldName, value);
  };

  const isDataInValid =
    getIn(errors, emailFieldName) ||
    getIn(errors, nameFieldName) ||
    getIn(errors, lastNameFieldName) ||
    getIn(errors, phoneFieldName);

  const handleSave = () => {
    const data: CreateUserInput = {
      email: values.contactInfo?.email?.toLowerCase() ?? '',
      firstName: values.contactInfo?.name ?? '',
      lastName: values.contactInfo?.lastName ?? '',
      phone: values.contactInfo?.phone ?? '',
      tenantId: values?.id ?? '',
      language: values.companyPreferences?.language ?? defAppPreferences.language,
      measurementDistance: values.companyPreferences.distance ?? defAppPreferences.distance,
      measurementSpeed: values.companyPreferences.speed ?? defAppPreferences.speed,
      measurementTemperature: values.companyPreferences.temperature ?? defAppPreferences.temperature,
      measurementVolume: values.companyPreferences.volume ?? defAppPreferences.volume,
      timezone: values.companyPreferences.timeZone,
      notificationEnabled: Boolean(values.features.find(({ name }) => name === 'notification')),
    };

    onSave(data);
  };

  const phoneError =
    getIn(touched, phoneFieldName) && getIn(errors, phoneFieldName) && t(getIn(errors, phoneFieldName));

  return (
    <Box position="relative">
      {loading && <Loader overlay />}
      <>
        <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={1}>
          <TextField
            id={nameFieldName}
            label={t('user.management.first-name')}
            required
            aria-label={t('user.management.first-name')}
            type="text"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.contactInfo?.name}
            error={Boolean(getIn(touched, nameFieldName) && getIn(errors, nameFieldName))}
            helperText={
              getIn(touched, nameFieldName) && getIn(errors, nameFieldName) && t(getIn(errors, nameFieldName))
            }
            sx={{ ...textFieldStyle, mb: 0 }}
          />
          <TextField
            id={lastNameFieldName}
            label={t('user.management.last-name')}
            required
            aria-label={t('user.management.last-name')}
            type="text"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.contactInfo?.lastName}
            error={Boolean(getIn(touched, lastNameFieldName) && getIn(errors, lastNameFieldName))}
            helperText={
              getIn(touched, lastNameFieldName) &&
              getIn(errors, lastNameFieldName) &&
              t(getIn(errors, lastNameFieldName))
            }
            sx={{ ...textFieldStyle, mb: 0 }}
          />
        </Box>
        <TextField
          id={emailFieldName}
          label={t('company.management.email')}
          required
          aria-label={t('company.management.email')}
          type="text"
          onChange={handleEmailChange}
          onBlur={handleBlur}
          value={values.contactInfo?.email}
          error={Boolean(getIn(touched, emailFieldName) && getIn(errors, emailFieldName))}
          helperText={
            getIn(touched, emailFieldName) &&
            getIn(errors, emailFieldName) &&
            t(getIn(errors, emailFieldName))
          }
          fullWidth
          sx={textFieldStyle}
        />
        <Box pb={2.5}>
          <PhoneNumber
            inputProps={{ id: phoneFieldName }}
            value={values.contactInfo?.phone}
            placeholder={t('company.management.phone')}
            onChange={handlePhoneChange}
            onBlur={handleBlur}
            inputStyle={{
              width: '100%',
            }}
            defaultErrorMessage={phoneError}
            isValid={!phoneError}
            validate
            countryCodeEditable
          />
        </Box>
      </>
      {editMode ? (
        <Box display="flex">
          <Button
            sx={{
              width: '33%',
            }}
            startIcon={<Close />}
            variant="text"
            color="primary"
            onClick={onCancel}
          >
            {t('common.cancel')}
          </Button>
          <Button
            sx={{
              width: '33%',
            }}
            onClick={handleSave}
            startIcon={<Done />}
            variant="text"
            color="primary"
            disabled={!!isDataInValid}
          >
            {t('common.save')}
          </Button>
        </Box>
      ) : (
        <Typography variant="caption" sx={{ opacity: 0.6 }}>
          {t('company.management.admin-is-required')}
        </Typography>
      )}
    </Box>
  );
};
