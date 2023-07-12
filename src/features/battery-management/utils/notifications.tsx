import { TFunction } from 'i18next';
import { yellow } from '@mui/material/colors';
import { BatteryNotification, Maybe, TemperatureType } from '@carrier-io/lynx-fleet-types';
import { SvgIconProps } from '@carrier-io/fds-react';
import { FC } from 'react';
import { fleetThemeOptions } from '@carrier-io/fds-react/theme';

import { BatteryNotificationType, BatteryNotifcationComparsion, BatteryNotificationsColumns } from '../types';

import { getTimeByHours } from './timeSince';

import { toUnit } from '@/utils/temperature';
import {
  LowBatteryLowTemperatureIcon,
  CriticallyLowBatteryIcon,
  BatteryHighTemperatureIcon,
  BatteryLowTemperatureIcon,
  RebalancingOverdueIcon,
  BatteryOfflineRedIcon,
} from '@/components/icons';

function formatTemperature(value: unknown, units: TemperatureType = 'C') {
  if (units && value !== undefined && value !== null) {
    return toUnit(Number(value), units).toString();
  }

  return '';
}

function getRebalancingColorAndDays(
  hours: Maybe<number> | undefined,
  criticality: Maybe<number> | undefined
): null | { days: string; color: string } {
  if (!(hours && typeof hours === 'number')) {
    return null;
  }
  let days: string;
  let color: string = yellow[900];
  if (hours < 192) {
    days = '1'; // Incase of any error in backend - fallback value
  } else if (hours >= 192 && hours < 240) {
    days = '1';
  } else if (hours >= 240 && hours < 326) {
    days = '3';
  } else if (hours >= 326 && hours < 528) {
    days = '7';
  } else if (hours >= 528 && hours < 888) {
    days = '14';
  } else {
    days = '30';
  }

  if (criticality === 1) {
    color = fleetThemeOptions.palette.error.dark;
  }

  return { days, color };
}

interface NotificationReturnType {
  text: string;
  icon: JSX.Element;
}
export const getNotificationsDetails = (
  data: BatteryNotification,
  t: TFunction,
  columnName: BatteryNotificationsColumns,
  temperatureUnits: TemperatureType = 'C'
): NotificationReturnType => {
  const type = data.type?.toLocaleLowerCase();
  const comparison = data.comparison?.toLocaleLowerCase();
  const { criticality, currentValue } = data;
  const upperValue = data.range?.upperValue;
  const batteryChargeLevel = `${data.currentValue}%`;
  const socEventTemperature = ` ${formatTemperature(
    data?.temperature,
    temperatureUnits
  )}°${temperatureUnits}`;
  const batteryEventTemperature = ` ${formatTemperature(
    data?.currentValue,
    temperatureUnits
  )}°${temperatureUnits}`;
  switch (true) {
    case type === BatteryNotificationType.BATTERY_NO_CONNECTIVITY: {
      const time = getTimeByHours(currentValue ?? 0);

      return {
        text: t(`battery.management.notifications.no-connectivity.${columnName}`, {
          time,
          defaultValue: '',
        }),
        icon: <BatteryOfflineRedIcon width={20} height={20} />,
      };
    }

    case type === BatteryNotificationType.BATTERY_REBALANCING: {
      const rowData = getRebalancingColorAndDays(currentValue, criticality);
      if (!rowData) {
        return { text: '', icon: <div /> };
      }

      return {
        text: t(`battery.management.notifications.rebalancing.above-x-days.${columnName}`, {
          days: rowData.days,
          defaultValue: '',
        }),
        icon: <RebalancingOverdueIcon width={20} height={20} fill={yellow[900]} />,
      };
    }

    case type === BatteryNotificationType.STATE_OF_CHARGE &&
      comparison === BatteryNotifcationComparsion.LOW &&
      criticality !== 1:
      return {
        text: t(
          `battery.management.battery.notifications.${type}.${comparison}.temp_alert_not_active.${columnName}`,
          {
            level: batteryChargeLevel,
            temperature: socEventTemperature,
            defaultValue: '',
          }
        ),
        icon: <LowBatteryLowTemperatureIcon width={20} height={20} fill={yellow[900]} />,
      };
    case type === BatteryNotificationType.STATE_OF_CHARGE &&
      comparison === BatteryNotifcationComparsion.LOW &&
      criticality === 1:
      return {
        text: t(
          `battery.management.battery.notifications.${type}.${comparison}.temp_alert_active.${columnName}`,
          {
            level: batteryChargeLevel,
            temperature: socEventTemperature,
            defaultValue: '',
          }
        ),
        icon: <LowBatteryLowTemperatureIcon width={20} height={20} />,
      };
    case type === BatteryNotificationType.STATE_OF_CHARGE &&
      comparison === BatteryNotifcationComparsion.CRTICALLY_LOW:
      return {
        text: t(`battery.management.battery.notifications.${type}.${comparison}.${columnName}`, {
          level: batteryChargeLevel,
          temperature: socEventTemperature,
          defaultValue: '',
        }),
        icon: <CriticallyLowBatteryIcon width={20} height={20} />,
      };
    case type === BatteryNotificationType.BATTERY_TEMPERATURE &&
      comparison === BatteryNotifcationComparsion.ABOVE:
      return {
        text: t(`battery.management.battery.notifications.battery_temp.${comparison}.${columnName}`, {
          level: batteryChargeLevel,
          temperature: batteryEventTemperature,
          defaultValue: '',
        }),
        icon: <BatteryHighTemperatureIcon width={20} height={20} />,
      };
    case type === BatteryNotificationType.BATTERY_TEMPERATURE &&
      comparison === BatteryNotifcationComparsion.ABOVE_OR_BELOW:
      return {
        text: t(
          `battery.management.battery.notifications.battery_temp.${comparison}.temp_value_${upperValue}.${columnName}`,
          { level: batteryChargeLevel, temperature: batteryEventTemperature, defaultValue: '' }
        ),
        icon: <BatteryLowTemperatureIcon width={20} height={20} />,
      };
    case type === BatteryNotificationType.BATTERY_TEMPERATURE &&
      comparison === BatteryNotifcationComparsion.BELOW:
      return {
        text: t(`battery.management.battery.notifications.battery_temp.${comparison}.${columnName}`, {
          level: batteryChargeLevel,
          temperature: batteryEventTemperature,
          defaultValue: '',
        }),
        icon: <BatteryLowTemperatureIcon width={20} height={20} />,
      };
    default:
      return { text: '', icon: <div /> };
  }
};

interface INotificationWidgetDetails {
  columns: string[];
  Icon: FC<SvgIconProps>;
  iconParams: SvgIconProps;
  leftBorderColor: string;
}
export const getNotificationsWidgetDetails = (
  data: BatteryNotification,
  t: TFunction,
  temperatureUnits: TemperatureType = 'C'
): INotificationWidgetDetails | null => {
  const type = data.type?.toLocaleLowerCase();
  const comparison = data.comparison?.toLocaleLowerCase();
  const { criticality, currentValue } = data;
  const upperValue = data.range?.upperValue;
  const batteryChargeLevel = `${data.currentValue}%`;
  const socEventTemperature = ` ${formatTemperature(data.temperature, temperatureUnits)}°${temperatureUnits}`;
  const batteryEventTemperature = ` ${formatTemperature(
    data.currentValue,
    temperatureUnits
  )}°${temperatureUnits}`;
  switch (true) {
    case type === BatteryNotificationType.BATTERY_NO_CONNECTIVITY: {
      const time = getTimeByHours(currentValue ?? 0);

      return {
        columns: Object.values(BatteryNotificationsColumns).map((column) =>
          t(`battery.management.notifications.no-connectivity.${column}`, {
            time,
            defaultValue: '',
          })
        ),
        Icon: BatteryOfflineRedIcon,
        iconParams: { width: 20, height: 20 },
        leftBorderColor: yellow[900],
      };
    }

    case type === BatteryNotificationType.BATTERY_REBALANCING: {
      const rowData = getRebalancingColorAndDays(currentValue, criticality);
      if (!rowData) {
        return null;
      }

      return {
        columns: Object.values(BatteryNotificationsColumns).map((column) =>
          t(`battery.management.notifications.rebalancing.above-x-days.${column}`, {
            days: rowData.days,
            defaultValue: '',
          })
        ),
        Icon: RebalancingOverdueIcon,
        iconParams: { width: 20, height: 20, fill: yellow[900] },
        leftBorderColor: rowData.color,
      };
    }

    case type === BatteryNotificationType.STATE_OF_CHARGE &&
      comparison === BatteryNotifcationComparsion.LOW &&
      criticality !== 1:
      return {
        columns: Object.values(BatteryNotificationsColumns).map((column) =>
          t(
            `battery.management.battery.notifications.${type}.${comparison}.temp_alert_not_active.${column}`,
            {
              level: batteryChargeLevel,
              temperature: socEventTemperature,
              defaultValue: '',
            }
          )
        ),
        Icon: LowBatteryLowTemperatureIcon,
        iconParams: { width: 20, height: 20, fill: yellow[900] },
        leftBorderColor: yellow[900],
      };
    case type === BatteryNotificationType.STATE_OF_CHARGE &&
      comparison === BatteryNotifcationComparsion.LOW &&
      criticality === 1:
      return {
        columns: Object.values(BatteryNotificationsColumns).map((column) =>
          t(`battery.management.battery.notifications.${type}.${comparison}.temp_alert_active.${column}`, {
            level: batteryChargeLevel,
            temperature: socEventTemperature,
            defaultValue: '',
          })
        ),
        Icon: LowBatteryLowTemperatureIcon,
        iconParams: { width: 20, height: 20 },
        leftBorderColor: fleetThemeOptions.palette.error.dark,
      };
    case type === BatteryNotificationType.STATE_OF_CHARGE &&
      comparison === BatteryNotifcationComparsion.CRTICALLY_LOW:
      return {
        columns: Object.values(BatteryNotificationsColumns).map((column) =>
          t(`battery.management.battery.notifications.${type}.${comparison}.${column}`, {
            level: batteryChargeLevel,
            temperature: socEventTemperature,
            defaultValue: '',
          })
        ),
        Icon: CriticallyLowBatteryIcon,
        iconParams: { width: 20, height: 20 },
        leftBorderColor: fleetThemeOptions.palette.error.dark,
      };
    case type === BatteryNotificationType.BATTERY_TEMPERATURE &&
      comparison === BatteryNotifcationComparsion.ABOVE:
      return {
        columns: Object.values(BatteryNotificationsColumns).map((column) =>
          t(`battery.management.battery.notifications.battery_temp.${comparison}.${column}`, {
            level: batteryChargeLevel,
            temperature: batteryEventTemperature,
            defaultValue: '',
          })
        ),
        Icon: BatteryHighTemperatureIcon,
        iconParams: { width: 20, height: 20 },
        leftBorderColor: fleetThemeOptions.palette.error.dark,
      };
    case type === BatteryNotificationType.BATTERY_TEMPERATURE &&
      comparison === BatteryNotifcationComparsion.ABOVE_OR_BELOW:
      return {
        columns: Object.values(BatteryNotificationsColumns).map((column) =>
          t(
            `battery.management.battery.notifications.battery_temp.${comparison}.temp_value_${upperValue}.${column}`,
            { level: batteryChargeLevel, temperature: batteryEventTemperature, defaultValue: '' }
          )
        ),
        Icon: BatteryLowTemperatureIcon,
        iconParams: { width: 20, height: 20 },
        leftBorderColor:
          currentValue !== null && currentValue !== undefined && currentValue > 0 && currentValue < 5
            ? yellow[900]
            : fleetThemeOptions.palette.error.dark,
      };
    case type === BatteryNotificationType.BATTERY_TEMPERATURE &&
      comparison === BatteryNotifcationComparsion.BELOW:
      return {
        columns: Object.values(BatteryNotificationsColumns).map((column) =>
          t(`battery.management.battery.notifications.battery_temp.${comparison}.${column}`, {
            level: batteryChargeLevel,
            temperature: batteryEventTemperature,
            defaultValue: '',
          })
        ),
        Icon: BatteryLowTemperatureIcon,
        iconParams: { width: 20, height: 20 },
        leftBorderColor: fleetThemeOptions.palette.error.dark,
      };
    default:
      return null;
  }
};
