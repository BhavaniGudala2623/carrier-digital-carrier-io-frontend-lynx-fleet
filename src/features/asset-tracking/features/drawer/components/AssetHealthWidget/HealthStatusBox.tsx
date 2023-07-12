import { useTranslation } from 'react-i18next';
import Box from '@carrier-io/fds-react/Box';
import Paper from '@carrier-io/fds-react/Paper';
import Typography from '@carrier-io/fds-react/Typography';
import { HealthStatusType, HealthSummary } from '@carrier-io/lynx-fleet-types';

import { squareSelectedSx, squareSx } from '../common';

import { CriticalHealthStatusIcon } from '@/components';

export const HealthStatusBox = ({
  healthStatus,
  selected,
  onSelectHealthStatus,
}: {
  healthStatus: HealthSummary;
  selected: boolean;
  onSelectHealthStatus: (healthStatus: HealthStatusType) => void;
}) => {
  const { t } = useTranslation();

  const titles: Record<HealthStatusType, string> = {
    CRITICAL: t('assets.widgets.alarm.widget.health-status.critical'),
  };

  return (
    <Paper
      key={healthStatus.type}
      sx={selected ? squareSelectedSx : squareSx}
      variant="outlined"
      onClick={() => onSelectHealthStatus(healthStatus.type)}
      data-testid="health-status-critical-widget"
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', flexWrap: 'nowrap' }}>
        <Typography variant="h6" color="primary.dark" data-testid="health-status-critical-widget-counter">
          {healthStatus.assetIds ? healthStatus.assetIds.length : 0}
        </Typography>
        <Box display="flex" alignItems="center">
          <CriticalHealthStatusIcon sx={{ width: 20, height: 20 }} />
          <Typography
            variant="caption"
            color="text.primary"
            sx={{ overflowWrap: 'break-word', ml: 1 }}
            data-testid="health-status-critical-widget-title"
          >
            {titles[healthStatus.type]}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};
