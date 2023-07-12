import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { AssignAssetsForm } from './AssignAssetsForm';

import { Dialog } from '@/components';

interface AddAssetsDialogProps {
  open: boolean;
  onClose: () => void;
}

export const AssignAssetsDialog = ({ open, onClose }: AddAssetsDialogProps) => {
  const { t } = useTranslation();

  const [activeStep, setActiveStep] = useState(0);

  const handleStepChange = useCallback((step: number) => {
    setActiveStep(step);
  }, []);

  return (
    <Dialog
      maxWidth="lg"
      sx={{
        '& .MuiDialog-paperWidthLg': {
          height: 892,
        },
        '& .ag-root-wrapper': {
          height: 400,
        },
      }}
      onClose={onClose}
      open={open}
      dialogTitle={`${t('company.management.assign-assets-steps', {
        step: activeStep + 1,
        numberOfSteps: 3,
      })}`}
      fullWidth
      dividers
      content={<AssignAssetsForm onStepChange={handleStepChange} onSubmit={onClose} />}
    />
  );
};
