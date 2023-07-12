import { Maybe, CreateCompanyInput } from '@carrier-io/lynx-fleet-types';

import { SelectedCompanyHierarchy } from '@/providers/ApplicationContext';

export type CompanyManagementGridTab = 'COMPANIES' | 'PARENTS' | 'ASSETS' | 'FLEETS' | 'USERS' | 'GROUPS';

export type NavigationTreeItemType = 'NONE' | 'GLOBAL' | 'REGION' | 'COUNTRY' | 'COMPANY' | 'FLEET';
export type CompanyTreeItemType = 'NONE' | 'COMPANY' | 'FLEET' | 'ALL';

export type TreeNode<T> = {
  type: T;
  value: { id: string; name: string };
  children?: Maybe<TreeNode<T>[]>;
};

export type CompaniesTreeNode = TreeNode<CompanyTreeItemType>;
export type NavigationTreeNode = TreeNode<NavigationTreeItemType>;

export enum CompanyType {
  CarrierWarehouse = 'CarrierWarehouse',
  Customer = 'Customer',
  Dealer = 'Dealer',
  Distributor = 'Distributor',
  ServicePartner = 'ServicePartner',
}

export interface ITab {
  id: CompanyManagementGridTab;
  label: string;
  disabled: boolean;
  hide: boolean;
}

export interface CreateCompanyFormData extends CreateCompanyInput {
  tenantId?: Maybe<string>;
  parentCompany?: Maybe<SelectedCompanyHierarchy>;
}

export interface ISearchStatistics {
  COMPANIES: { value: number; loading: boolean; display: boolean };
  PARENTS: { value: number; loading: boolean; display: boolean };
  ASSETS: { value: number; loading: boolean; display: boolean };
  FLEETS: { value: number; loading: boolean; display: boolean };
  USERS: { value: number; loading: boolean; display: boolean };
  GROUPS: { value: number; loading: boolean; display: boolean };
}
