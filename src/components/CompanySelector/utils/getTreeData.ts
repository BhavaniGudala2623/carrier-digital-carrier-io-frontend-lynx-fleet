import { Maybe, TenantsHierarchy, TenantsHierarchyTenant } from '@carrier-io/lynx-fleet-types';
import { groupBy, uniq } from 'lodash-es';
import { TFunction } from 'i18next';
import { TreeItemModel } from '@carrier-io/fds-react/patterns/TreeSelectAutoComplete';

import { recursivelyGetCompaniesChildren } from './recursivelyGetCompaniesChildren';

import {
  getCountryName,
  getNullKeyItems,
  getRegionByCountry,
  sortArrayOfObjectsByStringField,
  sortStrings,
} from '@/utils';

export const getTreeData = (
  t: TFunction,
  tenantsHierarchy: Maybe<TenantsHierarchy> | undefined,
  includeFleets = false,
  excludeCompanies = [] as string[]
): (TreeItemModel & { [key: string]: unknown })[] => {
  if (!tenantsHierarchy) {
    return [];
  }

  const result: (TreeItemModel & { [key: string]: unknown })[] = [];
  const level = 0;

  const { tenants, fleets } = tenantsHierarchy;

  const regions = uniq(
    tenants
      .map((tenant) => getRegionByCountry(tenant.contactCountry))
      .filter(Boolean)
      .sort((a, b) => sortStrings(a, b))
  );

  const companies = tenants
    .filter((tenant) => !excludeCompanies.includes(tenant.id))
    .sort((a, b) => sortArrayOfObjectsByStringField(a, b, 'name'));
  const companiesSet = new Set(companies.map((tenant) => tenant.id).filter(Boolean));
  const companiesByParentId = groupBy(companies, 'parentId');
  const companiesByRegion = groupBy(companies, (tenant) => getRegionByCountry(tenant.contactCountry));
  const fleetsByParentId = groupBy(
    [...fleets].sort((a, b) => sortArrayOfObjectsByStringField(a, b, 'name')),
    (fleet) => fleet.parent?.id
  );

  const noParentAvailable = (tenant: TenantsHierarchyTenant) => !companiesSet.has(tenant.parentId ?? '');

  for (const region of regions) {
    const uniqueRegionCountryCodes = uniq(
      companiesByRegion[region]?.map((item) => item.contactCountry).filter(Boolean) as string[]
    );

    const regionCountries = uniqueRegionCountryCodes
      .map((code) => ({
        code,
        name: t(getCountryName(code)),
      }))
      .sort((a, b) => sortArrayOfObjectsByStringField(a, b, 'name'));

    const companiesByCountry = groupBy(companiesByRegion[region], 'contactCountry');

    const regionChildren = [
      ...regionCountries.reduce(
        (
          acc: (TreeItemModel & { [key: string]: unknown })[],
          country
        ): (TreeItemModel & { [key: string]: unknown })[] => {
          // put only no parent companies under the country to avoid duplicates
          const children = recursivelyGetCompaniesChildren(
            level,
            companiesByCountry[country.code].filter(noParentAvailable),
            companiesByParentId,
            fleetsByParentId,
            includeFleets
          ).sort((a, b) => sortArrayOfObjectsByStringField(a, b, 'label'));

          return children.length ? [...acc, ...children] : acc;
        },
        []
      ),
      // put no country and no parent companies under the region level
      ...recursivelyGetCompaniesChildren(
        level,
        getNullKeyItems(companiesByCountry).filter(noParentAvailable),
        companiesByParentId,
        fleetsByParentId,
        includeFleets
      ).sort((a, b) => sortArrayOfObjectsByStringField(a, b, 'label')),
    ];

    result.push(...regionChildren);
  }

  return result.sort((a, b) => sortArrayOfObjectsByStringField(a, b, 'label'));
};
