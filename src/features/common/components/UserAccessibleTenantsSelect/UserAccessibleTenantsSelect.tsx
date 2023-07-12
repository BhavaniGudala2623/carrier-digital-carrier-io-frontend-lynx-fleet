import { useEffect, useMemo, SyntheticEvent, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import Autocomplete from '@carrier-io/fds-react/Autocomplete';
import TextField from '@carrier-io/fds-react/TextField';

import { useGetUserTenants } from '../../hooks';

import { sortArrayOfObjectsByStringField } from '@/utils';
import { Maybe, OptionItem, FormAutocompleteProps } from '@/types';

export type UserAccessibleTenantsSelectItem = OptionItem & { isCarrierGlobal?: boolean };

type UserAccessibleTenantsSelectProps = FormAutocompleteProps & {
  defaultId?: string;
  value: Maybe<UserAccessibleTenantsSelectItem>;
  onChange: (value: UserAccessibleTenantsSelectItem) => void;
  renderSingleOptionAsDisabledTextField?: boolean;
  sortCarrierCompany?: boolean;
};

export const UserAccessibleTenantsSelect = ({
  defaultId,
  value,
  onChange,
  sortCarrierCompany = false,
  renderSingleOptionAsDisabledTextField,
  disabled,
  ...rest
}: UserAccessibleTenantsSelectProps) => {
  const { t } = useTranslation();
  const { loading, tenants } = useGetUserTenants();

  const options = useMemo(() => {
    if (sortCarrierCompany) {
      const companies = Object.values(tenants);
      const carrierCompanyIndex = Object.values(tenants).findIndex((company) => company.isCarrierGlobal);
      if (carrierCompanyIndex > -1) {
        const carrierCompany = companies.splice(carrierCompanyIndex, 1)[0];

        return [carrierCompany, ...companies.sort((a, b) => sortArrayOfObjectsByStringField(a, b, 'name'))];
      }
    }

    return Object.values(tenants)
      .map(
        (item): UserAccessibleTenantsSelectItem => ({
          id: item.id,
          name: item.name,
          isCarrierGlobal: item.isCarrierGlobal,
        })
      )
      .sort((a, b) => sortArrayOfObjectsByStringField(a, b, 'name'));
  }, [sortCarrierCompany, tenants]);

  useEffect(() => {
    if (value || !options.length) {
      return;
    }

    if (options.length === 1) {
      onChange(options[0]);
    } else {
      const tenant = options.find((item) => item.id === defaultId);
      if (tenant) {
        onChange(tenant);
      }
    }
  }, [value, options, onChange, defaultId]);

  const handleChange = useCallback(
    (_event: SyntheticEvent, option: UserAccessibleTenantsSelectItem) => {
      onChange(option);
    },
    [onChange]
  );

  if (renderSingleOptionAsDisabledTextField && options.length === 1) {
    return (
      <TextField
        value={value?.name}
        label={t('common.company')}
        hideBackgroundColor
        disabled
        showBorder={false}
        size={rest.size}
        sx={rest.sx}
      />
    );
  }

  return (
    <Autocomplete
      {...rest}
      disableClearable
      options={options}
      getOptionLabel={(option: UserAccessibleTenantsSelectItem) => option.name}
      isOptionEqualToValue={(option, val) => option.id === val.id}
      value={value}
      onChange={handleChange}
      loading={loading}
      disabled={options.length === 1 || disabled}
      renderOption={(props, option: UserAccessibleTenantsSelectItem) => (
        <li {...props} key={`${props.id}`}>
          {option.name}
        </li>
      )}
      renderInput={(params) => <TextField {...params} label={t('common.company')} />}
      noOptionsText={t('common.no-options')}
      loadingText={t('common.loading')}
    />
  );
};
