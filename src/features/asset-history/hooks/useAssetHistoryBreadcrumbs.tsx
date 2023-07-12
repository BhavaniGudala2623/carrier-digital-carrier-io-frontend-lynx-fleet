import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { PartialAsset } from '../types';
import { AssetSelectWrapper } from '../components/AssetSelectWrapper';

import { BreadcrumbsLink } from '@/components/Breadcrumbs';
import { useApplicationContext } from '@/providers/ApplicationContext';
import { routes } from '@/routes';

export const useAssetHistoryBreadcrumns = ({
  assets,
  selectedAssetId,
}: {
  assets?: PartialAsset[];
  selectedAssetId?: string;
}) => {
  const { setBreadcrumbsSettings } = useApplicationContext();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleChangeSelectedAsset = useCallback(
    (assetId: string) => {
      if (assetId !== selectedAssetId) {
        navigate(routes.assetHistory.path.replace(':assetId', assetId ?? ''));
      }
    },
    [selectedAssetId, navigate]
  );

  useEffect(() => {
    setBreadcrumbsSettings({
      customActions: [
        <BreadcrumbsLink
          key={routes.assets.path}
          item={{ path: routes.assets.path, title: t(routes.assets.title) }}
          isLastItem={false}
        />,
        <AssetSelectWrapper
          key="asset-item"
          assets={assets}
          selectedAssetId={selectedAssetId}
          onAssetChange={handleChangeSelectedAsset}
        />,
      ],
    });

    return () => setBreadcrumbsSettings({ customActions: null });
  }, [handleChangeSelectedAsset, selectedAssetId, assets, navigate, setBreadcrumbsSettings, t]);
};
