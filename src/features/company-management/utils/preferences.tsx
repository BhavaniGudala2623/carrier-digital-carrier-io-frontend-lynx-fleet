import { preferencesEntity } from '../constants';

import {
  CelsiusIcon,
  FahrenheitIcon,
  KilometerIcon,
  MileIcon,
  KMHIcon,
  MPHIcon,
  LiterIcon,
  GallonIcon,
} from '@/icons/preferences';

export const getPreferenceName = (value: string) => {
  switch (value) {
    case preferencesEntity.temperature.celsius:
      return 'preferences.celsius';
    case preferencesEntity.temperature.fahrenheit:
      return 'preferences.fahrenheit';
    case preferencesEntity.distance.kilometers:
      return 'preferences.kilometers';
    case preferencesEntity.distance.miles:
      return 'preferences.miles';
    case preferencesEntity.volume.litres:
      return 'preferences.litres';
    case preferencesEntity.volume.gallons:
      return 'preferences.gallons';
    // KPH means KMH, it uses here because of difference in old and new design versions
    case preferencesEntity.speed.KPH:
      return 'preferences.kmh';
    case preferencesEntity.speed.MPH:
      return 'preferences.mph';
    default:
      return '';
  }
};

const { temperature, distance, volume, speed } = preferencesEntity;

const optionKilometers = {
  icon: <KilometerIcon />,
  value: distance.kilometers,
};
const optionMiles = {
  icon: <MileIcon />,
  value: distance.miles,
};
const optionCelsius = {
  icon: <CelsiusIcon />,
  value: temperature.celsius,
};
const optionFahrenheit = {
  icon: <FahrenheitIcon />,
  value: temperature.fahrenheit,
};
const optionLitres = {
  icon: <LiterIcon />,
  value: volume.litres,
};
const optionGallons = {
  icon: <GallonIcon />,
  value: volume.gallons,
};
const optionKPH = {
  icon: <KMHIcon />,
  value: speed.KPH,
};
const optionMPH = {
  icon: <MPHIcon />,
  value: speed.MPH,
};

export const temperatureOptions = [optionCelsius, optionFahrenheit];
export const distanceOptions = [optionKilometers, optionMiles];
export const volumeOptions = [optionLitres, optionGallons];
export const speedOptions = [optionKPH, optionMPH];
