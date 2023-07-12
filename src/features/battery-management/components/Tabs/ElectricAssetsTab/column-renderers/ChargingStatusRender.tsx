import { FC } from 'react';
import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { ICellRendererParams } from '@ag-grid-community/core';
import Box from '@carrier-io/fds-react/Box';
import { SvgIconProps, Typography } from '@carrier-io/fds-react';

import {
  BATTERY_STATUS_CHARGING_AXLE,
  BATTERY_STATUS_CHARGING_GRID,
  BATTERY_STATUS_INACTIVE,
  BATTERY_STATUS_IN_USE,
} from '../../../../constants';
import { ElectricAsset } from '../../../../types';

import { BatteryChargingIcon, BatteryInUseIcon, EmptyIcon } from '@/components/icons';

function getChargingStatusLabelAndIcon(
  chargingStatus: string,
  t: TFunction
): [string, FC<SvgIconProps>] | null {
  if (chargingStatus === BATTERY_STATUS_IN_USE) {
    return [t('battery.management.battery.status.in-use'), BatteryInUseIcon];
  }

  if (chargingStatus === BATTERY_STATUS_INACTIVE) {
    return [t('battery.management.battery.status.inactive'), EmptyIcon];
  }

  if (chargingStatus === BATTERY_STATUS_CHARGING_GRID) {
    return [t('battery.management.battery.status.charging-grid'), BatteryChargingIcon];
  }

  if (chargingStatus === BATTERY_STATUS_CHARGING_AXLE) {
    return [t('battery.management.battery.status.charging-axle'), BatteryChargingIcon];
  }

  return null;
}
export const ChargingStatusRenderer = ({ data }: ICellRendererParams<ElectricAsset>) => {
  const { t } = useTranslation();
  const chargingStatus = data?.battery?.chargingStatus ?? undefined;

  if (chargingStatus === undefined) {
    return null;
  }

  const labelAndIcon = getChargingStatusLabelAndIcon(chargingStatus, t);
  if (labelAndIcon === null) {
    return null;
  }

  const [label, Icon] = labelAndIcon;

  return (
    <Box display="flex" alignItems="center" gap="4px">
      <Icon width={24} height={24} />
      <Typography variant="body2" sx={{ overflow: 'hidden' }}>
        {label}
      </Typography>
    </Box>
  );
};
