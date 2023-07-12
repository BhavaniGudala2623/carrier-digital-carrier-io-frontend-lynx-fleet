import Typography from '@carrier-io/fds-react/Typography';

import { ParamsProps } from '../../../types';

export const SensorFieldFormatter = (params: ParamsProps) => {
  const {
    data: { display },
  } = params;

  return <Typography variant="body2">{display}</Typography>;
};
