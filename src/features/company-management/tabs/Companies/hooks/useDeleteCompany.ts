import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { CompanyService, userClient } from '@carrier-io/lynx-fleet-data-lib';

import { showError, showMessage } from '@/stores/actions';
import { useAppDispatch } from '@/stores';
import { getErrorMessage } from '@/utils/getErrorMessage';

export const useDeleteCompany = (onClose: () => void) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const [deleteCompany, { loading: isDeleteCompanyLoading }] = CompanyService.useDeleteCompany();

  const refetchCompanies = useCallback(async () => {
    try {
      await userClient.refetchQueries({
        include: [CompanyService.GET_SUB_TENANTS_FOR_TENANT],
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Refetch companies', error);
    }
  }, []);

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        await deleteCompany({
          variables: { id },
        });

        onClose();
        await refetchCompanies();
        showMessage(dispatch, t('company.management.deleted'));
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Unable to delete a company: ', getErrorMessage(error));

        showError(dispatch, t('company.management.delete-company-error'));
      }
    },
    [deleteCompany, dispatch, onClose, refetchCompanies, t]
  );

  return {
    handleDelete,
    isDeleteCompanyLoading,
  };
};
