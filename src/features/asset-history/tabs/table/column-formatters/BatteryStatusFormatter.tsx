import { TFunction } from 'i18next';
import Chip, { ChipProps } from '@carrier-io/fds-react/Chip';

import { ParamsProps } from '../types';

const batteryStatusLables = {
  Disconnected: 'assets.battery.status.disconnected',
  Danger: 'assets.battery.status.danger',
  Low: 'assets.battery.status.low',
  Ok: 'assets.battery.status.ok',
};

const batteryStatusClasses = {
  Disconnected: 'secondary',
  Danger: 'error',
  Low: 'warning',
  Ok: 'primary',
};

export function BatteryStatusFormatter(params: ParamsProps, t: TFunction) {
  const { value } = params;

  if (value === null || value === undefined) {
    return <span />;
  }

  const labelColor = (batteryStatusClasses[value] || 'primary') as ChipProps['color'];

  return <Chip color={labelColor} lightBackground size="small" label={t(batteryStatusLables[value] || '')} />;
}
