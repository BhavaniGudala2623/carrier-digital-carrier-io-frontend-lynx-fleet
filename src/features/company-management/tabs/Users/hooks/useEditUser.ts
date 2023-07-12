import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { EditUserInput } from '@carrier-io/lynx-fleet-types';
import { CompanyService, userClient } from '@carrier-io/lynx-fleet-data-lib';

import { getEditUserErrorTranslationKey, defaultEditUserErrorTranslationKey } from '../translation.utils';

import { showError, showMessage } from '@/stores/actions';
import { useAppDispatch } from '@/stores';

export const useEditUser = (onSubmit: () => void) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const [editUserRequest, { loading: isEditUserLoading }] = CompanyService.useEditUserV2();

  const refetchUsers = async () => {
    try {
      await userClient.refetchQueries({
        include: [CompanyService.GET_USERS, CompanyService.GET_SUB_TENANTS_FOR_TENANT],
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Refetch users', e);
    }
  };

  const handleSubmit = useCallback(
    async (values: EditUserInput) => {
      try {
        const response = await editUserRequest({
          variables: {
            input: {
              ...values,
              email: values.email.toLowerCase(),
              newEmail: values?.newEmail?.toLowerCase() || undefined,
            },
          },
        });

        const { errors } = response.data?.editUserV2 || {};

        if (errors && errors.length > 0) {
          const error = errors[0];
          showError(dispatch, t(getEditUserErrorTranslationKey(error.type)));
          onSubmit();

          for (const e of errors) {
            // eslint-disable-next-line no-console
            console.error('error', e);
          }

          return;
        }

        onSubmit();

        showMessage(dispatch, t('user.management.user.update-success'));

        await refetchUsers();
      } catch (error) {
        onSubmit();

        showError(dispatch, t(defaultEditUserErrorTranslationKey));

        // eslint-disable-next-line no-console
        console.error('error', error);
      }
    },
    [editUserRequest, dispatch, onSubmit, t]
  );

  return {
    handleSubmit,
    isEditUserLoading,
  };
};
