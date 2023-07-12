import { TFunction } from 'i18next';
import { CompartmentConfig, FlespiData, Maybe } from '@carrier-io/lynx-fleet-types';

import { At52TruStatusRendererData } from './at52TruStatusRenderer';

import { translateTruStatus } from '@/utils/translateTruStatus';
import { FeatureFlagType } from '@/config';

interface TruStatusExportFormatterProps {
  flespiData: Maybe<FlespiData> | undefined;
  t: TFunction;
  compartmentConfig: Maybe<CompartmentConfig>;
  featureFlags: Record<FeatureFlagType, boolean>;
}

export const truStatusExportFormatter = ({
  flespiData,
  t,
  featureFlags,
  compartmentConfig,
}: TruStatusExportFormatterProps): string => {
  const freezerControlMode = flespiData?.freezer_control_mode;

  if (freezerControlMode !== 'AT52') {
    return translateTruStatus(t, flespiData?.synthetic_tru_status);
  }

  const at52Data: At52TruStatusRendererData = {
    freezerTrsComp1PowerStatus: flespiData?.freezer_trs_comp1_power_status,
    freezerTrsComp2PowerStatus: flespiData?.freezer_trs_comp2_power_status,
    freezerTrsComp3PowerStatus: flespiData?.freezer_trs_comp3_power_status,
  };

  const compartments: string[] = [];

  for (let i = 1; i <= 3; i += 1) {
    if (
      i !== 1 &&
      featureFlags.REACT_APP_FEATURE_LYNXFLT_7559_COMPARTMENTS_TOGGLE &&
      compartmentConfig &&
      !compartmentConfig?.[`comp${i}Configured`]
    ) {
      continue;
    }

    const powerStatus = at52Data[`freezerTrsComp${i}PowerStatus`];

    if (powerStatus !== undefined && powerStatus !== null) {
      compartments.push(
        `${t('assets.asset.table.tru-status-comp-short')}${i} ${
          powerStatus ? t('asset.data.on') : t('asset.data.off')
        }`
      );
    } else if (powerStatus === null) {
      compartments.push(`${t('assets.asset.table.tru-status-comp-short')}${i} ${t('asset.data.n-a')}`);
    }
  }

  return compartments.join(', ');
};
