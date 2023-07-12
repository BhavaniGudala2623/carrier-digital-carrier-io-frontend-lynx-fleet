import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { UpdateGroupPayloadType } from '@carrier-io/lynx-fleet-types';
import { CompanyService } from '@carrier-io/lynx-fleet-data-lib';

import { useAppDispatch } from '@/stores';
import { showError, showMessage } from '@/stores/actions';

export const useUpdateUserGroup = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const [updateUserGroup, { loading: isUpdateUserGroupLoading }] = CompanyService.useUpdateUserGroup();

  const handleSubmit = useCallback(
    async (values: UpdateGroupPayloadType) => {
      try {
        const { data: result } = await updateUserGroup({
          variables: {
            input: {
              ...values,
            },
          },
        });

        if (result?.updateGroup) {
          const { errors, group } = result.updateGroup;

          if (errors && errors.length > 0) {
            showError(dispatch, errors[0]);
          } else if (group) {
            showMessage(dispatch, t('user.management.group.updated'));
          }
        }
      } catch (error) {
        showError(dispatch, t('user.management.update.group.error'));
        // eslint-disable-next-line no-console
        console.error('error', error);
      }
    },
    [updateUserGroup, dispatch, t]
  );

  return {
    handleSubmit,
    isUpdateUserGroupLoading,
  };
};
