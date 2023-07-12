import { TFunction } from 'i18next';
import { Tooltip } from '@carrier-io/fds-react';
import Box from '@carrier-io/fds-react/Box';
import { HealthStatusType } from '@carrier-io/lynx-fleet-types';

import type { SnapshotDataEx } from '@/features/common';
import { CriticalHealthStatusIcon } from '@/components';

interface ParamsProps {
  data?: SnapshotDataEx;
  changedFields?: Set<string>;
}

export const AssetHealthRenderer = (params: ParamsProps, t: TFunction) => {
  const { data } = params;

  if (!data?.activeFreezerAlarms?.length) {
    return null;
  }

  const titles: Record<HealthStatusType, string> = {
    CRITICAL: t('assets.widgets.alarm.widget.health-status.critical'),
  };

  const renderTooltip = (icon: JSX.Element, mode: string) => <Tooltip title={titles[mode]}>{icon}</Tooltip>;

  const hasCriticalAlarm = data?.activeFreezerAlarms?.find((alarm) => alarm?.healthStatus === 'CRITICAL');

  return (
    <Box display="flex" alignItems="center" height="100%">
      {hasCriticalAlarm &&
        renderTooltip(<CriticalHealthStatusIcon sx={{ width: 20, height: 20 }} />, 'CRITICAL')}
    </Box>
  );
};
