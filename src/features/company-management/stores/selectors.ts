import { AppState } from '@/stores';

export const selectActiveCompanyIds = (state: AppState) => state.companies.selectedCompanyIds;

export const selectAllCompanies = (state: AppState) => state.companies.allCompanies;

export const selectCompanyManagementState = (state: AppState) =>
  state.companyManagement.companyManagementRoot;
