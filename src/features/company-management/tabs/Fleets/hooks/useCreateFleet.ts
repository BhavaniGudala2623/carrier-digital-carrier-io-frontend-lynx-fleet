import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { GetFleetsByTenantIdGqlResponse, GetFleetsByTenantIdArgs } from '@carrier-io/lynx-fleet-types';
import { AssetService, FleetService, CompanyService, userClient } from '@carrier-io/lynx-fleet-data-lib';

import { CreateFleetState } from '../types';

import { showError, showMessage } from '@/stores/actions';
import { useAppDispatch } from '@/stores';
import { getErrorMessage } from '@/utils/getErrorMessage';
import { useApplicationContext } from '@/providers/ApplicationContext';

export const useCreateFleet = (onClose: () => void) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const {
    applicationState: { selectedCompanyHierarchy },
  } = useApplicationContext();
  const selectedTenantId =
    selectedCompanyHierarchy.type === 'COMPANY' && selectedCompanyHierarchy.id
      ? selectedCompanyHierarchy.id
      : null;

  const [createFleet, { loading: isCreateFleetLoading }] = FleetService.useCreateFleet({
    update: (cache, result) => {
      const data = cache.readQuery<GetFleetsByTenantIdGqlResponse, GetFleetsByTenantIdArgs>({
        query: FleetService.GET_FLEETS_BY_TENANT_ID,
        variables: {
          tenantId: selectedTenantId,
        },
      });
      cache.writeQuery({
        query: FleetService.GET_FLEETS_BY_TENANT_ID,
        variables: {
          tenantId: selectedTenantId,
        },
        data: {
          getFleetsByTenantId: [
            ...(data?.getFleetsByTenantId ?? []),
            {
              fleet: result?.data?.createFleet,
              tenant: {
                id: selectedTenantId,
                name: '',
                parentId: null,
                __typename: 'FleetTenant',
              },
            },
          ],
        },
      });
    },
  });

  const refetchAssets = useCallback(async () => {
    try {
      await userClient.refetchQueries({
        include: [AssetService.GET_ASSETS, CompanyService.GET_SUB_TENANTS_FOR_TENANT],
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Refetch assets', error);
    }
  }, []);

  const handleCreateFleet = useCallback(
    async (values: CreateFleetState) => {
      try {
        const { assetIds, name, tenantId, parentType } = values;

        await createFleet({
          variables: {
            fleet: {
              name,
              assetIds,
              parent: {
                type: parentType,
                id: tenantId,
              },
            },
          },
        });

        onClose();
        await refetchAssets();

        showMessage(dispatch, t('company.management.fleet-created'));
      } catch (error) {
        onClose();
        // eslint-disable-next-line no-console
        console.error('Unable to create a fleet: ', getErrorMessage(error));

        showError(dispatch, 'ERROR: Unable to create a fleet'); // TODO translate
      }
    },
    [createFleet, onClose, refetchAssets, dispatch, t]
  );

  return {
    handleCreateFleet,
    isCreateFleetLoading,
  };
};
