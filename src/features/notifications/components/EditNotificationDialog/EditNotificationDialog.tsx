import { useCallback, useEffect, useMemo, useState } from 'react';
import { Formik } from 'formik';
import { set } from 'lodash-es';
import {
  Notification,
  UpdateNotificationInput,
  UpdateNotificationRuleInput,
} from '@carrier-io/lynx-fleet-types';
import { useTranslation } from 'react-i18next';
import { TemperatureDeviationExpression } from '@carrier-io/lynx-fleet-types/dist/notification/notification';

import { fetchNotification, updateNotificationAction } from '../../stores';
import { NotificationFormData } from '../../types';
import { validateForm } from '../NotificationDialog/validateForm';
import { NotificationDialogView } from '../NotificationDialog';

import { getErrorMessage, secondsAsTimePickerValue, timeToSeconds } from '@/utils';
import { useAppDispatch } from '@/stores';
import { showError } from '@/stores/actions';
import { useSteps } from '@/features/common';

interface EditNotificationDialogProps {
  onClose: () => void;
  notificationId: string;
}

export const EditNotificationDialog = ({ onClose, notificationId }: EditNotificationDialogProps) => {
  const { t } = useTranslation();
  const [initialValue, setInitialValue] = useState<Notification | null>(null);
  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();
  const { activeStep, setActiveStep, handleNext, handleBack } = useSteps();

  useEffect(() => {
    if (notificationId) {
      setLoading(true);
      fetchNotification(notificationId)
        .then((res) => {
          const notification = { ...res };

          // To add 1, 2, 3 compartments by default for old notification
          if (notification?.rule?.condition) {
            if (
              !(notification.rule.condition.expression as TemperatureDeviationExpression)?.compartments &&
              notification.rule.condition.type === 'TEMPERATURE_DEVIATION'
            ) {
              set(notification, 'rule.condition.expression.compartments', [1, 2, 3]);
            }
          }

          setInitialValue((notification as Notification) ?? null);
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          showError(dispatch, getErrorMessage(error));
        });
    }
  }, [dispatch, notificationId]);

  const handleSubmit = useCallback(
    ({ name, conditions, exceptConditions, enableTimeCondition, time, sendEmail, recipients, assets }) => {
      if (initialValue) {
        let rule: UpdateNotificationRuleInput = {
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

        const payload: UpdateNotificationInput = {
          notificationId: initialValue?.notificationId,
          tenantId: assets.companyId,
          name,
          sendEmail,
          recipients,
          assets,
          rule,
        };
        setLoading(true);
        dispatch(updateNotificationAction(payload))
          .then(() => {
            setLoading(false);
            onClose();
            setActiveStep(0);
          })
          .catch((error) => {
            setLoading(false);
            if (error instanceof Error && error.message === 'notification_with_such_name_already_exists') {
              showError(dispatch, t('error.notification_with_such_name_already_exists'));
              setActiveStep(0);
            }
          });
      }
    },
    [dispatch, initialValue, onClose, setActiveStep, t]
  );

  const validateFormData = useCallback(
    (data: NotificationFormData) => {
      const { errors } = validateForm(data, activeStep, t);

      return errors;
    },
    [t, activeStep]
  );

  const initialValues = useMemo<NotificationFormData>(
    () => ({
      name: initialValue?.name || '',
      sendEmail: initialValue?.sendEmail || true,
      enableTimeCondition: initialValue?.rule?.onlySendWhenConditionMetActive || false,
      time: secondsAsTimePickerValue(initialValue?.rule.onlySendWhenConditionMetSeconds),
      conditions: initialValue?.rule?.condition ? [initialValue.rule.condition] : [],
      exceptConditions: initialValue?.rule?.exceptConditions || [],
      assets: initialValue?.assets || {
        companyId: '',
      },
      recipients: initialValue?.recipients || [],
    }),
    [initialValue]
  );

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validate={validateFormData}
      enableReinitialize
      validateOnChange
      validateOnBlur
    >
      <NotificationDialogView
        activeStep={activeStep}
        onClickBack={handleBack}
        onClickNext={handleNext}
        onClose={onClose}
        loading={loading}
        mode="EDIT"
      />
    </Formik>
  );
};
