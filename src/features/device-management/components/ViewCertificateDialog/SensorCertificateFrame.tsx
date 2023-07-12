import Box from '@carrier-io/fds-react/Box';
import { useTranslation } from 'react-i18next';

import { ErrorOverlay } from '@/components/ErrorOverlay';
import { Loader } from '@/components/Loader/Loader';

interface SensorCertificateFrameProps {
  certificateUrl?: string;
  isLoading: boolean;
  isError: boolean;
}
export const SensorCertificateFrame = ({
  certificateUrl,
  isLoading,
  isError,
}: SensorCertificateFrameProps) => {
  const { t } = useTranslation();

  return (
    <Box
      pt="18px"
      width="100%"
      height="415px"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      {certificateUrl && (
        <iframe
          width={912}
          height={415}
          src={`${certificateUrl}#toolbar=0`}
          title={t('device.management.bluetooth-sensors.view-certificate-dialog.title')}
          loading="eager"
        />
      )}
      {isLoading && <Loader overlay />}
      {isError && (
        <ErrorOverlay
          message={t('device.management.device.info.error-loading-device-data')}
          errorIconFontSize={33}
          variant="alertTitle"
        />
      )}
    </Box>
  );
};
