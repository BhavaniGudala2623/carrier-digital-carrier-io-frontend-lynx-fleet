import { ApolloError } from '@apollo/client';
import { MainService } from '@carrier-io/lynx-fleet-data-lib';

import { showError } from '@/stores/actions';
import { useAppDispatch } from '@/stores';

export const useGetUserTenants = () => {
  const dispatch = useAppDispatch();

  const { data, loading } = MainService.useGetUserTenants({
    onError: (error: ApolloError) => showError(dispatch, error),
  });

  if (!data) {
    return { loading, tenants: [] };
  }

  const { getUserAccessibleTenants } = data;

  if (getUserAccessibleTenants.error) {
    showError(dispatch, getUserAccessibleTenants.error);
  }

  return { loading, tenants: getUserAccessibleTenants.docs ?? [] };
};
