import Typography from '@carrier-io/fds-react/Typography';
import { useTranslation } from 'react-i18next';

import { ParamsProps, SensorsConfigTableProps, SensorVersion } from '../../../types';

type SensorCompatibleFormatterOptionsType = {
  sensorVersion: SensorVersion;
} & Pick<SensorsConfigTableProps, 'isTemperatureSensor1WireBLE'>;

export const SensorCompatibleFormatter = (
  params: ParamsProps,
  options: SensorCompatibleFormatterOptionsType
) => {
  const { t } = useTranslation();
  const {
    data: { dataField, compatibleWithEN12830, idField },
  } = params;
  const { isTemperatureSensor1WireBLE, sensorVersion } = options;
  let value;

  if (sensorVersion === SensorVersion.Datacold) {
    value = t('common.yes').toLocaleUpperCase();
  }

  if (isTemperatureSensor1WireBLE?.(dataField, idField)) {
    value = compatibleWithEN12830 ? t('common.yes').toLocaleUpperCase() : t('common.no').toLocaleUpperCase();
  }

  return <Typography variant="body2">{value ?? '-'}</Typography>;
};
