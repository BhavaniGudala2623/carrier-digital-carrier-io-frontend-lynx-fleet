import { useTranslation } from 'react-i18next';
import { User } from '@carrier-io/lynx-fleet-types';

import { getUsersColumns, useUsersTabState } from '../../common';
import { UsersTable } from '../components';

import { useUserSettings } from '@/providers/UserSettings';

interface UsersTableContainerProps {
  loading: boolean;
  rowData: User[];
}

export const UsersTableContainer = ({ loading, rowData }: UsersTableContainerProps) => {
  const { t } = useTranslation();
  const { setSelectedUsers, selectedUsers, editAllowed, deleteAllowed } = useUsersTabState();
  const {
    userSettings: { timezone, dateFormat },
  } = useUserSettings();

  const columnDefs = getUsersColumns({
    editAllowed,
    deleteAllowed,
    dateFormat,
    t,
    timezone,
  });

  return (
    <UsersTable
      columnDefs={columnDefs}
      rowData={rowData}
      loading={loading}
      selectedUsers={selectedUsers}
      setSelectedUsers={setSelectedUsers}
    />
  );
};
