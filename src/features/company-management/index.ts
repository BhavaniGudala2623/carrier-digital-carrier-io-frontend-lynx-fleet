import { combineReducers } from '@reduxjs/toolkit';

import { companyManagementSlice } from './stores/slice';

export * from './stores/companiesSlice';
// todo: remove from this feature
export { CompanyDialog } from './components';

export const companyManagementReducer = combineReducers({
  companyManagementRoot: companyManagementSlice.reducer,
});
