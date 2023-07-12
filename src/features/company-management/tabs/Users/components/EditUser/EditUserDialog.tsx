import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { EditUserForm } from './EditUserForm';

import { Dialog } from '@/components/Dialog';

interface IProps {
  userEmail: string;
  open: boolean;
  onClose: () => void;
}

export const EditUserDialog = ({ userEmail, open, onClose }: IProps) => {
  const { t } = useTranslation();

  const [activeStep, setActiveStep] = useState(0);

  const handleStepChange = useCallback(
    (step: number) => {
      setActiveStep(step);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeStep]
  );

  return (
    <Dialog
      maxWidth="md"
      onClose={onClose}
      open={open}
      dialogTitle={`${t('company.management.edit-a-user', {
        step: activeStep + 1,
        numberOfSteps: 4,
      })}`}
      fullWidth
      dividers
      content={
        <EditUserForm
          userEmail={userEmail}
          onStepChange={handleStepChange}
          onSubmit={onClose}
          onClose={onClose}
          activeStep={activeStep}
        />
      }
    />
  );
};
