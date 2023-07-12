import { TFunction } from 'i18next';
import { CompartmentConfig, Maybe, TruStatusType } from '@carrier-io/lynx-fleet-types';
import Chip from '@carrier-io/fds-react/Chip';
import Grid from '@carrier-io/fds-react/Grid';

import { FeatureFlagType } from '../../config';

export interface At52TruStatusRendererData {
  freezerTrsComp1PowerStatus?: Maybe<boolean>;
  freezerTrsComp2PowerStatus?: Maybe<boolean>;
  freezerTrsComp3PowerStatus?: Maybe<boolean>;
  syntheticTruStatus?: Maybe<TruStatusType | string>;
}

interface At52TruStatusRendererProps {
  data: At52TruStatusRendererData;
  compartmentConfig: Maybe<CompartmentConfig>;
  featureFlags: Record<FeatureFlagType, boolean>;
  t: TFunction;
}

export const at52TruStatusRenderer = ({
  data,
  compartmentConfig,
  featureFlags,
  t,
}: At52TruStatusRendererProps): JSX.Element => {
  const chips: JSX.Element[] = [];

  for (let i = 1; i <= 3; i += 1) {
    if (
      i !== 1 &&
      featureFlags.REACT_APP_FEATURE_LYNXFLT_7559_COMPARTMENTS_TOGGLE &&
      compartmentConfig &&
      !compartmentConfig?.[`comp${i}Configured`]
    ) {
      continue;
    }

    const powerStatus = data.syntheticTruStatus === 'OFF' ? false : data[`freezerTrsComp${i}PowerStatus`];

    if (powerStatus !== undefined && powerStatus !== null) {
      chips.push(
        <Chip
          color={powerStatus ? 'primary' : 'secondary'}
          label={`${t('assets.asset.table.tru-status-comp-short')}${i} ${
            powerStatus ? t('asset.data.on') : t('asset.data.off')
          }`}
          size="small"
          lightBackground
        />
      );
    } else if (powerStatus === null) {
      chips.push(
        <Chip
          color="secondary"
          label={`${t('assets.asset.table.tru-status-comp-short')}${i} ${t('asset.data.n-a')}`}
          size="small"
          lightBackground
        />
      );
    }
  }

  return chips.length ? (
    <Grid container spacing={0.5}>
      {chips.map((chip, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <Grid item key={`truStatusChip${i}`}>
          {chip}
        </Grid>
      ))}
    </Grid>
  ) : (
    <span />
  );
};
