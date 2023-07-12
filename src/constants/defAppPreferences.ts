import { AppPreferences } from '@/types';

export const DEFAULT_TIMEZONE = 'UTC';

export const defAppPreferences: AppPreferences = {
  distance: 'KM',
  language: 'en-US',
  speed: 'KPH',
  temperature: 'C',
  volume: 'L',
  timezone: DEFAULT_TIMEZONE,
};
