import Typography from '@carrier-io/fds-react/Typography';
import Button from '@carrier-io/fds-react/Button';
import { useTranslation } from 'react-i18next';

import { Dialog } from '@/components';

export interface LeavePageDialogProps {
  onClose: () => void;
  onLeave: () => void;
  onSave: () => void;
  disableSaving?: boolean;
  open: boolean;
}

export const LeavePageDialog = ({
  onClose,
  open,
  onLeave,
  onSave,
  disableSaving = false,
}: LeavePageDialogProps) => {
  const { t } = useTranslation();

  return (
    <Dialog
      maxWidth="sm"
      open={open}
      dialogTitle={t('device.management.device.commissioning.save-changes')}
      content={
        <Typography variant="body1">{t('device.management.device.commissioning.unsaved-changes')}</Typography>
      }
      onClose={onClose}
      actions={
        <>
          <Button autoFocus onClick={onLeave} color="secondary" variant="outlined">
            {t('device.management.device.commissioning.leave')}
          </Button>
          <Button color="primary" onClick={onSave} variant="outlined" disabled={disableSaving}>
            {t('device.management.drawer.save-commissioning')}
          </Button>
        </>
      }
      fullWidth
    />
  );
};
