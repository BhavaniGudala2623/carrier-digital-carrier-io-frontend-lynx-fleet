import { CSSProperties } from 'react';
import Tooltip from '@carrier-io/fds-react/Tooltip';
import Box from '@carrier-io/fds-react/Box';
import { TFunction } from 'i18next';

import { MIN_MOVEMENT_SPEED_FOR_STATE_IN_MOTION } from '@/constants';
import { AssetStatusStopIcon, AssetStatusMovingIcon } from '@/components';

export function AssetStatusRenderer({ value }, t: TFunction, rowStyle?: CSSProperties) {
  if (value === null || value === undefined) {
    return <span />;
  }

  if (value < MIN_MOVEMENT_SPEED_FOR_STATE_IN_MOTION) {
    return (
      <Tooltip title={t('asset.status.summary.powered-off-stopped')}>
        <Box display="flex" textAlign="center">
          <AssetStatusStopIcon style={rowStyle} />
        </Box>
      </Tooltip>
    );
  }

  return (
    <Tooltip title={t('assets.asset.table.moving')}>
      <Box display="flex" textAlign="center">
        <AssetStatusMovingIcon style={rowStyle} />
      </Box>
    </Tooltip>
  );
}
