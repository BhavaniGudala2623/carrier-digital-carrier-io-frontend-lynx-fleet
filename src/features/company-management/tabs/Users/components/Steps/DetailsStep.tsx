import { useEffect, useCallback, useMemo } from 'react';
import { Field, FieldProps, getIn, useFormikContext } from 'formik';
import Box from '@carrier-io/fds-react/Box';
import TextField from '@carrier-io/fds-react/TextField';
import Typography from '@carrier-io/fds-react/Typography';
import { useTranslation } from 'react-i18next';
import PhoneNumber from '@carrier-io/fds-react/patterns/PhoneNumber';
import { CompanyService } from '@carrier-io/lynx-fleet-data-lib';
import { Maybe } from '@carrier-io/lynx-fleet-types';
import FormHelperText from '@carrier-io/fds-react/FormHelperText';

import { AddUserInput, EditUserState } from '../../types';
import { textFieldStyle } from '../../../common/styles';

import { StepContainer } from './styles';

import { defAppPreferences } from '@/constants';
import { getLocalTimezone } from '@/utils';
import { UserAccessibleTenantsSelect } from '@/features/common';
import { OptionItem } from '@/types';
import { useApplicationContext } from '@/providers/ApplicationContext';

export const DetailsStep = ({ isEdit = false }: { isEdit?: boolean }) => {
  const { t } = useTranslation();
  const {
    applicationState: { selectedCompanyHierarchy },
  } = useApplicationContext();

  const {
    values,
    errors,
    handleChange,
    handleBlur,
    setFieldValue,
    setFieldTouched,
    touched,
    initialValues,
    validateForm,
  } = useFormikContext<AddUserInput | EditUserState>();
  const phoneFieldName = 'phone';
  const tenantIdFieldName = 'tenantId';

  const handleCompanyChange = useCallback(
    (value: Maybe<OptionItem>) => {
      setFieldValue('company', value);
      setFieldValue('tenantId', value?.id || '');
    },
    [setFieldValue]
  );

  const handlePhoneChange = (_value, _country, _e, formattedValue) => {
    setFieldTouched(phoneFieldName, true);
    setFieldValue(phoneFieldName, formattedValue);
  };

  useEffect(() => {
    validateForm();
  }, [validateForm, initialValues.phone, initialValues.lastName, initialValues.firstName]);

  const phoneError =
    getIn(touched, phoneFieldName) && getIn(errors, phoneFieldName) && t(getIn(errors, phoneFieldName));

  const tenantIdError = getIn(errors, tenantIdFieldName) && t(getIn(errors, tenantIdFieldName));

  const { loading, data } = CompanyService.useGetTenantById(
    {
      id: values.tenantId,
    },
    {
      skip: !values.tenantId || isEdit,
    }
  );

  const selectedCompany = useMemo(() => data?.getTenantById, [data?.getTenantById]);

  useEffect(() => {
    if (selectedCompany) {
      setFieldValue(
        'preferences.language',
        selectedCompany.companyPreferences?.language || defAppPreferences.language
      );
      setFieldValue(
        'preferences.temperature',
        selectedCompany.companyPreferences?.temperature || defAppPreferences.temperature
      );
      setFieldValue(
        'preferences.distance',
        selectedCompany.companyPreferences?.distance || defAppPreferences.distance
      );
      setFieldValue(
        'preferences.volume',
        selectedCompany.companyPreferences?.volume || defAppPreferences.volume
      );
      setFieldValue(
        'preferences.speed',
        selectedCompany.companyPreferences?.speed || defAppPreferences.speed
      );
      setFieldValue(
        'preferences.timezone',
        selectedCompany.companyPreferences?.timeZone || getLocalTimezone()
      );
    }
  }, [selectedCompany, setFieldValue]);

  useEffect(() => {
    setFieldValue('isCompanyPreferenceLoading', loading);
  }, [loading, setFieldValue]);

  return (
    <StepContainer>
      <Typography variant="subtitle1" color="text.primary" mb={1}>
        {t('company.management.drawer.company-information')}
      </Typography>
      <UserAccessibleTenantsSelect
        onChange={handleCompanyChange}
        value={values.company}
        defaultId={selectedCompanyHierarchy.id}
      />
      {tenantIdError && (
        <FormHelperText error variant="filled" sx={{ mt: -1, ml: 0.5 }}>
          {tenantIdError}
        </FormHelperText>
      )}
      <Typography variant="subtitle1" color="text.primary" my={2}>
        {t('user.management.user-information')}
      </Typography>
      <Box display="flex" justifyContent="space-between">
        <TextField
          id="firstName"
          name="firstName"
          label={t('user.management.first-name')}
          aria-label={t('user.management.first-name')}
          required
          size="small"
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.firstName && Boolean(errors.firstName)}
          helperText={touched.firstName && errors.firstName && t(errors.firstName)}
          value={values.firstName}
          sx={{ ...textFieldStyle, width: 232 }}
        />
        <TextField
          id="lastName"
          name="lastName"
          label={t('user.management.last-name')}
          aria-label={t('user.management.last-name')}
          required
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.lastName && Boolean(errors.lastName)}
          helperText={touched.lastName && errors.lastName && t(errors.lastName)}
          value={values.lastName}
          size="small"
          sx={{ ...textFieldStyle, width: 232 }}
        />
      </Box>

      <Field
        name="email"
        value={values.email}
        onChange={handleChange}
        id="email"
        type="email"
        onBlur={handleBlur}
      >
        {(props: FieldProps) => {
          const { field } = props;

          return (
            <TextField
              id="email"
              name={field.name}
              label={t('common.email')}
              aria-label={t('common.email')}
              required
              type="email"
              onChange={field.onChange}
              value={field.value}
              onBlur={field.onBlur}
              error={touched.email && Boolean(errors.email)}
              helperText={touched.email && errors.email && t(errors.email)}
              size="small"
              fullWidth
              disabled={isEdit}
              sx={textFieldStyle}
            />
          );
        }}
      </Field>

      <Box pb={2.5}>
        <PhoneNumber
          inputProps={{ id: phoneFieldName }}
          value={values.phone}
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
    </StepContainer>
  );
};

DetailsStep.displayName = 'DetailsStep';
