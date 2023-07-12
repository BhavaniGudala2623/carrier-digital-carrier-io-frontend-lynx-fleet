/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import Container from '@carrier-io/fds-react/Container';
import { useFormikContext } from 'formik';
import { isEmpty } from 'lodash-es';

import { NotificationFormData } from '../../types';

import { Rules, SelectAssets, ChooseDelivery, NotificationReview } from './Steps';

import { StepperComponent, Dialog, Loader } from '@/components';
import { DialogMode } from '@/types';

export interface NotificationDialogViewProps {
  loading: boolean;
  activeStep: number;
  onClickNext: () => void;
  onClickBack: () => void;
  onClose: () => void;
  mode: DialogMode;
}

function getStepTitles(t: TFunction<'translation'>) {
  return [
    t('notifications.select-assets'),
    t('notifications.create-rules'),
    t('notifications.choose-delivery'),
    t('notifications.review'),
  ];
}

export const NotificationDialogView = ({
  loading,
  activeStep,
  onClickBack,
  onClickNext,
  onClose,
  mode,
}: NotificationDialogViewProps) => {
  const { t } = useTranslation();
  const [lastNavigationCommand, setLastNavigationCommand] = useState('');
  const { resetForm, validateForm, isValid, values } = useFormikContext<NotificationFormData>();

  const title =
    mode === 'CREATE' ? t('notifications.add-a-notification') : t('notifications.edit-notification');
  useEffect(() => {
    if (lastNavigationCommand === 'BACK') {
      validateForm(values);
    }
  }, [activeStep]);
  const handleClose = useCallback(() => {
    onClose();
    resetForm();
  }, [onClose, resetForm]);

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <SelectAssets />;
      case 1:
        return <Rules />;
      case 2:
        return <ChooseDelivery />;
      default:
        return <NotificationReview />;
    }
  };

  const handleClickNext = useCallback(async () => {
    setLastNavigationCommand('NEXT');
    const errors = await validateForm(values);

    if (isEmpty(errors)) {
      onClickNext();
    }
  }, [validateForm, values, onClickNext]);

  const handleClickBack = useCallback(async () => {
    setLastNavigationCommand('BACK');
    onClickBack();
  }, [onClickBack]);

  return (
    <Dialog
      open
      onClose={handleClose}
      dialogTitle={`${title} ${activeStep + 1} ${t('common.of')} 4`}
      maxWidth="md"
      fullWidth
      dividers
      content={
        <Container sx={{ minHeight: 500 }}>
          <StepperComponent
            loading={loading}
            activeStep={activeStep}
            onClickNext={handleClickNext}
            onClickBack={handleClickBack}
            onClose={onClose}
            getSteps={getStepTitles}
            getStepContent={getStepContent}
            isFormContentValid={isValid}
            loader={<Loader overlay />}
            nextButtonVariant="outlined"
          />
        </Container>
      }
    />
  );
};

NotificationDialogView.displayName = 'NotificationDialogView';
