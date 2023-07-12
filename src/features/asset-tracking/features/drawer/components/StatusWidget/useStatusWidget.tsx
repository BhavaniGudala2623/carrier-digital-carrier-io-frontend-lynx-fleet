import { AssetStatusType } from '@carrier-io/lynx-fleet-types';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useAssetsPageDataContext } from '../../../../providers/AssetsPageDataProvider';

export interface StatusItem {
  id: number;
  title: string;
  val: string;
  type: AssetStatusType;
}

export const useStatusWidget = () => {
  const { filteredStatusSummaries } = useAssetsPageDataContext();
  const { t } = useTranslation();

  return useMemo(() => {
    const poweredOn: StatusItem[] = [
      { id: 1, title: t('asset.status.summary.powered-on'), val: '-', type: 'ASSETS_POWERED_ON' },
      { id: 2, title: t('asset.status.summary.powered-moving'), val: '-', type: 'POWERED_ON_IN_MOTION' },
      {
        id: 3,
        title: t('asset.status.summary.powered-on-stationary'),
        val: '-',
        type: 'POWERED_ON_STATIONARY',
      },
    ];
    const poweredOff: StatusItem[] = [
      { id: 1, title: t('asset.status.summary.powered-off'), val: '-', type: 'ASSETS_POWERED_OFF' },
      { id: 2, title: t('asset.status.summary.powered-moving'), val: '-', type: 'POWERED_OFF_IN_MOTION' },
      {
        id: 3,
        title: t('asset.status.summary.powered-on-stationary'),
        val: '-',
        type: 'POWERED_OFF_STATIONARY',
      },
    ];

    let totalAssets = 0;

    if (filteredStatusSummaries && filteredStatusSummaries.length > 0) {
      const statusMap = filteredStatusSummaries.reduce(
        (map, obj) => ({ ...map, [obj.type]: obj.assetIds }),
        {} as Record<AssetStatusType, string[] | undefined>
      );

      poweredOn[0].val = String(statusMap.ASSETS_POWERED_ON?.length || 0);
      poweredOn[1].val = String(statusMap.POWERED_ON_IN_MOTION?.length || 0);
      poweredOn[2].val = String(statusMap.POWERED_ON_STATIONARY?.length || 0);
      poweredOff[0].val = String(statusMap.ASSETS_POWERED_OFF?.length || 0);
      poweredOff[1].val = String(statusMap.POWERED_OFF_IN_MOTION?.length || 0);
      poweredOff[2].val = String(statusMap.POWERED_OFF_STATIONARY?.length || 0);

      totalAssets = (statusMap.ASSETS_POWERED_ON?.length || 0) + (statusMap.ASSETS_POWERED_OFF?.length || 0);
    }

    return { totalAssets, poweredOff, poweredOn };
  }, [t, filteredStatusSummaries]);
};
