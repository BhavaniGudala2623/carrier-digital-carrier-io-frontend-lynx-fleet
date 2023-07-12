import { TFunction } from 'i18next';
import { omit } from 'lodash-es';
import { Group, GroupData, User } from '@carrier-io/lynx-fleet-types';

import { LightGroup, SortedUser } from '../common/types';

import { UpdateGroupFormValuesType, UserItem } from './types';

const DEFAULT_ENABLED_FEATURES = ['assetTracking', 'temperatureChart', 'assetHistory'];

export function getStepsTitle(t: TFunction<'translation'>) {
  return [
    t('company.management.users.create-group.step.details'),
    t('company.management.users.create-group.step.select-users'),
    t('company.management.users.create-group.step.assign-roles'),
    t('company.management.users.create-group.step.features'),
  ];
}

const userToUserItem = (user: User): UserItem => ({ ...user, checked: false });

export const getUsersListByRole = (
  usersByRole: Group['users'],
  users: User[]
): { ['Member']: UserItem[]; ['Manager']: UserItem[] } => {
  const members = usersByRole.find((userGroup) => userGroup.role === 'Member');
  const managers = usersByRole.find((userGroup) => userGroup.role === 'Manager');

  const membersEmails = members ? members.userIds : [];
  const managesEmails = managers ? managers.userIds : [];

  return {
    Member: users.filter((user) => membersEmails.includes(user.email)).map(userToUserItem),
    Manager: users.filter((user) => managesEmails.includes(user.email)).map(userToUserItem),
  };
};

export const omitDefaultFeatures = (features: Group['features']) =>
  features.filter((f) => !DEFAULT_ENABLED_FEATURES.includes(f.name));

export const omitFeatureSystemField = (feature: Group['features'][number]) => omit(feature, '__typename');

export const getGroupFeatures = (features: Group['features']) =>
  omitDefaultFeatures(features).map(omitFeatureSystemField);

export const getUserList = (users: User[], usersByRole: Group['users']): UserItem[] => {
  const existingUsersEmailsInGroup = usersByRole.flatMap((userGroup) =>
    userGroup.role === 'Owner' ? [] : userGroup.userIds
  );

  return users
    .filter((user) => existingUsersEmailsInGroup.includes(user.email))
    .map((user) => ({ ...user, checked: false }));
};

export const getGroupOwnerId = (users: UpdateGroupFormValuesType['users']) =>
  users.find((userGroup) => userGroup.role === 'Owner')?.userIds[0] || null;

export const isAdminGroup = (groupName: Group['name']) => groupName === 'Admins';

export const getOwnerNameDisplayValue = (user: User) => {
  const ownerNameValue = `${user?.firstName ?? ''} ${user?.lastName ?? ''}`;

  return ownerNameValue.trim() ? ownerNameValue : '-';
};

export const hasAssessRestrictions = (
  accessAllowedRestrictions: Group['accessAllowedRestrictions']
): boolean => {
  if (!accessAllowedRestrictions) {
    return false;
  }

  const { countries, regions } = accessAllowedRestrictions;

  const countriesList = countries || [];
  const regionsList = regions || [];

  return countriesList.length > 0 || regionsList.length > 0;
};

export const makeGroupHierarchy: (users: User[], groups: GroupData[]) => (SortedUser | LightGroup)[] = (
  users,
  groups
) => {
  const sortedUsers: SortedUser[] = [];

  const lightGroups: LightGroup[] = groups.map(
    (group): LightGroup => ({
      id: group.id,
      name: group.name,
      tenantName: group.tenantName ?? '',
      hierarchy: [group.id],
      users: users.filter(({ groups: userGroups }) => userGroups?.find(({ group: g }) => g.id === group.id)),
      type: 'GROUP',
    })
  );

  users.forEach((user) => {
    user.groups?.forEach(({ group }) => {
      if (lightGroups.find((item) => item.id === group.id)) {
        sortedUsers.push({
          ...user,
          isAdminGroup: user.tenant?.adminGroupId === group.id,
          hierarchy: [group.id, user.email],
          isPrimaryContact: user.email === user?.tenant?.contactInfo?.email,
          thisGroupId: group.id,
          type: 'USER',
        });
      }
    });
  });

  return [...lightGroups, ...sortedUsers];
};

export const getAddedUsers = (members: User[], managers: User[], newUsers: User[]) =>
  newUsers.filter(
    (user) =>
      !(
        members.find(({ email }) => email === user.email) ||
        managers.find(({ email }) => email === user.email)
      )
  );

export const getRemovedUsers = (currentUsers: User[], newUsers: User[]) =>
  currentUsers.filter((member) => {
    const foundMember = newUsers.find(({ email }) => email === member.email);

    return !foundMember;
  });

export const summarizeUsers = (users: User[], removedUsers: User[]) =>
  users.filter((member) => !removedUsers.find(({ email }) => email === member.email));
