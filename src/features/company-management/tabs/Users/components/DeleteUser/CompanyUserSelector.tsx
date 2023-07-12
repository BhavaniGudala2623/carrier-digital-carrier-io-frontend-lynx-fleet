import Autocomplete from '@carrier-io/fds-react/Autocomplete';
import TextField from '@carrier-io/fds-react/TextField';
import { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { User } from '@carrier-io/lynx-fleet-types';

import { useGetUsersForTenant } from '../../../common';

interface CompanyUserSelectorProps {
  tenantId: string;
  ownerEmail: string;
  handleChange: (event: ChangeEvent<{}>, value: User | null) => void;
}

export const CompanyUserSelector = ({ tenantId, ownerEmail, handleChange }: CompanyUserSelectorProps) => {
  const { t } = useTranslation();
  const { users, isLoadingUsers } = useGetUsersForTenant(tenantId, [ownerEmail]);

  return (
    <Autocomplete
      id="select-user"
      loading={isLoadingUsers}
      options={users}
      onChange={handleChange}
      getOptionLabel={(option) => `${option.firstName} ${option.lastName} (${option.email})`}
      style={{ width: '100%' }}
      renderInput={(params) => (
        <TextField {...params} label={t('user.management.user.delete-user.change-group-owner.select-user')} />
      )}
    />
  );
};
