import { useTranslation } from 'react-i18next';

import { WirelessSensorsTableParams } from '../../../types';
import { ViewCertificateDialog } from '../../ViewCertificateDialog';

import { TableCellLink } from '@/components';
import { useToggle } from '@/hooks';

export const CertificateLinkRenderer = ({ data }: WirelessSensorsTableParams) => {
  const { t } = useTranslation();

  const {
    value: isViewCertificateDialogOpen,
    toggleOn: handleOpenViewCertificateDialog,
    toggleOff: handleCloseViewCertificateDialog,
  } = useToggle(false);

  if (!data?.hasCertificate) {
    return '-';
  }

  return (
    <>
      <TableCellLink onClick={handleOpenViewCertificateDialog}>
        {t('device.management.bluetooth-sensors.certificate-link-label')}
      </TableCellLink>
      {isViewCertificateDialogOpen && (
        <ViewCertificateDialog
          macId={data.macId}
          open={isViewCertificateDialogOpen}
          onClose={handleCloseViewCertificateDialog}
        />
      )}
    </>
  );
};
