import { useCallback, SyntheticEvent, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import TextField from '@carrier-io/fds-react/TextField';
import { Typography } from '@carrier-io/fds-react';
import Autocomplete from '@carrier-io/fds-react/Autocomplete';
import { Maybe, TenantsHierarchyTenant } from '@carrier-io/lynx-fleet-types';
import { TenantsHierarchy } from '@carrier-io/lynx-fleet-types/dist/common/tenant';

import { OptionItemDescription } from '@/types';
import { sortArrayOfObjectsByStringField } from '@/utils';
import { useAppSelector } from '@/stores';
import { getAuth } from '@/features/authentication';
import { useApplicationContext } from '@/providers/ApplicationContext';

const getCompaniesList = (tenantId: string, tenants: TenantsHierarchy['tenants']) => {
  let parent: TenantsHierarchyTenant | undefined | null = null;
  const foundTenant = tenants.find(({ id }) => id === tenantId);
  const children = tenants.filter(({ parentId }) => parentId === tenantId);

  if (foundTenant) {
    parent = tenants.find(({ id }) => id === foundTenant.parentId);
  }

  return [...children, ...(parent ? [parent] : [])].sort((a, b) =>
    sortArrayOfObjectsByStringField(a, b, 'label')
  );
};

interface CompanySelectFlatProps {
  tenantId: string;
  onChange: (data: OptionItemDescription) => void;
  value: Maybe<OptionItemDescription>;
}

export const CompanySelectFlat = ({ tenantId, onChange, value }: CompanySelectFlatProps) => {
  const { t } = useTranslation();

  const { appLanguage } = useApplicationContext();
  const regionNames = new Intl.DisplayNames([appLanguage], { type: 'region' });

  const { tenantsHierarchy, loading } = useAppSelector(getAuth);

  const companies = useMemo(
    () => getCompaniesList(tenantId, tenantsHierarchy?.tenants ?? []),
    [tenantId, tenantsHierarchy]
  );

  const companiesIds = tenantsHierarchy?.tenants?.map(({ id }) => id);

  const options: OptionItemDescription[] =
    companies
      .filter(({ id }) => companiesIds?.includes(id))
      .map(({ id, name, contactCountry }) => ({
        id,
        name,
        description: contactCountry && regionNames.of(contactCountry),
      }))
      .sort((a, b) => sortArrayOfObjectsByStringField(a, b, 'name')) || [];

  options.unshift({
    id: 'UNASSIGNED',
    name: 'Carrier',
    description: t('company.management.assets.unassigned-assets'),
  });

  const handleChange = useCallback(
    (_event: SyntheticEvent, option: OptionItemDescription) => {
      onChange(option);
    },
    [onChange]
  );

  const renderOption = (props, option) => (
    <li
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}
      {...props}
      key={`${props.id}`}
    >
      <Typography variant="body2">{option.name}</Typography>
      {option.description && (
        <Typography color="text.secondary" variant="body2">
          {option.description}
        </Typography>
      )}
    </li>
  );

  return (
    <Autocomplete
      disableClearable
      options={options}
      getOptionLabel={(option: OptionItemDescription) => option.name}
      isOptionEqualToValue={(option, val) => option.id === val.id}
      value={value}
      onChange={handleChange}
      loading={loading}
      renderOption={renderOption}
      renderInput={(params) => <TextField {...params} label={t('common.company')} />}
      noOptionsText={t('common.no-options')}
      loadingText={t('common.loading')}
    />
  );
};
