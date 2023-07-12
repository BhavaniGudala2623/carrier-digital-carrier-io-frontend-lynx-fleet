import Typography from '@carrier-io/fds-react/Typography';

import { ParamsProps } from '../../../types';

export const SensorMacIdFormatter = ({ data: { sensorId, macId } }: ParamsProps) => (
  <Typography variant="body1">{macId || sensorId || '-'}</Typography>
);
