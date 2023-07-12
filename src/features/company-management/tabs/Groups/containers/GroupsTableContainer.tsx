import { useMemo } from 'react';
import { GroupData, User } from '@carrier-io/lynx-fleet-types';

import { UserGroupsTable } from '../components';
import { useUsersTabState } from '../../common';
import { LightGroup, SortedUser } from '../../common/types';
import { makeGroupHierarchy } from '../utils';

interface UsersTableContainerProps {
  loading: boolean;
  rowUsers: User[];
  rowGroups: GroupData[];
}

export const GroupsTableContainer = ({ loading, rowUsers, rowGroups }: UsersTableContainerProps) => {
  const { editAllowed, deleteAllowed } = useUsersTabState();

  const sortedData: (SortedUser | LightGroup)[] = useMemo(
    () => makeGroupHierarchy(rowUsers, rowGroups),
    [rowUsers, rowGroups]
  );

  return (
    <UserGroupsTable
      editAllowed={editAllowed}
      deleteAllowed={deleteAllowed}
      data={sortedData}
      loading={loading}
    />
  );
};
