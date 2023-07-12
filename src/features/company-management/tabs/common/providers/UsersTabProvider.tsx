import { createContext, useContext, useMemo, useState } from 'react';
import { useRbac } from '@carrier-io/rbac-provider-react';
import { Maybe, User } from '@carrier-io/lynx-fleet-types';

import { UsersTableView } from '../../Users/types';

import { useAppSelector } from '@/stores';
import { getAuthTenantId } from '@/features/authentication';
import { actionPayload } from '@/features/authorization';

type UsersTabContextValue = {
  selectedUsers: User['email'][];
  setSelectedUsers: (users: User['email'][]) => void;
  tableView: UsersTableView;
  setTableView: (newView: UsersTableView) => void;
  editAllowed: boolean;
  deleteAllowed: boolean;
};

const UsersTabContext = createContext<Maybe<UsersTabContextValue>>(null);

export const useUsersTabState = () => {
  const context = useContext(UsersTabContext);

  if (!context) {
    throw Error('No provider found for UsersTabContext');
  }

  return context;
};

export const UsersTabProvider = ({ children }: { children: JSX.Element }) => {
  const [selectedUsers, setSelectedUsers] = useState<User['email'][]>([]);
  const [tableView, setTableView] = useState<UsersTableView>('Users');

  const { hasPermission } = useRbac();
  const tenantId = useAppSelector(getAuthTenantId);

  const { editAllowed, deleteAllowed } = useMemo(
    () => ({
      editAllowed: hasPermission(
        actionPayload({ action: 'user.edit', subjectId: tenantId, subjectType: 'USER' })
      ),
      deleteAllowed: hasPermission(
        actionPayload({ action: 'user.delete', subjectId: tenantId, subjectType: 'USER' })
      ),
    }),
    [hasPermission, tenantId]
  );

  const contextValue = useMemo(
    () => ({
      selectedUsers,
      setSelectedUsers,
      tableView,
      setTableView,
      editAllowed,
      deleteAllowed,
    }),
    [selectedUsers, tableView, editAllowed, deleteAllowed]
  );

  return <UsersTabContext.Provider value={contextValue}>{children}</UsersTabContext.Provider>;
};
