import { Check, Close } from '@mui/icons-material';
import { isNil } from 'lodash-es';

import { UsersTableParams } from '../../Users/types';

export const IsPrimaryRenderer = ({ data }: UsersTableParams) => {
  if (isNil(data)) {
    return null;
  }

  if ('primary' in data) {
    const isPrimary = data?.primary;

    return isPrimary ? <Check /> : <Close />;
  }

  // data has LightGroup type
  return null;
};
