import { ChangeEvent } from 'react';
import Autocomplete from '@carrier-io/fds-react/Autocomplete';
import TextField from '@carrier-io/fds-react/TextField';
import { Typography } from '@carrier-io/fds-react';
import MenuItem from '@carrier-io/fds-react/MenuItem';
import { User } from '@carrier-io/lynx-fleet-types';

import { CreateGroupFormValuesType } from '../../../types';
import { useGetUsersForTenant } from '../../../../common';

interface CompanyUserSelectorProps {
  owner?: CreateGroupFormValuesType['owner'];
  tenantId: string;
  handleChange: (event: ChangeEvent<{}>, value: User | null) => void;
  error?: string;
  placeholder: string;
  usersEmailToExclude?: string[];
}

export const GroupOwnerSelector = ({
  owner = { email: '' },
  tenantId,
  handleChange,
  error,
  placeholder,
  usersEmailToExclude,
}: CompanyUserSelectorProps) => {
  const { users, isLoadingUsers } = useGetUsersForTenant(tenantId, usersEmailToExclude);

  return (
    <Autocomplete
      id="owner"
      loading={isLoadingUsers}
      options={users}
      value={owner}
      onChange={handleChange}
      getOptionLabel={(option) =>
        option.email ? `${option.firstName} ${option.lastName} (${option.email})` : ''
      }
      isOptionEqualToValue={(option: User, val: User) => option?.email === val?.email}
      renderOption={(_props, option) => (
        <MenuItem
          {..._props}
          sx={{
            height: 55,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            '& > p': {
              width: '100%',
            },
          }}
          key={option.email}
        >
          <Typography variant="body1">{`${option.firstName} ${option.lastName}`}</Typography>
          <Typography variant="body1" color="textSecondary">
            {option.email}
          </Typography>
        </MenuItem>
      )}
      renderInput={(params) => (
        <TextField {...params} label={placeholder} helperText={error} error={!!error} />
      )}
    />
  );
};
