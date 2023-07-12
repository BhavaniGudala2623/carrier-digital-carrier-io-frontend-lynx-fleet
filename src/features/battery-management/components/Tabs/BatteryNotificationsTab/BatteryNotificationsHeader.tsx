import { useTranslation } from 'react-i18next';
import { CircularProgress, Typography } from '@carrier-io/fds-react';
import Box from '@carrier-io/fds-react/Box';

export interface BatteryNotificationsHeaderHeaderProps {
  totalItems: number;
  totalItemsLoading: boolean;
}
export function BatteryNotificationsHeader({
  totalItems,
  totalItemsLoading,
}: BatteryNotificationsHeaderHeaderProps) {
  const { t } = useTranslation();

  return totalItemsLoading ? (
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Typography variant="body1" color="text.secondary">
        {t('battery.management.battery.total-devices-loading')}
      </Typography>
      <CircularProgress sx={{ ml: 1 }} size={16} />
    </Box>
  ) : (
    <Typography variant="body1" color="text.secondary">
      {t('battery.management.battery.total-devices', { count: totalItems })}
    </Typography>
  );
}
