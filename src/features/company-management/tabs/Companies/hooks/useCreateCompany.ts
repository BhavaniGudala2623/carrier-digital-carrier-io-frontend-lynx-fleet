import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { CompanyService, userClient } from '@carrier-io/lynx-fleet-data-lib';

import { CreateCompanyFormData } from '../../../types';

import { showError, showMessage } from '@/stores/actions';
import { useAppDispatch } from '@/stores';
import { getErrorMessage } from '@/utils/getErrorMessage';

export const useCreateCompany = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const [createCompany, { loading: isCreateCompanyLoading }] = CompanyService.useCreateCompany();

  const refetchCompanies = async () => {
    try {
      await userClient.refetchQueries({
        include: [CompanyService.GET_SUB_TENANTS_FOR_TENANT],
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Refetch companies', error);
    }
  };

  const handleSubmit = useCallback(
    async (input: CreateCompanyFormData) => {
      const values: CreateCompanyFormData = { ...input };

      if (values.tenantId) {
        values.parentId = values.tenantId;
      }

      delete values.tenantId;
      delete values.parentCompany;

      try {
        await createCompany({
          variables: {
            tenant: {
              ...values,
            },
          },
        });

        showMessage(dispatch, t('company.management.added'));
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Unable to create a company: ', getErrorMessage(error));

        showError(dispatch, 'ERROR: Unable to create a company'); // TODO translate

        // eslint-disable-next-line no-console
        console.error('error', error);
      }
    },
    [createCompany, dispatch, t]
  );

  return {
    handleSubmit,
    isCreateCompanyLoading,
    refetchCompanies,
  };
};
