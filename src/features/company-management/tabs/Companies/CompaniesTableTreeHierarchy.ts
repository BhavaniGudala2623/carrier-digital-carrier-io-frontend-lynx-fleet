import { Company, Maybe } from '@carrier-io/lynx-fleet-types';
import { differenceWith, groupBy } from 'lodash-es';

import { HierarchicalCompany } from './types';

import { SelectedCompanyHierarchy } from '@/providers/ApplicationContext';

const filterCompanyByParentId = (companies: Company[], tenantId: Maybe<string>) =>
  companies.filter(({ parentId, id }) => parentId === tenantId && tenantId !== id);

const attachHierarchy = (
  data: Company[],
  tenantId: Maybe<string>,
  parentHierarchy: string[],
  selectedItem: Maybe<SelectedCompanyHierarchy>
): HierarchicalCompany[] => {
  if (tenantId || selectedItem?.type === 'ALL') {
    const filteredData = filterCompanyByParentId(data, tenantId);

    return filteredData.map((company) => ({
      ...company,
      hierarchy: [...parentHierarchy, company.name],
    }));
  }

  return data.map((company) => ({
    ...company,
    hierarchy: [...parentHierarchy, company.name],
  }));
};

const getHierarchy = (data: Company[], companies: HierarchicalCompany[]) => {
  let hierarchicalCompanies = companies;
  let parentBox = hierarchicalCompanies;
  let allChildren: HierarchicalCompany[] = [];

  while (parentBox.length > 0) {
    const childrenBox = parentBox?.reduce(
      (acc: HierarchicalCompany[], { id, hierarchy }) => [
        ...acc,
        ...attachHierarchy(data, id, hierarchy, null),
      ],
      []
    );

    allChildren = [...allChildren, ...childrenBox];

    hierarchicalCompanies = [...hierarchicalCompanies, ...childrenBox];

    parentBox = childrenBox;
  }

  return {
    hierarchicalCompanies,
    allChildren,
  };
};

const getCompaniesOnlyWithChildren = (companies: HierarchicalCompany[]) => {
  const sortedByParentId = groupBy(companies, 'parentId');

  return companies.filter((company) => company.hierarchy.length > 1 || sortedByParentId[company.id]);
};

const companiesComparator = ({ id: id1 }: HierarchicalCompany, { id: id2 }: HierarchicalCompany) =>
  id1 === id2;

export const makeHierarchy = (
  data: Company[],
  selectedItem: Maybe<SelectedCompanyHierarchy>,
  selectedItemId: Maybe<string>
) => {
  const hierarchy = getHierarchy(data, attachHierarchy(data, selectedItemId, [], selectedItem));
  const { hierarchicalCompanies } = hierarchy;

  if (selectedItemId || selectedItem?.type === 'GLOBAL') {
    return getCompaniesOnlyWithChildren(hierarchicalCompanies);
  }

  // for selected region or country we need to find out the "first level companies" for selected item
  // and make the proper hierarchy again
  const parentCompaniesHierarchy = differenceWith(
    hierarchicalCompanies,
    hierarchy.allChildren,
    companiesComparator
  );

  return getCompaniesOnlyWithChildren(getHierarchy(data, parentCompaniesHierarchy).hierarchicalCompanies);
};
