import { Company, Maybe, Sorting } from '@carrier-io/lynx-fleet-types';

import { CompanyManagementGridTab, ISearchStatistics, CompaniesTreeNode, NavigationTreeNode } from '../types';

export type TreeState<T> = {
  root: AsyncDataState<T>;
};

export type NavigationTreeState = {
  treeSort: Maybe<Sorting>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  treeItemsById: Record<string, any>;
  companiesTree: { root: AsyncDataState<CompaniesTreeNode> };
  tree: TreeState<NavigationTreeNode>;
};

export type CompanyManagementState = {
  selectedGridTab: CompanyManagementGridTab;
  searchText: string;
  selectedSplitButtonIndex: Maybe<number>;
  selectedTableCompaniesIds: Company['id'][];
  searchStatistics: ISearchStatistics;
};

export const enum AsyncCallStatus {
  IDLE = 'IDLE',
  PENDING = 'PENDING',
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS',
}

export type AsyncDataState<T> = {
  value: Maybe<T>;
  status: AsyncCallStatus;
  error?: Maybe<string>;
};
