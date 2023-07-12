import Typography from '@carrier-io/fds-react/Typography';
import Button from '@carrier-io/fds-react/Button';
import { useTranslation } from 'react-i18next';

import { Dialog } from '@/components';

export interface DeleteNotificationConfirmationDialogViewProps {
  open: boolean;
  loading: boolean;
  handleCancel: () => void;
  handleOk: () => void;
}

export function DeleteNotificationConfirmationDialogView({
  open,
  loading,
  handleCancel,
  handleOk,
}: DeleteNotificationConfirmationDialogViewProps) {
  const { t } = useTranslation();

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      dialogTitle={t('common.delete')}
      content={<Typography variant="body1">{t('notifications.delete-notification-message')}</Typography>}
      actions={
        <>
          <Button color="primary" variant="outlined" disabled={loading} onClick={handleCancel}>
            {t('common.no')}
          </Button>
          <Button color="primary" variant="contained" disabled={loading} onClick={handleOk}>
            {t('common.yes')}
          </Button>
        </>
      }
    />
  );
}
