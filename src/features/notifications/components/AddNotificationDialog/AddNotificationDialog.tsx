import { useCallback, useMemo, useState } from 'react';
import { Formik } from 'formik';
import { CreateNotificationInput, CreateNotificationRuleInput } from '@carrier-io/lynx-fleet-types';
import { FormikHelpers } from 'formik/dist/types';
import { useTranslation } from 'react-i18next';

import { createNotificationAction } from '../../stores';
import { NotificationFormData } from '../../types';
import { validateForm } from '../NotificationDialog/validateForm';
import { NotificationDialogView } from '../NotificationDialog';

import { useSteps } from '@/features/common';
import { timeToSeconds } from '@/utils';
import { useAppDispatch, useAppSelector } from '@/stores';
import { getAuthTenantId } from '@/features/authentication';
import { showError } from '@/stores/actions';

interface AddNotificationDialogProps {
  onClose: () => void;
}

export const AddNotificationDialog = ({ onClose }: AddNotificationDialogProps) => {
  const [loading, setLoading] = useState(false);

  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const tenantId = useAppSelector(getAuthTenantId);
  const { activeStep, setActiveStep, handleNext, handleBack } = useSteps();

  const addNotificationFormInitialValues = useMemo<NotificationFormData>(
    () => ({
      name: '',
      enableTimeCondition: false,
      sendEmail: true, // Enforce sending of email notifications
      time: { hr: 0, min: 0 },
      conditions: [],
      exceptConditions: [],
      recipients: [],
      assets: {
        companyId: tenantId,
      },
    }),
    [tenantId]
  );

  const handleSubmit = useCallback(
    (
      {
        name,
        conditions,
        exceptConditions,
        enableTimeCondition,
        time,
        assets,
        recipients,
        sendEmail,
      }: NotificationFormData,
      { resetForm }: FormikHelpers<NotificationFormData>
    ) => {
      let rule: CreateNotificationRuleInput = {
        condition: conditions[0],
        exceptConditions,
      };

      if (enableTimeCondition) {
        rule = {
          ...rule,
          onlySendWhenConditionMetActive: enableTimeCondition,
        };

        if (time) {
          rule = {
            ...rule,
            onlySendWhenConditionMetSeconds: timeToSeconds(time.hr, time.min),
          };
        }
      }

      const payload: CreateNotificationInput = {
        tenantId: assets.companyId,
        name,
        active: true,
        sendEmail,
        recipients,
        rule,
        assets,
      };
      setLoading(true);
      dispatch(createNotificationAction(payload))
        .then(() => {
          setLoading(false);
          onClose();
          resetForm();
          setActiveStep(0);
        })
        .catch((error) => {
          setLoading(false);
          if (error instanceof Error && error.message === 'notification_with_such_name_already_exists') {
            showError(dispatch, t('error.notification_with_such_name_already_exists'));
            setActiveStep(0);
          }
        });
    },
    [dispatch, onClose, setActiveStep, t]
  );

  const validateFormData = useCallback(
    (data: NotificationFormData) => {
      const { errors } = validateForm(data, activeStep, t);

      return errors;
    },
    [t, activeStep]
  );

  return (
    <Formik
      initialValues={addNotificationFormInitialValues}
      onSubmit={handleSubmit}
      validate={validateFormData}
      validateOnMount={false}
      validateOnChange
      validateOnBlur
      enableReinitialize
    >
      <NotificationDialogView
        activeStep={activeStep}
        onClickBack={handleBack}
        onClickNext={handleNext}
        onClose={onClose}
        loading={loading}
        mode="CREATE"
      />
    </Formik>
  );
};
