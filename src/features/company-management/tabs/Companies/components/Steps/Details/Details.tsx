import { useCallback, useMemo } from 'react';
import TextField from '@carrier-io/fds-react/TextField';
import Typography from '@carrier-io/fds-react/Typography';
import Box from '@carrier-io/fds-react/Box';
import { Field, FieldProps, useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';

import { validateCompanyName } from '../../validation';
import { CompanyAdminContainer } from '../../../containers/CompanyAdminContainer';
import { CreateCompanyFormData } from '../../../../../types';
import { companyTypeEntity } from '../../../../../constants';
import { textFieldStyle } from '../../../../common/styles';
import { useAllowedRegionsAndCountries } from '../../../../../hooks';

import { RegionCountrySelectField } from './RegionCountrySelectField';

import { CompanySelector as AllCompaniesSelector, FormSelect } from '@/components';
import { SelectedCompanyHierarchy } from '@/providers/ApplicationContext';

export interface DetailsProps {
  disableAllCompaniesSelect?: boolean;
}

export const Details = ({ disableAllCompaniesSelect = false }: DetailsProps) => {
  const { t } = useTranslation();

  const { values, errors, handleChange, handleBlur, setFieldValue, touched, initialValues, setFieldError } =
    useFormikContext<CreateCompanyFormData>();

  const onCompanyChange = useCallback((node: SelectedCompanyHierarchy) => {
    setFieldValue('parentCompany', node);
    setFieldValue('parentId', node.id);
    setFieldError('parentId', '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validateNameField = (name: string) => validateCompanyName(name, initialValues.name);

  const handleClear = useCallback(() => {
    setFieldValue('parentCompany', null);
    setFieldValue('parentId', null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearchBoxChange = useCallback(
    (value: string) => {
      if (value === '') {
        handleClear();
      }
    },
    [handleClear]
  );

  const excludeCompanies = useMemo(() => (values.id ? [values.id] : []), [values.id]);

  const { allowedRegions, allowedCountries } = useAllowedRegionsAndCountries();

  return (
    <Box display="flex" flexDirection="column" width={480}>
      <Typography variant="subtitle1" color="text.primary" gutterBottom>
        {t('company.management.company-information')}
      </Typography>
      <Box sx={{ mb: 2 }}>
        <AllCompaniesSelector
          company={values.parentCompany || null}
          onCompanyChange={onCompanyChange}
          placeholder={t('common.components.parent-company')}
          disabled={disableAllCompaniesSelect}
          error={touched.tenantId && Boolean(errors.tenantId)}
          helperText={touched.tenantId && errors.tenantId}
          onClear={handleClear}
          searchBoxChangeHandler={handleSearchBoxChange}
          excludeCompanies={excludeCompanies}
        />
      </Box>
      <Field
        name="name"
        id="name"
        type="text"
        validate={validateNameField}
        value={values.name}
        onChange={handleChange}
        onBlur={handleBlur}
      >
        {(props: FieldProps) => {
          const { field } = props;

          return (
            <TextField
              id="name"
              name={field.name}
              label={t('company.management.company-name')}
              required
              aria-label={t('company.management.company-name')}
              type="text"
              onChange={field.onChange}
              onBlur={field.onBlur}
              value={field.value}
              error={touched.name && Boolean(errors.name)}
              helperText={touched.name && errors.name && t(errors.name)}
              fullWidth
              sx={textFieldStyle}
            />
          );
        }}
      </Field>
      <FormSelect
        value={values.companyType || ''}
        name="companyType"
        placeholder="company.management.company-type"
        onChange={handleChange}
        options={Object.keys(companyTypeEntity)}
        dictionary={companyTypeEntity}
        required
        translate
        sx={{ mb: 2 }}
      />
      <TextField
        id="contactInfo.address"
        label={t('company.management.address')}
        aria-label={t('company.management.address')}
        type="text"
        onChange={handleChange}
        value={values.contactInfo?.address}
        fullWidth
        sx={textFieldStyle}
      />
      <TextField
        id="contactInfo.city"
        label={t('company.management.city')}
        aria-label={t('company.management.city')}
        type="text"
        onChange={handleChange}
        value={values.contactInfo?.city}
        fullWidth
        sx={textFieldStyle}
      />
      <Box sx={{ mb: 2 }}>
        <RegionCountrySelectField
          region={values.contactInfo?.region}
          country={values.contactInfo?.country}
          regionFieldId="contactInfo.region"
          countryFieldId="contactInfo.country"
          allowedRegions={allowedRegions}
          allowedCountries={allowedCountries}
        />
      </Box>
      <CompanyAdminContainer />
    </Box>
  );
};

Details.displayName = 'Details';
