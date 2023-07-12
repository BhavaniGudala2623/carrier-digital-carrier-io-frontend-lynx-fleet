import { createAsyncThunk, createSlice, PayloadAction, SliceCaseReducers } from '@reduxjs/toolkit';
import { CompanyService, UserService } from '@carrier-io/lynx-fleet-data-lib';
import i18n from 'i18next';

import { AuthenticationState } from '../types';

import { getErrorMessage } from '@/utils/getErrorMessage';

export const fetchUserData = createAsyncThunk<
  Pick<AuthenticationState, 'user' | 'tenant' | 'tenantsHierarchy'>,
  string
>('auth/fetchUserData', async (email: string, { rejectWithValue }) => {
  try {
    const { errors: userErrors, data: userData } = await UserService.getUserInfo({ email });

    if (userErrors) {
      return rejectWithValue(userErrors[0]?.message ?? userErrors);
    }

    if (!userData?.getUser) {
      return rejectWithValue(i18n.t('auth.error.user-data-is-undefined'));
    }

    const { tenantId } = userData.getUser;

    if (!tenantId) {
      return rejectWithValue(i18n.t('auth.error.user-has-no-tenant-data'));
    }

    const { errors: tenantErrors, data: tenantData } = await CompanyService.getTenantInfo({ id: tenantId });

    if (tenantErrors) {
      return rejectWithValue(tenantErrors[0]?.message ?? tenantErrors);
    }

    if (!tenantData?.getTenantById) {
      return rejectWithValue(i18n.t('auth.error.tenant-data-is-undefined'));
    }

    const { errors: tenantsHierarchyErrors, data: tenantsHierarchyData } =
      await CompanyService.getTenantsHierarchy();

    if (tenantsHierarchyErrors) {
      return rejectWithValue(tenantsHierarchyErrors[0]?.message ?? tenantsHierarchyErrors);
    }

    return {
      user: userData.getUser,
      tenant: tenantData.getTenantById,
      tenantsHierarchy: tenantsHierarchyData.getTenantsHierarchy,
    };
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const authSlice = createSlice<AuthenticationState, SliceCaseReducers<AuthenticationState>>({
  name: 'auth',
  initialState: {
    user: null,
    tenant: null,
    loading: false,
    error: null,
    basicPermissionsLoaded: false,
    tenantsHierarchy: null,
  },
  reducers: {
    setBasicPermissionsLoaded: (state: AuthenticationState, action: PayloadAction<boolean>) => {
      state.basicPermissionsLoaded = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserData.fulfilled, (state, { payload }) => {
      const { user, tenant, tenantsHierarchy } = payload as Pick<
        AuthenticationState,
        'user' | 'tenant' | 'tenantsHierarchy'
      >;

      state.user = user;
      state.tenant = tenant;
      state.tenantsHierarchy = tenantsHierarchy;
      state.loading = false;
      state.error = null;
    });
    builder.addCase(fetchUserData.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });
    builder.addCase(fetchUserData.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
  },
});
