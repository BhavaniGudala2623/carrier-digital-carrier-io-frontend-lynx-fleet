import { UserGroupConfig, User } from '@carrier-io/lynx-fleet-types';

import { LightGroup } from '../common/types';

export const getGroupsWhereUserIsOwner = (user: User): UserGroupConfig['group'][] => {
  const groups = user.groups || [];

  return groups
    .filter((groupConfig) => groupConfig.user.role === 'Owner')
    .map((groupConfig) => groupConfig.group);
};

export function isUserTableData(data: User | LightGroup): data is User {
  return data && (data as User).email !== undefined;
}
