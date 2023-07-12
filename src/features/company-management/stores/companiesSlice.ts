import { createAsyncThunk, createSlice, PayloadAction, SliceCaseReducers } from '@reduxjs/toolkit';
import { Tenant } from '@carrier-io/lynx-fleet-types';
import { CompanyService } from '@carrier-io/lynx-fleet-data-lib';

import { CompaniesState } from '../types/store';

export const fetchCompanies = createAsyncThunk('companies/fetchCompanies', async () => {
  const response = await CompanyService.getTenants();

  return response.data.getTenants;
});

export const companiesSlice = createSlice<CompaniesState, SliceCaseReducers<CompaniesState>>({
  name: 'companies',
  initialState: {
    pending: false,
    selectedCompanyIds: [],
    allCompanies: [],
  },
  reducers: {
    setSelectedCompanyIds: (state: CompaniesState, action: PayloadAction<string[]>) => {
      state.selectedCompanyIds = [...action.payload];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCompanies.fulfilled, (state: CompaniesState, action: PayloadAction<Tenant[]>) => {
      state.pending = false;
      state.allCompanies = [...action.payload];
    });
    builder.addCase(fetchCompanies.pending, (state: CompaniesState) => {
      state.pending = true;
    });
    builder.addCase(fetchCompanies.rejected, (state: CompaniesState) => {
      state.pending = false;
    });
  },
});
