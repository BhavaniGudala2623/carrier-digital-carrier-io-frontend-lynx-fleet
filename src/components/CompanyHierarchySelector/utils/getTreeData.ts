import { Maybe, TenantsHierarchy, TenantsHierarchyTenant } from '@carrier-io/lynx-fleet-types';
import { groupBy, uniq } from 'lodash-es';
import { TFunction } from 'i18next';
import { TreeItemModel } from '@carrier-io/fds-react/patterns/TreeSelectAutoComplete';

import { recursivelyGetCompaniesChildren } from './recursivelyGetCompaniesChildren';
import { getNodeId } from './getNodeId';
import { filterCompaniesByCarrierGlobal } from './filterCompaniesByCarrierGlobal';

import {
  getCountryName,
  getNullKeyItems,
  getRegionByCountry,
  recursivelyGetTenantIdsFromTenants,
  sortArrayOfObjectsByStringField,
  sortStrings,
} from '@/utils';
import { ALL_COMPANIES } from '@/constants';

export const getTreeData = (
  t: TFunction,
  tenantsHierarchy: Maybe<TenantsHierarchy> | undefined,
  includeAllItem = true,
  includeUndefinedRegion = true
): TreeItemModel[] => {
  const level = 1;
  const result: TreeItemModel[] = includeAllItem
    ? [
        {
          nodeId: getNodeId('ALL', ALL_COMPANIES),
          label: t('company.filter.all-companies'),
          level,
        },
      ]
    : [];

  if (!tenantsHierarchy) {
    return result;
  }

  const { fleets } = tenantsHierarchy;
  const { tenantsWithoutCarrier: tenants, globalCarrierCompany } = filterCompaniesByCarrierGlobal(
    tenantsHierarchy.tenants
  );

  const regions = uniq(
    tenants
      .map((tenant) => tenant.contactRegion ?? getRegionByCountry(tenant.contactCountry))
      .filter(Boolean)
      .sort((a, b) => sortStrings(a, b))
  );

  const companies = [...tenants].sort((a, b) => sortArrayOfObjectsByStringField(a, b, 'name'));

  const companiesByParentId = groupBy(companies, 'parentId');
  const fleetsByParentId = groupBy(
    [...fleets].sort((a, b) => sortArrayOfObjectsByStringField(a, b, 'name')),
    (fleet) => fleet.parent?.id
  );

  const globalCarrierCompanyAndChieldIds = globalCarrierCompany
    ? recursivelyGetTenantIdsFromTenants(globalCarrierCompany.id, tenantsHierarchy.tenants)
    : [];

  if (globalCarrierCompany) {
    const carrierGlobalCompanyTree = recursivelyGetCompaniesChildren(
      0,
      [globalCarrierCompany],
      companiesByParentId,
      fleetsByParentId
    );
    result.push(carrierGlobalCompanyTree[0]);
  }

  const companiesWithoutCarrierAndChields = companies.filter(
    (item) => !globalCarrierCompanyAndChieldIds.includes(item.id)
  );

  const companiesByRegion = groupBy(
    companiesWithoutCarrierAndChields,
    (tenant) => tenant.contactRegion ?? getRegionByCountry(tenant.contactCountry)
  );
  const companiesSet = new Set(companiesWithoutCarrierAndChields.map((tenant) => tenant.id).filter(Boolean));
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
      ...(regionCountries
        .map((country): Maybe<TreeItemModel> => {
          // put only no parent companies under the country to avoid duplicates
          const children = recursivelyGetCompaniesChildren(
            level + 1,
            companiesByCountry[country.code].filter(noParentAvailable),
            companiesByParentId,
            fleetsByParentId
          );

          return children.length
            ? {
                level: level + 1,
                nodeId: getNodeId('COUNTRY', country.code),
                label: country.name,
                children,
              }
            : null;
        })
        .filter(Boolean) as TreeItemModel[]),
      // put no country and no parent companies under the region level
      ...recursivelyGetCompaniesChildren(
        level + 1,
        getNullKeyItems(companiesByCountry).filter(noParentAvailable),
        companiesByParentId,
        fleetsByParentId
      ),
    ];

    if (regionChildren.length) {
      if (region === 'UDEFINED') {
        if (includeUndefinedRegion) {
          result.push({
            nodeId: getNodeId('REGION', region),
            label: t('common.undefined-region'),
            level,
            children: regionChildren,
          });
        }
      } else {
        result.push({
          nodeId: getNodeId('REGION', region),
          label: t(`company.management.region.${region}`),
          level,
          children: regionChildren,
        });
      }
    }
  }

  return result;
};
