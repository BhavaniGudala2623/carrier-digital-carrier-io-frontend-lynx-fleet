import { Snackbar, Typography } from '@carrier-io/fds-react';
import Box from '@carrier-io/fds-react/Box';
import Button from '@carrier-io/fds-react/Button';
import Paper from '@carrier-io/fds-react/Paper';
import { fleetThemeOptions } from '@carrier-io/fds-react/theme';
import { useTranslation } from 'react-i18next';

import { ProgressSpinner } from './ProgressSpinner';

interface ProgressBarButtonProps {
  onClose: () => void;
}

export const ProgressBarButton = ({ onClose }: ProgressBarButtonProps) => {
  const { t } = useTranslation();

  return (
    <Snackbar anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }} open>
      <Box
        sx={{
          width: '100%',
          height: '100%',
          backgroundColor: 'transparent',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '2px',
          pr: 2,
          pb: 2,
        }}
      >
        <Box sx={{ backgroundColor: fleetThemeOptions.palette.background.paper, borderRadius: '4px' }}>
          <Button onClick={onClose} startIcon={<ProgressSpinner />} variant="outlined">
            {t('device.management.bluetooth-sensors.bulk-import.wireless-sensors')}
          </Button>
        </Box>
        <Paper
          elevation={4}
          sx={{
            width: '100%',
            height: '58px',
            pl: 3,
            pr: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
          }}
        >
          <Typography variant="body2">
            {t('device.management.bluetooth-sensors.bulk-import.in-progress')}
          </Typography>
          <Button onClick={onClose} variant="text" sx={{ height: '20px', p: 0 }}>
            <Typography variant="helperText" color="primary">
              {t('device.management.bluetooth-sensors.bulk-import.show-dialog')}
            </Typography>
          </Button>
        </Paper>
      </Box>
    </Snackbar>
  );
};
