import { useTranslation } from 'react-i18next';
import { Tooltip, Typography } from '@carrier-io/fds-react';

import { BatteryNotificationsColumnDataType, BatteryNotificationsColumns } from '../../../../types';
import { getNotificationsDetails } from '../../../../utils';

export const RecommendedStepsRenderer = ({ data, ...rest }: { data: BatteryNotificationsColumnDataType }) => {
  const { t } = useTranslation();
  if (!data) {
    return null;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const params = rest as any;

  const { text } = getNotificationsDetails(
    data.notification,
    t,
    BatteryNotificationsColumns.STEPS,
    params?.temperatureUnits
  );

  return (
    <Tooltip title={text}>
      <Typography variant="body2">{text}</Typography>
    </Tooltip>
  );
};
