import Button from '@carrier-io/fds-react/Button';
import { useTranslation } from 'react-i18next';

interface DialogActionsProps {
  onCancel: () => void;
  onSave: () => void;
  disabled?: boolean;
}

export const DialogActions = ({ onCancel, onSave, disabled }: DialogActionsProps) => {
  const { t } = useTranslation();

  return (
    <>
      <Button color="secondary" variant="outlined" onClick={onCancel}>
        {t('common.cancel')}
      </Button>
      <Button color="primary" variant="outlined" onClick={onSave} disabled={disabled}>
        {t('common.save')}
      </Button>
    </>
  );
};
