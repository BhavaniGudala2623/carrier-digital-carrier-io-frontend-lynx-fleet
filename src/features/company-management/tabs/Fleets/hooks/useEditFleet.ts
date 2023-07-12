import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { EditFleetArgs } from '@carrier-io/lynx-fleet-types';
import { FleetService, userClient } from '@carrier-io/lynx-fleet-data-lib';

import { showError, showMessage } from '@/stores/actions';
import { useAppDispatch } from '@/stores';

export const useEditFleet = (onClose: () => void) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const [editFleet, { loading: isEditFleetLoading }] = FleetService.useEditFleet({
    update: (cache, result, { variables }) => {
      if (variables?.fleet.id) {
        cache.modify({
          id: cache.identify({
            __typename: 'Fleet',
            id: variables?.fleet.id,
          }),
          fields: {
            name() {
              return variables?.fleet.name;
            },
            updatedAt() {
              return result.data?.editFleet.fleet.updatedAt;
            },
            modifiedBy() {
              return result.data?.editFleet.fleet.modifiedBy;
            },
          },
        });
      }
    },
  });

  const refetchData = useCallback(async () => {
    try {
      await userClient.refetchQueries({
        include: 'active',
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Refetch data', error);
    }
  }, []);

  const handleEditFleet = useCallback(
    async ({ assetIds, name, id }: EditFleetArgs['fleet']) => {
      try {
        await editFleet({
          variables: {
            fleet: {
              name,
              assetIds,
              id,
            },
          },
        });

        onClose();
        await refetchData();

        showMessage(dispatch, t('company.management.fleet-saved'));
      } catch (error) {
        onClose();
        // eslint-disable-next-line no-console
        console.error('Unable to edit a fleet: ', error instanceof Error && error.message);

        showError(dispatch, t('company.management.edit-fleet-error'));
      }
    },
    [editFleet, onClose, refetchData, dispatch, t]
  );

  return {
    handleEditFleet,
    isEditFleetLoading,
  };
};
