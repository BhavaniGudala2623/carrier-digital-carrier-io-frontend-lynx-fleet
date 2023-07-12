import { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Divider from '@carrier-io/fds-react/Divider';
import Typography from '@carrier-io/fds-react/Typography';
import Box from '@carrier-io/fds-react/Box';
import { fleetThemeOptions } from '@carrier-io/fds-react/theme';

import { AssetsGroup } from './AssetsGroup';

import { useApplicationContext } from '@/providers/ApplicationContext';

export interface AssetClusterProperties {
  devAlarm: number;
  devStationary: number;
  devMoving: number;
  point_count: number;
  cluster_id?: number;
}

interface AssetsClusterProps {
  properties: AssetClusterProperties;
  onLoad?: () => void;
}

export const AssetsCluster: FC<AssetsClusterProps> = ({ properties, onLoad }) => {
  const { t } = useTranslation();
  const { featureFlags } = useApplicationContext();

  useEffect(() => {
    if (onLoad) {
      onLoad();
    }
  }, [onLoad]);

  return (
    <Box sx={{ width: '11.5rem' }}>
      <Box sx={{ mt: 0.5, display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="caption">{t('assets.asset.table.total-assets')}</Typography>
        <Typography variant="caption">{properties.point_count}</Typography>
      </Box>
      <Divider sx={{ mt: 1, mb: 1, ml: -1, mr: -1 }} />
      <Box sx={{ pl: 0.5 }}>
        <AssetsGroup
          title={
            featureFlags.REACT_APP_FEATURE_HEALTH_STATUS
              ? t('assets.widgets.alarm.widget.health-status.critical')
              : t('assets.asset.table.active-alarms')
          }
          number={properties.devAlarm}
          color={fleetThemeOptions.palette.error.main}
        />
        <AssetsGroup
          title={t('assets.asset.table.stationary')}
          number={properties.devStationary}
          color={fleetThemeOptions.palette.warning.main}
        />
        <AssetsGroup
          title={t('assets.asset.table.moving')}
          number={properties.devMoving}
          color={fleetThemeOptions.palette.success.main}
          last
        />
      </Box>
    </Box>
  );
};
