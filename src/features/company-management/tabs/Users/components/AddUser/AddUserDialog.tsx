import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { AddUserForm } from './AddUserForm';

import { Dialog } from '@/components/Dialog';

interface AddUserDialogProps {
  open: boolean;
  onClose: () => void;
}

export const AddUserDialog = ({ open, onClose }: AddUserDialogProps) => {
  const { t } = useTranslation();

  const [activeStep, setActiveStep] = useState(0);

  const handleStepChange = useCallback((step: number) => {
    setActiveStep(step);
  }, []);

  return (
    <Dialog
      maxWidth="md"
      onClose={onClose}
      open={open}
      dialogTitle={`${t('company.management.add-a-user', {
        step: activeStep + 1,
        numberOfSteps: 4,
      })}`}
      fullWidth
      dividers
      content={<AddUserForm onStepChange={handleStepChange} onSubmit={onClose} onClose={onClose} />}
    />
  );
};
