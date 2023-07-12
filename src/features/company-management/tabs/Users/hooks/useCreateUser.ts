import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { CreateUserInput } from '@carrier-io/lynx-fleet-types';
import { CompanyService, userClient } from '@carrier-io/lynx-fleet-data-lib';

import { showError, showMessage } from '@/stores/actions';
import { useAppDispatch } from '@/stores';

export const useCreateUser = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const [createUser, { loading: isCreateUserLoading, error: createUserError }] = CompanyService.useCreateUser(
    {
      update: (cache, _result, options) => {
        if (options.variables) {
          cache.modify({
            id: cache.identify({
              __typename: 'Tenant',
              id: options.variables.input.tenantId,
            }),
            fields: {
              userCount(value) {
                return value + 1;
              },
            },
          });
        }
      },
    }
  );

  const refetchUsers = async () => {
    try {
      await userClient.refetchQueries({
        include: [CompanyService.GET_USERS],
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Refetch users', error);
    }
  };

  const handleSubmit = useCallback(
    async (values: CreateUserInput) => {
      try {
        await createUser({
          variables: {
            input: {
              ...values,
            },
          },
        });

        showMessage(dispatch, t('user.management.added'));
      } catch (error) {
        showError(dispatch, t('user.management.add.error'));

        // eslint-disable-next-line no-console
        console.error('error', error);
      }
    },
    [createUser, dispatch, t]
  );

  return {
    handleSubmit,
    isCreateUserLoading,
    refetchUsers,
    createUserError,
  };
};
