import Box from '@carrier-io/fds-react/Box';
import { Typography } from '@carrier-io/fds-react';
import { fleetThemeOptions } from '@carrier-io/fds-react/theme';
import { useTranslation } from 'react-i18next';

import { batteryNotificationsNoIssueStyles } from './styles';

import { BatteryOnlineIcon } from '@/components';

export const BaterryNotificationNoIssues = () => {
  const classes = batteryNotificationsNoIssueStyles();
  const { t } = useTranslation();

  return (
    <Box className={classes.root}>
      <BatteryOnlineIcon width={48} height={48} />
      <Typography variant="body1" color={fleetThemeOptions.palette.action.active}>
        {t('battery.management.battery.notifications.no-issues-found')}
      </Typography>
    </Box>
  );
};
