import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { AssetService, FleetService, CompanyService, userClient } from '@carrier-io/lynx-fleet-data-lib';

import { showError, showMessage } from '@/stores/actions';
import { useAppDispatch } from '@/stores';

export const useRemoveAssetFromFleet = (onClose: () => void) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const refetchData = useCallback(async () => {
    try {
      await userClient.refetchQueries({
        include: [AssetService.GET_ASSETS, CompanyService.GET_SUB_TENANTS_FOR_TENANT],
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Refetch queries error: ', error);
    }
  }, []);

  const [removeAssetFromFleet, { loading: isRemovingAssetFromFleet }] =
    FleetService.useRemoveAssetFromFleet();

  const handleRemoveAssetFromFleet = useCallback(
    async ({ fleetId, assetId }) => {
      onClose();

      try {
        await removeAssetFromFleet({
          variables: {
            input: {
              fleetId,
              assetId,
            },
          },
        });

        await refetchData();

        showMessage(dispatch, t('company.management.fleet-asset-removed'));
      } catch (error) {
        onClose();
        // eslint-disable-next-line no-console
        console.error('Error removeAssetFromFleet: ', error);

        showError(dispatch, t('company.management.fleet-asset-remove-error'));
      }
    },
    [onClose, removeAssetFromFleet, refetchData, dispatch, t]
  );

  return {
    handleRemoveAssetFromFleet,
    isRemovingAssetFromFleet,
  };
};
