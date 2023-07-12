import { TemperatureType } from '@carrier-io/lynx-fleet-types';

import { BATTERY_STATUS_NO_DATA, BATTERY_STATUS_NO_POWER } from '../../../../constants';
import { getMinutesDifferenceTimezoneBased } from '../../../../utils';

import { toUnit } from '@/utils/temperature';

export const getStateOfCharge = (stateOfCharge: number | string | undefined, t): string => {
  const stateOfChargeNumber = Math.floor(Number(stateOfCharge));
  if (stateOfCharge === BATTERY_STATUS_NO_POWER) {
    return t('battery.management.battery.status.no-power');
  }
  if (
    stateOfCharge === BATTERY_STATUS_NO_DATA ||
    Number.isNaN(stateOfCharge) ||
    stateOfCharge === null ||
    stateOfCharge === undefined
  ) {
    return t('battery.management.battery.status.no-data');
  }
  if (stateOfChargeNumber) {
    return `${stateOfChargeNumber > 100 ? 100 : stateOfChargeNumber}%`;
  }

  return t('battery.management.battery.status.no-power');
};

export const getBatteryLastseenLabel = (batteryLastSeen: string, timezone, t): string => {
  const minutesSince = getMinutesDifferenceTimezoneBased(batteryLastSeen, timezone);
  if (!minutesSince) {
    return '';
  }
  if (minutesSince <= 10) {
    return `${minutesSince}${t('battery.management.battery.status.minutes-ago')}`;
  }
  if (minutesSince > 10 && minutesSince < 60) {
    return `${minutesSince}${t('battery.management.battery.status.minutes-ago')}`;
  }
  if (minutesSince >= 60 && minutesSince < 300) {
    return `${Math.round(minutesSince / 60)}${t('battery.management.battery.status.hours-ago')}`;
  }
  if (minutesSince >= 300) {
    return `>5${t('battery.management.battery.status.hours-ago')}`;
  }

  return '';
};

export const formatTemperature = (value: unknown, units: TemperatureType = 'C') => {
  if (units && value !== undefined && value !== null) {
    return toUnit(Number(value), units).toString();
  }

  return '';
};
