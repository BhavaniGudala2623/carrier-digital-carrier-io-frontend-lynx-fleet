import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { CreateGroupPayloadType } from '@carrier-io/lynx-fleet-types';
import { CompanyService } from '@carrier-io/lynx-fleet-data-lib';

import { useAppDispatch, useAppSelector } from '@/stores';
import { showError, showMessage } from '@/stores/actions';
import { fetchUserData, getAuthUserEmail } from '@/features/authentication';

export const useCreateUserGroup = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const authUserEmail = useAppSelector(getAuthUserEmail);

  const [createUserGroup, { loading: isCreateUserGroupLoading, data }] = CompanyService.useCreateUserGroup();

  useEffect(() => {
    if (data?.createGroup) {
      const { errors } = data.createGroup;

      if (errors && errors.length > 0) {
        showError(dispatch, errors[0]);
      }
    }
  }, [dispatch, data?.createGroup, t]);

  const handleSubmit = useCallback(
    async (values: CreateGroupPayloadType) => {
      try {
        const { data: result } = await createUserGroup({
          variables: {
            input: {
              ...values,
            },
          },
        });

        if (result?.createGroup) {
          const { errors } = result.createGroup;

          if (errors && errors.length > 0) {
            showError(dispatch, errors[0]);
          } else {
            showMessage(dispatch, t('user.management.group.added'));

            if (values.users.find(({ userIds }) => userIds.includes(authUserEmail))) {
              dispatch(fetchUserData(authUserEmail));
            }
          }
        }
      } catch (error) {
        showError(dispatch, t('user.management.add.group.error'));
        // eslint-disable-next-line no-console
        console.error('error', error);
      }
    },
    [authUserEmail, createUserGroup, dispatch, t]
  );

  return {
    handleSubmit,
    isCreateUserGroupLoading,
  };
};
