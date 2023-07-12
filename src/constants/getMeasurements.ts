import { TFunction } from 'i18next';

import { Measurements } from '@/types/preferences';

export const getMeasurements: (t: TFunction) => Measurements = (t) => ({
  temperature: {
    metric: {
      value: 'C',
      name: t('preferences.measurement.temperature.metric'),
      shortName: t('preferences.measurement.temperature.metric.shortName'),
    },
    imperial: {
      value: 'F',
      name: t('preferences.measurement.temperature.imperial'),
      shortName: t('preferences.measurement.temperature.imperial.shortName'),
    },
  },
  distance: {
    metric: {
      value: 'KM',
      name: t('preferences.measurement.distance.metric'),
      shortName: t('preferences.measurement.distance.metric.shortName'),
    },
    imperial: {
      value: 'MI',
      name: t('preferences.measurement.distance.imperial'),
      shortName: t('preferences.measurement.distance.imperial.shortName'),
    },
  },
  volume: {
    metric: {
      value: 'L',
      name: t('preferences.measurement.volume.metric'),
      shortName: t('preferences.measurement.volume.metric.shortName'),
    },
    imperial: {
      value: 'G',
      name: t('preferences.measurement.volume.imperial'),
      shortName: t('preferences.measurement.volume.imperial.shortName'),
    },
  },
  speed: {
    metric: {
      value: 'KPH',
      name: t('preferences.measurement.speed.metric'),
      shortName: t('preferences.measurement.speed.metric.shortName'),
    },
    imperial: {
      value: 'MPH',
      name: t('preferences.measurement.speed.imperial'),
      shortName: t('preferences.measurement.speed.imperial.shortName'),
    },
  },
});
