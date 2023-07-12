import { Company } from '@carrier-io/lynx-fleet-types';

export const enum CompanyTreeItemType { // TODO replace from @carrier-io/lynx-fleet-types
  COMPANY = 'COMPANY',
  COUNTRY = 'COUNTRY',
  FLEET = 'FLEET',
  GLOBAL = 'GLOBAL',
  NONE = 'NONE',
  REGION = 'REGION',
}

export type CompanyTreeItem = {
  type: CompanyTreeItemType.COMPANY;
  value: Company;
  children: CompanyTreeItem[];
};
