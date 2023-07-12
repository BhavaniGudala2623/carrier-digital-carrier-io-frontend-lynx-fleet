import { useTranslation } from 'react-i18next';
import Box from '@carrier-io/fds-react/Box';
import { Typography } from '@carrier-io/fds-react';

import { BatteryNotificationsColumnDataType, BatteryNotificationsColumns } from '../../../../types';
import { getNotificationsDetails } from '../../../../utils';

export const NotificationsRenderer = ({ data }: { data: BatteryNotificationsColumnDataType }) => {
  const { t } = useTranslation();

  if (!data) {
    return null;
  }
  const { text, icon: Icon } = getNotificationsDetails(
    data.notification,
    t,
    BatteryNotificationsColumns.TITLE
  );
  if (Icon === null) {
    return null;
  }

  return (
    <Box display="flex" alignItems="center" sx={{ gap: '4px' }}>
      {Icon}
      <Typography variant="body2" sx={{ overflow: 'hidden' }}>
        {text}
      </Typography>
    </Box>
  );
};
