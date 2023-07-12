import { fleetThemeOptions } from '@carrier-io/fds-react/theme';

import {
  SocWarningIcon,
  CheckCircleIcon,
  PowerPlugIcon,
  BatteryChargingIcon,
  BatteryInUseIcon,
  WarningCircleIcon,
  InactiveIcon,
} from '@/components/icons';

export const CARD_TYPES = ['low', 'normal', 'high'];

export const CARD_RANGES = {
  low: '<20%',
  normal: '20-69%',
  high: '70-100%',
};

export const ICON_MAPPERS = {
  chargingGrid: PowerPlugIcon,
  chargingAxle: BatteryChargingIcon,
  inUse: BatteryInUseIcon,
  inactive: InactiveIcon,
  low: SocWarningIcon,
  normal: WarningCircleIcon,
  high: CheckCircleIcon,
};

export const CAPTION_MAPPER = {
  chargingGrid: 'Charging (grid)',
  chargingAxle: 'Charging (axle)',
  inUse: 'In Use',
  inactive: 'Inactive',
};

export const ICON_COLOR_MAPPER = {
  chargingGrid: fleetThemeOptions.palette.success.dark,
  chargingAxle: fleetThemeOptions.palette.success.dark,
  inUse: fleetThemeOptions.palette.info.dark,
};

export const SOC_WIDGET_QUICK_FILTERS = {
  low: 'lowBattery',
  normal: 'normalBattery',
  high: 'highBattery',
};

export const SOC_DETAILS_ORDER = ['chargingGrid', 'chargingAxle', 'inUse', 'inactive'];
