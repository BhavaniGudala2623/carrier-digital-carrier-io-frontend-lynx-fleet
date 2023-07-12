import { Maybe, Company } from '@carrier-io/lynx-fleet-types';

export interface HierarchicalCompany extends Company {
  hierarchy: string[];
}

export interface CompaniesTableTreeParams {
  data: HierarchicalCompany;
  value: never;
}

export interface CompaniesTableParams {
  data: Company;
  value: never;
}

export const enum CompaniesTableView {
  Companies = 'Companies',
  Parents = 'Parents',
}

export interface PrimaryContactProps {
  name?: Maybe<string>;
  lastName?: Maybe<string>;
  email?: Maybe<string>;
  phone?: Maybe<string>;
}

export type CompanyTreeItemType = 'NONE' | 'ALL' | 'COMPANY' | 'FLEET';

export type TreeNode<T> = {
  type: T;
  value: { id: string; name: string };
  children?: Maybe<TreeNode<T>[]>;
};

export type CompaniesTreeNode = TreeNode<CompanyTreeItemType>;
