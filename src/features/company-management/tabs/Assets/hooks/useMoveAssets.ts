import { useCallback } from 'react';
import { ApolloError } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { AssetService, userClient } from '@carrier-io/lynx-fleet-data-lib';

import { showError, showMessage } from '@/stores/actions';
import { useAppDispatch } from '@/stores';

export const useMoveAssets = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const onSuccess = useCallback(async () => {
    showMessage(dispatch, t('company.management.assets-moved'));
    // todo: find better way to clear cache
    await userClient.resetStore();
  }, [dispatch, t]);

  const onError = useCallback(
    (e: ApolloError) => {
      showError(dispatch, t('company.management.error.assets-move', { message: e.message }));

      // eslint-disable-next-line no-console
      console.error(e);
    },
    [dispatch, t]
  );

  const [moveAssets, { loading, error }] = AssetService.useMoveAssets({ onCompleted: onSuccess, onError });

  return { moveAssets, loading, error };
};
