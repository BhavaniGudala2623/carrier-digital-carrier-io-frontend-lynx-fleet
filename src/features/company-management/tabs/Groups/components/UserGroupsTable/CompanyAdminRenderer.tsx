import { Close } from '@mui/icons-material';
import { isNil } from 'lodash-es';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Box from '@carrier-io/fds-react/Box';
import { useTheme } from '@carrier-io/fds-react/styles';

import { LightGroup, SortedUser } from '../../../common/types';

export const CompanyAdminRenderer = ({ data }: { data: SortedUser | LightGroup }) => {
  const theme = useTheme();

  if (isNil(data)) {
    return null;
  }

  if (data?.type === 'USER') {
    const Icon = data?.isPrimaryContact ? CheckCircleOutlineIcon : Close;

    return (
      <Box display="flex" alignItems="center" height="100%">
        <Icon fontSize="small" htmlColor={theme.palette.action.active} />
      </Box>
    );
  }

  return null;
};
