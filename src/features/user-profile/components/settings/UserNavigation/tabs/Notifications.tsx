import { ChangeEvent, FC } from 'react';
import Typography from '@carrier-io/fds-react/Typography';
import Box from '@carrier-io/fds-react/Box';
import { useTranslation } from 'react-i18next';
import Switch from '@carrier-io/fds-react/Switch';

import { Loader } from '@/components';
import { useUserSettings } from '@/providers/UserSettings';

export const Notifications: FC = () => {
  const { t } = useTranslation();
  const { userSettings, onUserSettingsChange, loading } = useUserSettings();
  const { notificationEnabled } = userSettings;

  if (loading) {
    return <Loader />;
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
      <Typography>{t('common.email')}</Typography>
      <Switch
        name="notificationEnabled"
        size="small"
        checked={notificationEnabled}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          onUserSettingsChange('notificationEnabled', event.target.checked);
        }}
      />
    </Box>
  );
};
