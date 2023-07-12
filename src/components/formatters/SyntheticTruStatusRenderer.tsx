import { CompartmentConfig, EventHistoryRec, FlespiData, Maybe } from '@carrier-io/lynx-fleet-types';
import { useTranslation } from 'react-i18next';

import { at52TruStatusRenderer } from './at52TruStatusRenderer';
import { assetChipRenderer } from './assetChipRenderer';

import { useApplicationContext } from '@/providers/ApplicationContext';

interface SyntheticTruStatusRendererProps {
  flespiData: Maybe<FlespiData | EventHistoryRec> | undefined;
  table: 'eventHistory' | 'assets' | 'assetHistory';
  compartmentConfig: Maybe<CompartmentConfig>;
}

export const SyntheticTruStatusRenderer = ({
  flespiData,
  table,
  compartmentConfig,
}: SyntheticTruStatusRendererProps): JSX.Element | null => {
  const { featureFlags } = useApplicationContext();
  const isFeatureCompartmentOnOffModeEnabled = featureFlags.REACT_APP_FEATURE_COMPARTMENT_ON_OFF_MODE;
  const { t } = useTranslation();

  if (!flespiData) {
    return null;
  }

  const {
    freezer_control_mode: freezerControlMode,
    freezer_trs_comp1_power_status: freezerTrsComp1PowerStatus,
    freezer_trs_comp2_power_status: freezerTrsComp2PowerStatus,
    freezer_trs_comp3_power_status: freezerTrsComp3PowerStatus,
    synthetic_tru_status: syntheticTruStatus,
  } = flespiData;

  if (
    freezerControlMode === 'AT52' &&
    (!isFeatureCompartmentOnOffModeEnabled ||
      (isFeatureCompartmentOnOffModeEnabled && table !== 'eventHistory'))
  ) {
    return at52TruStatusRenderer({
      data: {
        freezerTrsComp1PowerStatus,
        freezerTrsComp2PowerStatus,
        freezerTrsComp3PowerStatus,
        syntheticTruStatus,
      },
      compartmentConfig,
      featureFlags,
      t,
    });
  }

  return assetChipRenderer('flespiData.synthetic_tru_status', syntheticTruStatus, t);
};
