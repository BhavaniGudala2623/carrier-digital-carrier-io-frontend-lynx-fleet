import TextField from '@carrier-io/fds-react/TextField';
import Checkbox from '@carrier-io/fds-react/Checkbox';
import MenuItem from '@carrier-io/fds-react/MenuItem';
import Typography from '@carrier-io/fds-react/Typography';
import Autocomplete, { AutocompleteProps } from '@carrier-io/fds-react/Autocomplete';
import { useTranslation } from 'react-i18next';
import { User } from '@carrier-io/lynx-fleet-types';

type UsersSelectorProps = Pick<AutocompleteProps, 'onChange' | 'value'> & {
  users: User[];
  isLoadingUsers: boolean;
};

export function UserSelector({ value, users, onChange, isLoadingUsers, ...rest }: UsersSelectorProps) {
  const { t } = useTranslation();

  return (
    <Autocomplete
      multiple
      limitTags={1}
      options={users}
      disableCloseOnSelect
      getOptionLabel={(option) =>
        option.fullName ? option.fullName : `${option.firstName} ${option.lastName}`
      }
      value={value}
      onChange={onChange}
      loading={isLoadingUsers}
      isOptionEqualToValue={(option: User, val: User) => option.email === val.email}
      renderOption={(props, option) => (
        <MenuItem {...props} key={props.id}>
          <Checkbox checked={!!value?.find((user) => user.email === option.email)} />
          <Typography variant="body1">
            {option.fullName ? option.fullName : `${option.firstName} ${option.lastName}`}
          </Typography>
        </MenuItem>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label={t('company.management.create-group.select-users')}
          helperText={t('company.management.create-group.users-members')}
        />
      )}
      {...rest}
    />
  );
}
