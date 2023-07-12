import { Tenant } from '@carrier-io/lynx-fleet-types';

export interface CompaniesState {
  pending: boolean;
  allCompanies: Tenant[];
  selectedCompanyIds: string[];
}
