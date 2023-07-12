import { createSlice, PayloadAction, SliceCaseReducers } from '@reduxjs/toolkit';

import { CompanyManagementGridTab, ISearchStatistics } from '../types';

import { CompanyManagementState } from './types';

// can be split to separate slices but the question is to how to combine them properly
// feel free to change structure
const companyManagementInitialState: CompanyManagementState = {
  selectedGridTab: 'COMPANIES',
  searchText: '',
  selectedSplitButtonIndex: null,
  selectedTableCompaniesIds: [],
  searchStatistics: {
    COMPANIES: { value: 0, loading: false, display: true },
    PARENTS: { value: 0, loading: false, display: true },
    ASSETS: { value: 0, loading: false, display: true },
    FLEETS: { value: 0, loading: false, display: true },
    USERS: { value: 0, loading: false, display: true },
    GROUPS: { value: 0, loading: false, display: true },
  },
};

export const companyManagementSlice = createSlice<
  CompanyManagementState,
  SliceCaseReducers<CompanyManagementState>
>({
  // TODO add slice to AppState
  name: 'companyManagement',
  initialState: companyManagementInitialState,
  reducers: {
    selectTab: (state, action: PayloadAction<CompanyManagementGridTab>) => ({
      ...state,
      selectedGridTab: action.payload,
    }),
    setSearchText: (state, { payload }) => ({
      ...state,
      searchText: payload,
    }),
    setSplitButtonIndex: (state, { payload }) => ({
      ...state,
      selectedSplitButtonIndex: payload,
    }),
    setSelectedTableCompaniesIds: (state, { payload }) => ({
      ...state,
      selectedTableCompaniesIds: payload,
    }),
    setSearchCompaniesCount: (state, { payload }: { payload: ISearchStatistics['COMPANIES'] }) => ({
      ...state,
      searchStatistics: {
        ...state.searchStatistics,
        COMPANIES: {
          value: payload.value,
          loading: payload.loading,
          display: payload.display,
        },
      },
    }),
    setSearchParentsCount: (state, { payload }: { payload: ISearchStatistics['PARENTS'] }) => ({
      ...state,
      searchStatistics: {
        ...state.searchStatistics,
        PARENTS: {
          value: payload.value,
          loading: payload.loading,
          display: payload.display,
        },
      },
    }),
    setSearchAssetsCount: (state, { payload }: { payload: ISearchStatistics['ASSETS'] }) => ({
      ...state,
      searchStatistics: {
        ...state.searchStatistics,
        ASSETS: {
          value: payload.value,
          loading: payload.loading,
          display: payload.display,
        },
      },
    }),
    setSearchFleetsCount: (state, { payload }: { payload: ISearchStatistics['FLEETS'] }) => ({
      ...state,
      searchStatistics: {
        ...state.searchStatistics,
        FLEETS: {
          value: payload.value,
          loading: payload.loading,
          display: payload.display,
        },
      },
    }),
    setSearchUsersCount: (state, { payload }: { payload: ISearchStatistics['USERS'] }) => ({
      ...state,
      searchStatistics: {
        ...state.searchStatistics,
        USERS: {
          value: payload.value,
          loading: payload.loading,
          display: payload.display,
        },
      },
    }),
    setSearchGroupsCount: (state, { payload }: { payload: ISearchStatistics['GROUPS'] }) => ({
      ...state,
      searchStatistics: {
        ...state.searchStatistics,
        GROUPS: {
          value: payload.value,
          loading: payload.loading,
          display: payload.display,
        },
      },
    }),
  },
});
