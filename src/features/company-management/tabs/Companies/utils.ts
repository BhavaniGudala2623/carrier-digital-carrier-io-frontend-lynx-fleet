import { Company } from '@carrier-io/lynx-fleet-types';

import { SelectedCompanyHierarchy } from '@/providers/ApplicationContext';

export const filterRows = (data: Company[], selectedItem: SelectedCompanyHierarchy): Company[] => {
  if (selectedItem.id && data) {
    if (selectedItem.type === 'REGION') {
      return data.filter(({ contactInfo }) => contactInfo?.region === selectedItem.id);
    }

    if (selectedItem.type === 'COUNTRY') {
      return data.filter(({ contactInfo }) => contactInfo?.country === selectedItem.id);
    }
  }

  return data;
};

export const getCompaniesParentSet = (companies: Company[]): Set<string> =>
  companies.reduce((prev, curr) => {
    if (curr.parentId && !prev.has(curr.parentId)) {
      prev.add(curr.parentId);
    }

    return prev;
  }, new Set<string>());

export const getCompanyAdminFullName = (contactInfo: Company['contactInfo']) =>
  contactInfo?.name || contactInfo?.lastName
    ? `${contactInfo?.name || ''} ${contactInfo?.lastName || ''}`.trim()
    : null;
