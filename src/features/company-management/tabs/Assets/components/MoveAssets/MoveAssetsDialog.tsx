import { useTranslation } from 'react-i18next';
import { useCallback, useState } from 'react';

import { MoveAssetsFormContainer } from '../../containers';

import { Dialog } from '@/components/Dialog';

interface MoveAssetsDialogProps {
  open: boolean;
  onClose: () => void;
}

export const MoveAssetsDialog = ({ open, onClose }: MoveAssetsDialogProps) => {
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = useState(0);

  const setStep = useCallback((step: number) => {
    setActiveStep(step);
  }, []);

  return (
    <Dialog
      maxWidth="md"
      sx={{ minHeight: 300 }}
      contentSx={{ pr: 1 }}
      onClose={onClose}
      open={open}
      dialogTitle={t('company.management.assets.move-assets-steps', { step: activeStep + 1 })}
      fullWidth
      content={<MoveAssetsFormContainer onClose={onClose} setStep={setStep} activeStep={activeStep} />}
    />
  );
};
