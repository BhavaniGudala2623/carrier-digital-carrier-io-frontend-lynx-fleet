import Box from '@carrier-io/fds-react/Box';
import { Check, Close } from '@mui/icons-material';
import { isNil } from 'lodash-es';

import { CompaniesTableParams } from '../../tabs';

export const HasParentRenderer = ({ data }: CompaniesTableParams) => {
  const parentId = data?.parentId;

  if (isNil(data)) {
    return null;
  }

  return (
    <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {parentId ? <Check /> : <Close />}
    </Box>
  );
};
