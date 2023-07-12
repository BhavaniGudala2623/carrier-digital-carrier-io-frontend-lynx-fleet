import { FC } from 'react';
import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import Box from '@carrier-io/fds-react/Box';
import { SvgIconProps, Typography } from '@carrier-io/fds-react';
import { Maybe } from '@carrier-io/lynx-fleet-types';

import { ElectricAssetParams } from '../../../../types';
import { getMinutesDifferenceTimezoneBased } from '../../../../utils';

import { BatteryOfflineRedIcon, BatteryOfflineYellowIcon, BatteryOnlineIcon } from '@/components/icons';

function getBatteryLastseenLabelAndIcon(
  batteryLastSeen: string,
  t: TFunction,
  timezone?: Maybe<string>
): [string, FC<SvgIconProps>] | null {
  const minutesSince = getMinutesDifferenceTimezoneBased(batteryLastSeen, timezone);
  if (!minutesSince) {
    return null;
  }
  if (minutesSince <= 10) {
    return [`${minutesSince}${t('battery.management.battery.status.minutes-ago')}`, BatteryOnlineIcon];
  }
  if (minutesSince > 10 && minutesSince < 60) {
    return [`${minutesSince}${t('battery.management.battery.status.minutes-ago')}`, BatteryOfflineYellowIcon];
  }
  if (minutesSince >= 60 && minutesSince < 300) {
    return [
      `${Math.round(minutesSince / 60)}${t('battery.management.battery.status.hours-ago')}`,
      BatteryOfflineRedIcon,
    ];
  }
  if (minutesSince >= 300) {
    return [`>5${t('battery.management.battery.status.hours-ago')}`, BatteryOfflineRedIcon];
  }

  return null;
}

export const BatteryLastSeenRenderer = ({ data, ...rest }: ElectricAssetParams) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const params = rest as any;

  const { t } = useTranslation();
  const batteryLastSeen = data?.battery?.batteryLastSeen ?? undefined;

  if (batteryLastSeen === undefined) {
    return null;
  }
  const labelAndIcon = getBatteryLastseenLabelAndIcon(batteryLastSeen, t, params?.timezone);
  if (labelAndIcon === null) {
    return null;
  }
  const [label, Icon] = labelAndIcon;

  return (
    <Box display="flex" alignItems="center" gap="4px">
      <Icon />
      <Typography variant="body2" sx={{ overflow: 'hidden' }}>
        {label}
      </Typography>
    </Box>
  );
};
