import Typography from '@carrier-io/fds-react/Typography';
import Button from '@carrier-io/fds-react/Button';
import { useTranslation } from 'react-i18next';

import { Dialog } from '@/components';

interface AssetHistoryGraphDeleteViewDialogProps {
  open: boolean;
  onClose: () => void;
  onCancel: () => void;
  onConfirm: () => void;
}

export const AssetHistoryGraphDeleteViewDialog = ({
  open,
  onClose,
  onCancel,
  onConfirm,
}: AssetHistoryGraphDeleteViewDialogProps) => {
  const { t } = useTranslation();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      dialogTitle={t('common.delete')}
      content={<Typography variant="body1">{t('assethistory.delete-current-view-confirmation')}</Typography>}
      actions={
        <>
          <Button autoFocus onClick={onCancel} color="secondary" variant="outlined">
            {t('common.no')}
          </Button>
          <Button color="primary" onClick={onConfirm} variant="outlined">
            {t('common.delete-confirm')}
          </Button>
        </>
      }
    />
  );
};
