import { FreezerControlType } from '@carrier-io/lynx-fleet-types';

export function getTruFuelLevel(data: {
  freezerControlMode: FreezerControlType | undefined | null;
  pluginFuelLevelConfigured?: boolean;
  pluginFuelLevel?: number | string | null;
  freezerFuelLevelConfigured?: boolean;
  freezerFuelLevel?: number | string | null;
  textNotAvailable: string;
}): string {
  const {
    freezerControlMode,
    pluginFuelLevelConfigured,
    pluginFuelLevel,
    freezerFuelLevelConfigured,
    freezerFuelLevel,
    textNotAvailable,
  } = data;

  if (freezerControlMode === 'AT52') {
    return textNotAvailable;
  }

  if (!pluginFuelLevelConfigured && !freezerFuelLevelConfigured) {
    return '-';
  }

  let value = pluginFuelLevelConfigured ? pluginFuelLevel : undefined;

  if (value === undefined && freezerFuelLevelConfigured) {
    value = freezerFuelLevel;
  }

  if (value === null || value === undefined) {
    return '';
  }

  let valueAsNumber: number | undefined;

  if (typeof value === 'string') {
    valueAsNumber = parseFloat(value);
  } else if (typeof value === 'number') {
    valueAsNumber = value;
  }

  if (valueAsNumber === undefined || Number.isNaN(valueAsNumber)) {
    return '';
  }

  if (valueAsNumber > 100) {
    return '';
  }

  return `${Math.round(valueAsNumber)}%`;
}
