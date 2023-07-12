import { useCallback } from 'react';
import { ApolloError } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { AssetService } from '@carrier-io/lynx-fleet-data-lib';

import { showError, showMessage } from '@/stores/actions';
import { useAppDispatch } from '@/stores';

export const useAssignAssetsToTenant = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const onSuccess = useCallback(() => {
    showMessage(dispatch, t('company.management.assets-assigned-to-tenant'));
  }, [dispatch, t]);

  const onError = useCallback(
    (e: ApolloError) => {
      showError(
        dispatch,
        t('company.management.error.assets-assigned-to-tenant', {
          message: e.graphQLErrors[0].message,
          interpolation: { escapeValue: false },
        })
      );

      // eslint-disable-next-line no-console
      console.error(e);
    },
    [dispatch, t]
  );

  const [assignAssetsToTenant, { loading, error }] = AssetService.useAssignAssetsToTenant({
    onCompleted: onSuccess,
    onError,
    update: (cache, _result, options) => {
      if (options.variables) {
        cache.modify({
          id: cache.identify({
            __typename: 'Tenant',
            id: options.variables.input.tenantId,
          }),
          fields: {
            assetCount(value) {
              const assetsLength = options.variables?.input?.assetIds?.length ?? 0;

              return value + assetsLength;
            },
          },
        });
      }
    },
  });

  return { assignAssetsToTenant, loading, error };
};
