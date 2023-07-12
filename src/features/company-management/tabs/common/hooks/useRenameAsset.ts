import { useCallback } from 'react';
import { ApolloError } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { AssetService } from '@carrier-io/lynx-fleet-data-lib';

import { showError, showMessage } from '@/stores/actions';
import { useAppDispatch } from '@/stores';

type RenameAssetInput = {
  id: string;
  name: string;
};

export const useRenameAsset = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const onCompleted = useCallback(() => {
    showMessage(dispatch, t('company.management.asset-renamed'));
  }, [dispatch, t]);

  const onError = useCallback(
    (e: ApolloError) => {
      showError(dispatch, t('company.management.asset-name-modify-error'));

      // eslint-disable-next-line no-console
      console.error(e.message);
    },
    [dispatch, t]
  );

  const [updateAssetMutation] = AssetService.useRenameAsset({
    onCompleted,
    onError,
  });

  const renameAsset = useCallback(
    (input: RenameAssetInput) => {
      updateAssetMutation({
        variables: {
          input,
        },
        update(cache) {
          cache.modify({
            id: cache.identify({
              __typename: 'AssetPopulated',
              id: input.id,
            }),
            fields: {
              name() {
                return input.name;
              },
            },
          });
        },
      });
    },
    [updateAssetMutation]
  );

  return { renameAsset };
};
