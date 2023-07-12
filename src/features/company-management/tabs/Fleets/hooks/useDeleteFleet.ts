import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { AssetService, FleetService, userClient } from '@carrier-io/lynx-fleet-data-lib';
import i18n from 'i18next';

import { showError, showMessage } from '@/stores/actions';
import { useAppDispatch } from '@/stores';
import { AlertColor } from '@/types';
import { useApplicationContext } from '@/providers/ApplicationContext';
import { ALL_COMPANIES } from '@/constants';

export const useDeleteFleet = (onClose: () => void) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const {
    setSelectedCompanyHierarchy,
    applicationState: { selectedCompanyHierarchy },
  } = useApplicationContext();

  const openSnackBar = useCallback(
    (message: string, severity: AlertColor) => {
      if (severity === 'info') {
        showMessage(dispatch, message);
      }

      if (severity === 'error') {
        showError(dispatch, message);
      }
    },
    [dispatch]
  );

  const refetchData = useCallback(async () => {
    try {
      await userClient.refetchQueries({
        include: [AssetService.GET_ASSETS],
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Refetch queries error: ', error);
    }
  }, []);

  const [deleteFleet, { loading: isDeleting }] = FleetService.useDeleteFleet({
    update: (cache, result, { variables }) => {
      if (result.data?.deleteFleet.success && variables?.fleetId) {
        const normalizedId = cache.identify({ id: variables.fleetId, __typename: 'Fleet' });
        cache.evict({ id: normalizedId });
        cache.gc();
      }
    },
  });

  const handleDeleteFleet = useCallback(
    async (fleetId) => {
      try {
        const { data } = await deleteFleet({
          variables: {
            fleetId,
          },
        });

        if (data?.deleteFleet.success) {
          openSnackBar(t('company.management.fleet-deleted'), 'info');
          onClose();

          if (selectedCompanyHierarchy.id === fleetId) {
            setSelectedCompanyHierarchy({
              id: ALL_COMPANIES,
              type: 'ALL',
              name: i18n.t('company.filter.all-companies'),
            });
          }
          await refetchData();
        } else {
          openSnackBar(t('company.management.delete-fleet-error'), 'error');
          // eslint-disable-next-line no-console
          console.error(t('company.management.delete-fleet-error'), data?.deleteFleet?.error);
          onClose();
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(t('company.management.delete-fleet-error'), error instanceof Error && error.message);
        openSnackBar(t('company.management.delete-fleet-error'), 'error');
        onClose();
      }
    },
    [
      deleteFleet,
      openSnackBar,
      t,
      onClose,
      selectedCompanyHierarchy.id,
      refetchData,
      setSelectedCompanyHierarchy,
    ]
  );

  return {
    deleteFleet: handleDeleteFleet,
    isDeleting,
  };
};
