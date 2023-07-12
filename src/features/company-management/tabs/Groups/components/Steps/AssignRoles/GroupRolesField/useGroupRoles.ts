import { useState, useEffect } from 'react';
import { useFormikContext } from 'formik';

import { CreateGroupFormValuesType, UserItem } from '../../../../types';

export const useGroupRoles = () => {
  const { values } = useFormikContext<CreateGroupFormValuesType>();
  const [members, setMembers] = useState(values.usersListByRole.Member);
  const [managers, setManagers] = useState(values.usersListByRole.Manager);

  useEffect(() => {
    if (values.usersListByRole.Member.length !== members.length) {
      setMembers(values.usersListByRole.Member);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.usersListByRole.Member.length]);

  useEffect(() => {
    if (values.usersListByRole.Manager.length !== managers.length) {
      setManagers(values.usersListByRole.Manager);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.usersListByRole.Manager.length]);

  const checkUser =
    (users: UserItem[], setUsers: (users: UserItem[]) => void) => (user: UserItem, value: boolean) =>
      setUsers(
        users.map((currUser) => (user.email === currUser.email ? { ...currUser, checked: value } : currUser))
      );

  const selectMemebers = checkUser(members, setMembers);
  const selectManagers = checkUser(managers, setManagers);

  const toggleAll = (users: UserItem[], setUsers: (users: UserItem[]) => void) => (value: boolean) => {
    setUsers(users.map((user) => ({ ...user, checked: value })));
  };

  const toggleAllMembers = toggleAll(members, setMembers);
  const toggleAllManagers = toggleAll(managers, setManagers);

  const moveUsers =
    (
      sourceUserList: UserItem[],
      targetUserList: UserItem[],
      setSourceUserList: (users: UserItem[]) => void,
      setTargetUserList: (users: UserItem[]) => void
    ) =>
    () => {
      const selectedUsers = sourceUserList.filter((user) => user.checked);
      setTargetUserList(targetUserList.concat(selectedUsers.map((user) => ({ ...user, checked: false }))));
      setSourceUserList(
        sourceUserList.flatMap((user) =>
          selectedUsers.find((selectedUser) => user.email === selectedUser.email) ? [] : [user]
        )
      );
    };

  const moveMembers = moveUsers(members, managers, setMembers, setManagers);
  const moveManagers = moveUsers(managers, members, setManagers, setMembers);

  const selectedMembersCount = members.filter((member) => member.checked).length;
  const selectedManagersCount = managers.filter((manager) => manager.checked).length;

  return {
    members,
    managers,
    selectMemebers,
    selectManagers,
    toggleAllMembers,
    toggleAllManagers,
    moveMembers,
    moveManagers,
    selectedMembersCount,
    selectedManagersCount,
  };
};
