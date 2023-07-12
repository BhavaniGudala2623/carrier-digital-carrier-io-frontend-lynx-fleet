import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { SvgIconProps, Typography } from '@carrier-io/fds-react';
import Box from '@carrier-io/fds-react/Box';
import { TFunction } from 'i18next';

import { ElectricAssetParams } from '../../../../types';
import { BATTERY_STATUS_NO_DATA, BATTERY_STATUS_NO_POWER } from '../../../../constants';

import {
  BatteryErrorNoPowerIcon,
  BatteryPercent0AlertIcon,
  BatteryPercent100FullIcon,
  BatteryPercent1To19Icon,
  BatteryPercent20To49Icon,
  BatteryPercent50To69Icon,
  BatteryPercent70To79Icon,
  BatteryPercent80To99Icon,
  BatteryUnknownNoDataIcon,
} from '@/components/icons';

function getStateOfChargeLabelAndIcon(
  stateOfCharge: number | string | undefined,
  t: TFunction
): [string, FC<SvgIconProps>] | null {
  const stateOfChargeNumber = Math.floor(Number(stateOfCharge));

  switch (true) {
    case stateOfCharge === BATTERY_STATUS_NO_POWER:
      return [t('battery.management.battery.status.no-power'), BatteryErrorNoPowerIcon];

    case stateOfCharge === BATTERY_STATUS_NO_DATA ||
      Number.isNaN(stateOfCharge) ||
      stateOfCharge === null ||
      stateOfCharge === undefined: {
      return [t('battery.management.battery.status.no-data'), BatteryUnknownNoDataIcon];
    }

    case stateOfChargeNumber >= 100:
      return [`${100}%`, BatteryPercent100FullIcon];

    case stateOfChargeNumber <= 0:
      return [`${stateOfChargeNumber}%`, BatteryPercent0AlertIcon];

    case stateOfChargeNumber >= 1 && stateOfChargeNumber <= 19:
      return [`${stateOfChargeNumber}%`, BatteryPercent1To19Icon];

    case stateOfChargeNumber >= 20 && stateOfChargeNumber <= 49:
      return [`${stateOfChargeNumber}%`, BatteryPercent20To49Icon];

    case stateOfChargeNumber >= 50 && stateOfChargeNumber <= 69:
      return [`${stateOfChargeNumber}%`, BatteryPercent50To69Icon];

    case stateOfChargeNumber >= 70 && stateOfChargeNumber <= 79:
      return [`${stateOfChargeNumber}%`, BatteryPercent70To79Icon];

    case stateOfChargeNumber >= 80 && stateOfChargeNumber <= 99:
      return [`${stateOfChargeNumber}%`, BatteryPercent80To99Icon];

    default:
      return [t('battery.management.battery.status.no-data'), BatteryUnknownNoDataIcon];
  }
}

export const StateOfChargeRenderer = ({ data }: ElectricAssetParams) => {
  const { t } = useTranslation();
  if (!data) {
    return null;
  }
  const stateOfCharge = data?.battery?.stateOfCharge;

  const labelAndIcon = getStateOfChargeLabelAndIcon(stateOfCharge, t);

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
