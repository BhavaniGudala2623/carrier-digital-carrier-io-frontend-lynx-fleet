import { useMemo, SyntheticEvent, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Autocomplete from '@carrier-io/fds-react/Autocomplete';
import TextField from '@carrier-io/fds-react/TextField';

import { useGetFleetsForTenant } from '../../hooks';

import { FormAutocompleteProps, Maybe, OptionItem } from '@/types';

type TenantFleetsSelectProps = FormAutocompleteProps & {
  tenantId?: string;
  defaultId?: string;
  value: Maybe<OptionItem>;
  onChange: (value: Maybe<OptionItem>) => void;
  hideIfNoOptions?: boolean;
};

export const TenantFleetsSelect = ({
  tenantId,
  defaultId,
  value,
  onChange,
  hideIfNoOptions,
  ...rest
}: TenantFleetsSelectProps) => {
  const { t } = useTranslation();
  const { loading, fleets } = useGetFleetsForTenant(tenantId);

  const options = useMemo(
    () => fleets.map((item): OptionItem => ({ id: item.id, name: item.name })),
    [fleets]
  );

  useEffect(() => {
    if (!options.length && value) {
      onChange(null);
    }

    if (!options.length) {
      return;
    }

    if (!value && defaultId) {
      const fleet = options.find((item) => item.id === defaultId);
      if (fleet) {
        onChange(fleet);
      }
    }
  }, [value, options, onChange, defaultId]);

  const handleChange = useCallback(
    (_event: SyntheticEvent, option: OptionItem) => {
      onChange(option);
    },
    [onChange]
  );

  return (
    <Autocomplete
      {...rest}
      options={options}
      getOptionLabel={(option: OptionItem) => option.name}
      value={value}
      onChange={handleChange}
      loading={loading}
      hidden={hideIfNoOptions && !options.length}
      renderOption={(props, option: OptionItem) => (
        <li {...props} key={`${props.id}`}>
          {option.name}
        </li>
      )}
      renderInput={(params) => <TextField {...params} label={t('common.fleet-optional')} />}
      noOptionsText={t('common.no-options')}
      loadingText={t('common.loading')}
    />
  );
};
