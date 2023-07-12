import { useTranslation } from 'react-i18next';
import { Typography } from '@carrier-io/fds-react';
import { TFunction } from 'i18next';
import { BluetoothSensorLocationType } from '@carrier-io/lynx-fleet-types';

import { WirelessSensorsTableParams } from '../../../types';

const getLocationLabel = (location: BluetoothSensorLocationType, t: TFunction) => {
  if (location === 'NONE') {
    return '';
  }
  const compartmentNumber = location.slice(-1);
  const compartment = t(`asset.compartment${compartmentNumber}`);

  return `${location.slice(0, 3)} ${compartment}`;
};

export const SensorLocationRenderer = ({ data }: WirelessSensorsTableParams) => {
  const { t } = useTranslation();
  const location = data?.sensorLocation;
  if (!location) {
    return '-';
  }
  const label = getLocationLabel(location, t);

  return (
    <Typography variant="body1" component="span">
      {label}
    </Typography>
  );
};
