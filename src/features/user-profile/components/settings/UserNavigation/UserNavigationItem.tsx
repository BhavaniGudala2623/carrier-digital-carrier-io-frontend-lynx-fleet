import { FC } from 'react';
import Box from '@carrier-io/fds-react/Box';
import Divider from '@carrier-io/fds-react/Divider';
import Typography from '@carrier-io/fds-react/Typography';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import { PreferencesAdditionalInformation } from './tabs/Preferences/PreferencesAdditionalInformation';

import { Loader } from '@/components';

export interface NavigationItemProps {
  title: string;
  onClick: () => void;
  chip?: JSX.Element;
  chipLoading?: boolean;
  showAdditionalInformation?: boolean;
  testId?: string;
}

export const UserNavigationItem: FC<NavigationItemProps> = ({
  title,
  onClick,
  chip,
  chipLoading = false,
  showAdditionalInformation,
  testId,
}) => (
  <>
    <Box
      onClick={onClick}
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        py: 2,
        px: 0,
        cursor: 'pointer',
      }}
    >
      <Typography variant="body1" sx={{ cursor: 'pointer' }} data-testid={testId}>
        {title}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {chip && <Box sx={{ marginRight: '.375rem' }}>{chipLoading ? <Loader size={20} /> : chip}</Box>}
        <ChevronRightIcon sx={{ cursor: 'pointer', height: '20px', width: '20px', color: 'action.active' }} />
      </Box>
    </Box>
    {showAdditionalInformation && (
      <Box
        sx={{
          marginBottom: 2,
          padding: 3,
          backgroundColor: 'background.description',
          borderRadius: 1,
        }}
      >
        {showAdditionalInformation && <PreferencesAdditionalInformation />}
      </Box>
    )}
    <Divider sx={{ mx: -2 }} />
  </>
);

UserNavigationItem.displayName = 'UserNavigationItem';
