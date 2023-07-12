import {
  Maybe,
  LanguageType,
  TemperatureType,
  DistanceType,
  VolumeType,
  SpeedType,
  User,
  UserAccessibleTenantItem,
  GroupRole,
  Group as TenantGroup,
} from '@carrier-io/lynx-fleet-types';

import { SortedUser, LightGroup } from '../common/types';

import { OptionItem } from '@/types';

export interface Group {
  id: string;
  name: string;
}

export interface UserGroup extends Group {
  role: GroupRole;
}

export interface AddUserInput {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  company: Maybe<UserAccessibleTenantItem>;
  tenantId: string;
  isCompanyPreferenceLoading: boolean;
  preferences: {
    language: LanguageType;
    temperature: TemperatureType;
    distance: DistanceType;
    volume: VolumeType;
    speed: SpeedType;
    timezone: string;
  };
  sortedGroups?: UserGroup[];
  accessibleGroupsIds: string[];
  editableGroups: UserGroup[];
  nonEditableGroups: UserGroup[];
  availableTenantGroups: TenantGroup[];
}

export interface EditUserState {
  email: string;
  newEmail?: string;
  firstName: string;
  lastName: string;
  phone?: string;
  company: Maybe<OptionItem>;
  tenantId: string;
  preferences: {
    language: LanguageType;
    temperature: TemperatureType;
    distance: DistanceType;
    volume: VolumeType;
    speed: SpeedType;
    timezone: string;
  };
  sortedGroups: UserGroup[];
  accessibleGroupsIds: string[];
  editableGroups: UserGroup[];
  nonEditableGroups: UserGroup[];
  availableTenantGroups: TenantGroup[];
}

export interface UsersTableParams {
  data: User | SortedUser | LightGroup;
  value: never;
}

export type UsersTableView = 'Users' | 'Groups';
