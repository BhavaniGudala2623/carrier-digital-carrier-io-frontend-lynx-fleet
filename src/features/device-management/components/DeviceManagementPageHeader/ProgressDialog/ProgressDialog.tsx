import { Typography } from '@carrier-io/fds-react';
import Box from '@carrier-io/fds-react/Box';
import Button from '@carrier-io/fds-react/Button';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ProgressDialogStep } from './ProgressDialogStep';

import { Dialog, dateTimeFormatter } from '@/components';
import { useUserSettings } from '@/providers/UserSettings';

const details = [
  'device.management.bluetooth-sensors.bulk-import.upload.success',
  'device.management.bluetooth-sensors.bulk-import.upload.fail',
];

interface ProgressDialogProps {
  onClose: () => void;
  onHide: () => void;
}

export const ProgressDialog = ({ onClose, onHide }: ProgressDialogProps) => {
  const { t } = useTranslation();
  const { userSettings } = useUserSettings();
  const { timezone, dateFormat } = userSettings;
  const [isCsvLoaded, setIsCsvLoaded] = useState<boolean>(false);
  const [isZipLoaded] = useState<boolean>(false);
  const [zipTimestamp, setZipTimestamp] = useState<string | null>();

  const detailsTKeys = useMemo(() => (details?.map((key) => t(key)) as string[]) ?? [], [t]);

  useEffect(() => {
    // ! TODO refactor on integration with BE story
    const timer = setTimeout(() => {
      setIsCsvLoaded(true);
      const timeStamp = dateTimeFormatter(Date.now(), {
        dateFormat,
        timezone,
        dateOptions: { variant: 'dateTime' },
      });
      setZipTimestamp(timeStamp || '-');
      clearTimeout(timer);
    }, 3000);
  }, [dateFormat, timezone]);

  const contentHeight = useMemo(() => {
    if (!isCsvLoaded && !isZipLoaded) {
      return 85;
    }

    return 200;
  }, [isCsvLoaded, isZipLoaded]);

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open
      onClose={onClose}
      dialogTitle={t('device.management.bluetooth-sensors.bulk-import.wireless-sensors')}
      contentSx={{ height: contentHeight, overflowY: 'hidden', padding: 0 }}
      content={
        <>
          {!isCsvLoaded && !isZipLoaded && (
            <ProgressDialogStep title={t('device.management.bluetooth-sensors.bulk-import.progress')} />
          )}
          {isCsvLoaded && !isZipLoaded && (
            <>
              <ProgressDialogStep
                isSuccess
                title={t('device.management.bluetooth-sensors.bulk-import.progress.success', {
                  value: 0,
                })}
              />
              <Box>
                <Typography variant="helperText" color="text.secondary">
                  {`${t('common.details')}:`}
                </Typography>
                <Box display="flex" flexDirection="column">
                  {detailsTKeys.map((key) => (
                    <Typography key={key} variant="helperText" color="text.secondary">
                      <Typography variant="helperText" sx={{ ml: 0.5 }}>
                        &#8226;{' '}
                      </Typography>
                      <Typography variant="helperText" sx={{ ml: 0.5 }}>
                        {key}
                      </Typography>
                    </Typography>
                  ))}
                </Box>
              </Box>
              <Typography variant="helperText">{`${t('common.duration')} `}</Typography>
              <ProgressDialogStep title={t('device.management.bluetooth-sensors.bulk-import.progress.zip')} />
              <Typography variant="helperText">{`${t('common.started-at')} ${zipTimestamp}`}</Typography>
            </>
          )}
        </>
      }
      actionsSx={{ mt: 0, mb: 0 }}
      actions={
        <Box width="100%">
          <Box display="flex" justifyContent="flex-end">
            <Button autoFocus onClick={onClose} color="secondary" variant="outlined" sx={{ mr: 1 }}>
              {t('common.cancel')}
            </Button>
            <Button onClick={onHide} type="submit" variant="outlined">
              {t('device.management.bluetooth-sensors.bulk-import.hide-dialog')}
            </Button>
          </Box>
        </Box>
      }
    />
  );
};
