import { Maybe, CreateGroupInput, User, AccessLevelType, FeatureType } from '@carrier-io/lynx-fleet-types';

import { UserAccessibleTenantsSelectItem } from '@/features/common';

export type UserItem = User & { checked: boolean };

export type CreateGroupFormValuesType = {
  tenantId: string;
  name: CreateGroupInput['name'];
  users: CreateGroupInput['users'];
  features: CreateGroupInput['features'];
  owner?: Maybe<User>;
  ownerName?: string;
  isOwnerLoading?: boolean;
  ownerEmail: string;
  usersListByRole: { ['Member']: UserItem[]; ['Manager']: UserItem[] };
  usersList: UserItem[];
  company: Maybe<UserAccessibleTenantsSelectItem>;
  accessAllowedRestrictions?: CreateGroupInput['accessAllowedRestrictions'];
  isAdminGroup?: boolean;
};

export type UpdateGroupFormValuesType = CreateGroupFormValuesType & { id: string };

export type Feature = {
  name: FeatureType;
  title: string;
  enabled: boolean;
  accessLevel: Maybe<AccessLevelType>;
  accessLevels: { type: AccessLevelType; label: string }[];
};

export type CreateGroupPayloadType = Omit<CreateGroupInput, 'created' | 'createdBy'>;

export type RadioButtonValueType = 'MOVE' | 'DELETE';
