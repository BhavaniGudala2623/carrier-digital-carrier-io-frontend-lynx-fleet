import Box from '@carrier-io/fds-react/Box';
import Button from '@carrier-io/fds-react/Button';
import Typography from '@carrier-io/fds-react/Typography';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BluetoothService } from '@carrier-io/lynx-fleet-data-lib';

import { SensorCertificateFrame } from './SensorCertificateFrame';

import { Dialog } from '@/components';
import { fetchAndDownload } from '@/utils';

interface ViewCertificateDialogProps {
  macId: string;
  open: boolean;
  onClose: () => void;
}

export const ViewCertificateDialog = ({ macId, open, onClose }: ViewCertificateDialogProps) => {
  const { t } = useTranslation();
  const [certificateUrl, setCertificateUrl] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    BluetoothService.getBluetoothSensorCertificateUrl({
      macId,
    })
      .then((response) => {
        const data = response.data.getBluetoothSensorCertificateUrl;

        if (data.success) {
          setCertificateUrl(data.doc?.url);
        } else {
          setIsError(true);
        }

        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
        setIsError(true);
      });
  }, [macId]);

  const handleDownloadClick = useCallback(() => {
    if (certificateUrl) {
      const fileName = `${macId.replace(/:/g, '')}.pdf`;
      fetchAndDownload(certificateUrl, fileName);
    }
  }, [certificateUrl, macId]);

  const handleCancelClick = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <Dialog
      fullWidth
      maxWidth="md"
      open={open}
      onClose={handleCancelClick}
      dialogTitle={t('device.management.bluetooth-sensors.view-certificate-dialog.title')}
      dialogTitleSx={{ marginBottom: '21px', variant: 'h6' }}
      content={
        <>
          <Typography variant="body1">
            {`${t('device.management.bluetooth-sensors.sensors-table.mac-id')}: ${macId}`}
          </Typography>
          <SensorCertificateFrame certificateUrl={certificateUrl} isLoading={isLoading} isError={isError} />
        </>
      }
      actions={
        <>
          <Box flex={1} style={{ justifySelf: 'left' }} hidden>
            <Button color="primary" variant="text">
              {t('device.management.bluetooth-sensors.view-certificate-dialog.view-sensor-history')}
            </Button>
          </Box>
          <Button color="secondary" variant="outlined" onClick={handleCancelClick}>
            {t('common.cancel')}
          </Button>
          <Button color="primary" variant="outlined" disabled={!certificateUrl} onClick={handleDownloadClick}>
            {t('device.management.bluetooth-sensors.view-certificate-dialog.download')}
          </Button>
        </>
      }
    />
  );
};
