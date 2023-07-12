import { useFormikContext } from 'formik';
import { AutocompleteProps } from '@carrier-io/fds-react/Autocomplete';
import Typography from '@carrier-io/fds-react/Typography';
import { useTranslation } from 'react-i18next';
import { User } from '@carrier-io/lynx-fleet-types';

import { ContentContainer } from '../styles';
import { CreateGroupFormValuesType } from '../../../types';
import { useGetUsersForTenant } from '../../../../common';
import { getAddedUsers, getRemovedUsers, summarizeUsers } from '../../../utils';

import { UserSelector } from './UserSelector';

import { sortArrayOfObjectsByStringField } from '@/utils';

export const SelectUsers = () => {
  const { t } = useTranslation();
  const { values, setFieldValue } = useFormikContext<CreateGroupFormValuesType>();

  const handleUsersChange: AutocompleteProps['onChange'] = (_event, value: User[]) => {
    const users = value.map((user) => ({ ...user }));
    const currentUsersListByRole = values.usersListByRole;
    const addedMembers = getAddedUsers(currentUsersListByRole.Member, currentUsersListByRole.Manager, users);
    const removedMembers = getRemovedUsers(currentUsersListByRole.Member, users);
    const removedManagers = getRemovedUsers(currentUsersListByRole.Manager, users);
    const sumMembers = summarizeUsers([...currentUsersListByRole.Member, ...addedMembers], removedMembers);
    const sumManagers = summarizeUsers(currentUsersListByRole.Manager, removedManagers);

    const selectedUsersByRole = {
      Member: sumMembers,
      Manager: sumManagers,
    };

    setFieldValue('usersListByRole', selectedUsersByRole);
    setFieldValue('usersList', users);
  };

  const sortUsers = (a, b) => sortArrayOfObjectsByStringField(a, b, 'firstName');

  const { users: loadedUsers, isLoadingUsers } = useGetUsersForTenant(values.tenantId, [values.ownerEmail]);

  return (
    <ContentContainer>
      <Typography variant="body1" sx={{ mb: 1, mt: 3 }}>
        {t('company.management.create-group.users-to-include')}
      </Typography>
      <UserSelector
        value={values.usersList}
        users={[...loadedUsers].sort(sortUsers)}
        onChange={handleUsersChange}
        isLoadingUsers={isLoadingUsers}
      />
    </ContentContainer>
  );
};

SelectUsers.displayName = 'SelectUsers';
