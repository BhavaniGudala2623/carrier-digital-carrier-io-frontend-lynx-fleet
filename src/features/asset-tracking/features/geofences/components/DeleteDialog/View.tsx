import { useTranslation } from 'react-i18next';
import Button from '@carrier-io/fds-react/Button';
import Typography from '@carrier-io/fds-react/Typography';

import { Dialog } from '@/components/Dialog';

export interface DeleteGeofenceConfirmationDialogViewProps {
  open: boolean;
  loading: boolean;
  handleCancel: () => void;
  handleOk: () => void;
}

export function DeleteGeofenceConfirmationDialogView({
  open,
  loading,
  handleCancel,
  handleOk,
}: DeleteGeofenceConfirmationDialogViewProps) {
  const { t } = useTranslation();

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      dialogTitle={t('geofences.delete-geofence')}
      content={<Typography variant="body1">{t('geofences.delete-geofence-message')}</Typography>}
      actions={
        <>
          <Button color="secondary" variant="outlined" disabled={loading} onClick={handleCancel}>
            {t('common.cancel')}
          </Button>
          <Button color="primary" variant="outlined" disabled={loading} onClick={handleOk}>
            {t('common.delete')}
          </Button>
        </>
      }
    />
  );
}
