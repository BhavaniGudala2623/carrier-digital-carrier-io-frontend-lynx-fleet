import { cloneElement, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Dialog } from '@/components/Dialog';

interface CreateGroupDialogProps {
  onClose: () => void;
  children: JSX.Element;
  title: string;
}

export const UserGroupDialog = ({ title, onClose, children }: CreateGroupDialogProps) => {
  const { t } = useTranslation();

  const [activeStep, setActiveStep] = useState(0);

  const handleStepChange = useCallback((step: number) => {
    setActiveStep(step);
  }, []);

  return (
    <Dialog
      maxWidth="md"
      onClose={onClose}
      open
      dialogTitle={t(title, { step: activeStep + 1, numberOfSteps: 4 })}
      fullWidth
      dividers
      content={cloneElement(children, { onStepChange: handleStepChange, onSubmit: onClose })}
    />
  );
};
