import { useTranslation } from 'react-i18next';
import { Tooltip, Typography } from '@carrier-io/fds-react';

import { BatteryNotificationsColumnDataType, BatteryNotificationsColumns } from '../../../../types';
import { getNotificationsDetails } from '../../../../utils';

export const DetailsRenderer = ({ data, ...rest }: { data: BatteryNotificationsColumnDataType }) => {
  const { t } = useTranslation();
  if (!data) {
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const params = rest as any;
  const { text } = getNotificationsDetails(
    data.notification,
    t,
    BatteryNotificationsColumns.DETAILS,
    params?.temperatureUnits
  );

  return (
    <Tooltip title={text}>
      <Typography variant="body2" sx={{ overflow: 'hidden' }}>
        {text}
      </Typography>
    </Tooltip>
  );
};
