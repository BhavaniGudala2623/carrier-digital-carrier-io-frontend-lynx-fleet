import { useTheme } from '@carrier-io/fds-react/styles';
import { History } from '@mui/icons-material';
import { capitalize } from 'lodash-es';
import { useTranslation } from 'react-i18next';

import { useUserSettings } from '@/providers/UserSettings';
import { dateTimeFormatter } from '@/components';

interface AssetLastUpdatedProps {
  timestamp: string | number;
}

export const AssetLastUpdated = ({ timestamp }: AssetLastUpdatedProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { userSettings } = useUserSettings();
  const { timezone, dateFormat } = userSettings;

  const lastUpdatedDate = dateTimeFormatter(timestamp, {
    dateFormat,
    timestampFormat: 'seconds',
    timezone,
  });

  return (
    <>
      <History
        sx={{
          color: theme.palette.text.secondary,
          fontSize: '1rem',
          mr: 0.5,
        }}
      />{' '}
      {capitalize(t('common.updated'))} {lastUpdatedDate}
    </>
  );
};
