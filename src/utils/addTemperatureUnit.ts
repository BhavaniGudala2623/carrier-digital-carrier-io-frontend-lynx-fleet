import { TemperatureType } from '@carrier-io/lynx-fleet-types';

export const addTemperatureUnit = (text: string, unit: TemperatureType): string => `${text} (°${unit})`;
