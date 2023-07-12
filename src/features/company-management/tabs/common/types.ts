import { Maybe, User, AssetRow, AccessLevelType, FeatureType } from '@carrier-io/lynx-fleet-types';

import { CompaniesTreeNode } from '../../types';

export interface SortedUser extends User {
  isAdminGroup?: boolean;
  isPrimaryContact?: boolean;
  hierarchy: string[];
  thisGroupId?: string;
  type: 'USER';
}

export interface LightGroup {
  id: string;
  name: string;
  tenantName: string;
  hierarchy: string[];
  users: User[];
  type: 'GROUP';
}

export type AssetTableView = 'Assets' | 'Fleets';

export interface RowSelected {
  id: AssetRow['id'];
  tenantId: string;
  __typename?: Maybe<string>;
}

export interface AssetsTableParams<T> {
  data: T;
  value: never;
}

export type MoveAssetsState = {
  assets: AssetRow[];
  company: Maybe<CompaniesTreeNode>;
  tenantId: string;
  unassign: boolean;
};

export type ConfigFeatures<T = Feature> = {
  configName: 'Core' | 'Admin' | 'External Links';
  features: T[];
};

export type Feature = {
  name: FeatureType;
  title: string;
  logo: JSX.Element | null;
  enabled: boolean;
  accessLevel: Maybe<AccessLevelType>;
  accessLevels: { type: AccessLevelType; label: string; enabled: boolean }[];
  subTenantsEnabled: boolean;
  editingDisabled: boolean;
};

export interface HandleDeleteUserGroup {
  groupToDeleteId: string;
  groupToReceiveId: string;
  usersToDelete?: User[];
}
