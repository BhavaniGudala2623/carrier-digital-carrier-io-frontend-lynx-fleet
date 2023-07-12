import { isEqual, isObject, keys, isEmpty } from 'lodash-es';
import { Maybe } from '@carrier-io/lynx-fleet-types';

import { EditUserState } from '../tabs/Users/types';
import type { NavigationTreeNode, CompaniesTreeNode, TreeNode } from '../types';

import { FleetRow } from '@/types';
import { regionsDictionary } from '@/constants';
import { getCountryName } from '@/utils';

export const parseNodeId = (nodeId: string) => ({
  id: nodeId.split('|')[1] ?? '',
  type: nodeId.split('|')[0] ?? '',
});

export const generateId = (type: string, id: string): string => `${type}-${id}`;

export const getTreeNodeName = (nodeId: string): string => {
  const { type, id } = parseNodeId(nodeId);
  if (type === 'COUNTRY') {
    return getCountryName(id);
  }

  if (type === 'GLOBAL') {
    return 'company.management.global';
  }

  if (type === 'REGION') {
    return regionsDictionary[id];
  }

  if (type === 'ALL') {
    return 'company.management.country.name.ALL';
  }

  return id;
};

export const findPath = (
  item: NavigationTreeNode | CompaniesTreeNode,
  selectedItem: NavigationTreeNode | CompaniesTreeNode
): Maybe<NavigationTreeNode[]> => {
  if (
    generateId(item.type, item.value.id || item.value.name) ===
    generateId(selectedItem.type, selectedItem.value.id || selectedItem.value.name)
  ) {
    return [item] as NavigationTreeNode[];
  }
  if (!item.children) {
    return null;
  }

  // Cast to NavigationTreeNode[], otherwise there is an error that
  // none of signatures are compatible with each other
  const children = item.children as never[];
  const path = children.reduce<NavigationTreeNode[] | null>((prev, curr) => {
    if (prev) {
      return prev;
    }

    return findPath(curr, selectedItem);
  }, null);

  return (path && [item, ...path]) as NavigationTreeNode[];
};

const checkIfChildrenContainTenantId = (
  children: CompaniesTreeNode['children'],
  tenantId: Maybe<string>
): boolean => {
  if (!children || !tenantId) {
    return false;
  }

  let result = false;

  for (const company of children) {
    result = company.value.id === tenantId || checkIfChildrenContainTenantId(company.children, tenantId);
    if (result) {
      return result;
    }
  }

  return result;
};

// Returns top level company tree node that contains any node with tenantId
export const findRootCompaniesTreeNodeByTenantId = (
  children: CompaniesTreeNode['children'],
  tenantId: Maybe<string>
): Maybe<CompaniesTreeNode> => {
  if (!children || !tenantId) {
    return null;
  }

  let rootCompany;

  for (const company of children) {
    if (company.value.id === tenantId || checkIfChildrenContainTenantId(company.children, tenantId)) {
      rootCompany = company;

      return rootCompany;
    }
  }

  return null;
};

export const flattenTree = <T>(root: TreeNode<T>): TreeNode<T>[] =>
  // eslint-disable-next-line no-unsafe-optional-chaining
  [root, ...(root?.children ?? [])?.flatMap?.(flattenTree)].filter(Boolean);

/**
 * Deep diff between two object, using lodash
 * @param  {Object} object Object compared
 * @param  {Object} base   Objaect to compare with
 * @return {Object}        Return a new object who represent the diff
 */

export type ObjectType = Record<string, string | number | false | Record<string, string | number | boolean>>;

export function getObjectDifference(object: ObjectType, base: ObjectType): ObjectType {
  return keys(object).reduce((result, key) => {
    if (isEqual(object[key], base[key])) {
      return result;
    }

    if (isObject(object[key]) && isObject(base[key])) {
      const value = getObjectDifference(object[key] as ObjectType, base[key] as ObjectType);

      return {
        ...result,
        ...(!isEmpty(value) && {
          [key]: value,
        }),
      };
    }

    return {
      ...result,
      [key]: object[key],
    };
  }, {});
}

export const mapUserPreferences = (preferences: Partial<EditUserState['preferences']>) => ({
  measurementDistance: preferences.distance,
  measurementTemperature: preferences.temperature,
  measurementVolume: preferences.volume,
  measurementSpeed: preferences.speed,
  language: preferences.language,
  timezone: preferences.timezone,
});

export const getEntityType = <T extends { __typename?: Maybe<string> }>(
  data: T
): Maybe<string | undefined> => {
  if (isEmpty(data)) {
    return null;
  }

  if (isObject(data) && !('__typename' in data)) {
    return null;
  }

  const { __typename: type } = '__typename' in data ? data : { ...data, __typename: null };

  return type;
};

// data - data object in the table row
export const isAssetPopulatedRow = <T extends { __typename?: Maybe<string> }>(data: T) =>
  getEntityType<T>(data) === 'AssetPopulated';

export const filterFleetRowsById = (fleetData: FleetRow[], selectedFleetId?: null | string) =>
  fleetData.filter(({ fleet }) => fleet.id === selectedFleetId);
