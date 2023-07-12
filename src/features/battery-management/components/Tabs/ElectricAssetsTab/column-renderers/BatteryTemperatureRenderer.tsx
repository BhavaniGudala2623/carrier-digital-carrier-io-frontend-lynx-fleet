import { FC } from 'react';
import { SvgIconProps, Typography } from '@carrier-io/fds-react';
import Box from '@carrier-io/fds-react/Box';
import { TemperatureType } from '@carrier-io/lynx-fleet-types';

import { ElectricAssetParams } from '../../../../types';

import { toUnit } from '@/utils/temperature';
import { BatteryHighTemperatureIcon, BatteryLowTemperatureIcon, EmptyIcon } from '@/components/icons';

function getBatteryTemparatureLabelAndIcon(
  batteryTemperature: number | string
): [number, FC<SvgIconProps>] | null {
  const batteryTemperatureNumber = Number(batteryTemperature);
  if (Number.isNaN(batteryTemperatureNumber)) {
    return null;
  }
  if (batteryTemperatureNumber >= 40) {
    return [batteryTemperatureNumber, BatteryHighTemperatureIcon];
  }
  if (batteryTemperatureNumber < 0) {
    return [batteryTemperatureNumber, BatteryLowTemperatureIcon];
  }

  return [batteryTemperatureNumber, EmptyIcon];
}

function formatTemperature(value: unknown, units: TemperatureType = 'C') {
  if (units && value !== undefined && value !== null) {
    return toUnit(Number(value), units).toString();
  }

  return '';
}

const BatteryTemparatureRenderer = (
  batteryTemperature: number | string | undefined,
  temperatureUnits: TemperatureType = 'C'
) => {
  if (batteryTemperature === undefined) {
    return null;
  }
  const labelAndIcon = getBatteryTemparatureLabelAndIcon(batteryTemperature);
  if (labelAndIcon === null) {
    return null;
  }
  const [label, Icon] = labelAndIcon;

  return (
    <Box display="flex" alignItems="center" gap="4px">
      <Icon width={24} height={24} />
      <Typography variant="body2" sx={{ overflow: 'hidden' }}>
        {formatTemperature(label, temperatureUnits)}°{temperatureUnits}
      </Typography>
    </Box>
  );
};

export const BatteryMaxTemparatureRenderer = ({ data, ...rest }: ElectricAssetParams) => {
  const batteryTemperatureMax = data?.battery?.batteryTemperatureMax ?? undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const params = rest as any;

  return BatteryTemparatureRenderer(batteryTemperatureMax, params?.temperatureUnits);
};

export const BatteryMinTemparatureRenderer = ({ data, ...rest }: ElectricAssetParams) => {
  const batteryTemperatureMin = data?.battery?.batteryTemperatureMin ?? undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const params = rest as any;

  return BatteryTemparatureRenderer(batteryTemperatureMin, params?.temperatureUnits);
};
