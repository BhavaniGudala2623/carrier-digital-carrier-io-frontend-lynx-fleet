import { Typography } from '@carrier-io/fds-react';
import Box from '@carrier-io/fds-react/Box';
import Paper from '@carrier-io/fds-react/Paper';
import { BatteryNotification, TemperatureType } from '@carrier-io/lynx-fleet-types';
import { TFunction } from 'i18next';
import { DateFormatType } from '@carrier-io/lynx-fleet-common';

import { getNotificationsWidgetDetails } from '../../../utils';

import { BatteryNotificationsDetailsBox, batteryNotificationsStyles } from './styles';

import { EmptyIcon, dateTimeFormatter } from '@/components';

interface IBatteryNotificationCard {
  data: BatteryNotification;
  t: TFunction;
  temperature: TemperatureType;
  timezone: string;
  dateFormat: DateFormatType;
}

export const BatteryNotificationCard = ({
  data,
  t,
  temperature,
  timezone,
  dateFormat,
}: IBatteryNotificationCard) => {
  const classes = batteryNotificationsStyles();
  const metadata = getNotificationsWidgetDetails(data, t, temperature);

  if (!metadata) {
    return null;
  }

  const { columns, Icon, iconParams, leftBorderColor } = metadata;
  const { assetName } = data;
  const timestamp = dateTimeFormatter(data?.createdAt, { dateFormat, timezone });

  return (
    <Paper variant="outlined" className={classes.root}>
      <Box className={classes.leftBorder} style={{ borderColor: leftBorderColor }} />
      <Box className={classes.cardBox}>
        <Box className={classes.assetNameCloseIcon}>
          <Typography color="black" variant="caption">
            {assetName}
          </Typography>
          <Box>
            {/* TODO: Integrate close icon (BatteryManagementCloseIcon) */}
            <EmptyIcon width={12} height={12} />
          </Box>
        </Box>
        <Box className={classes.titleBox}>
          <Icon {...iconParams} />
          <Typography color="black" variant="subtitle1">
            {columns[0]}
          </Typography>
        </Box>
        <BatteryNotificationsDetailsBox>
          <Box className={classes.detailsStepsBox}>
            <Typography color="black" variant="caption">
              {columns[1] ? `Details: ${columns[1]}` : ''}
            </Typography>
            <Typography color="black" variant="caption">
              Steps: {columns[2]}
            </Typography>
          </Box>
          <Typography variant="caption" color="secondary" className={classes.timestamp}>
            {timestamp}
          </Typography>
        </BatteryNotificationsDetailsBox>
      </Box>
    </Paper>
  );
};
