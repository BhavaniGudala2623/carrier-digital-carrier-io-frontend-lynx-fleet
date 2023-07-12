import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormikContext } from 'formik';
import Checkbox from '@carrier-io/fds-react/Checkbox';
import FormControlLabel from '@carrier-io/fds-react/FormControlLabel';
import TextField from '@carrier-io/fds-react/TextField';
import Typography from '@carrier-io/fds-react/Typography';
import Box from '@carrier-io/fds-react/Box';
import { NotificationRuleConditionType } from '@carrier-io/lynx-fleet-types';

import { NotificationFormData, NotificationTimeFormData } from '../../../types';
import { AdditionalRules } from '../AdditionalRules';
import { TimePicker } from '../TimePicker';
import { RuleConditions } from '../Event/RuleConditions';

export const Rules = () => {
  const { values, errors, handleChange, handleBlur } = useFormikContext<NotificationFormData>();
  const { t } = useTranslation();
  const assetOfflineTime: NotificationTimeFormData = {
    hr: 24,
    min: 0,
  };

  const allowedEvents: NotificationRuleConditionType[] = useMemo(() => {
    const events: NotificationRuleConditionType[] = [
      'TEMPERATURE_DEVIATION',
      'TEMPERATURE_DEVIATION_FIXED_VALUE',
      'DOOR',
      'GEOFENCE',
      'TRU_ALARM',
      'FUEL_LEVEL',
      'BATTERY_LEVEL',
      'ASSET_OFFLINE',
    ];

    events[events.length] = 'SETPOINT_CHANGE';

    return events;
  }, []);

  const handleTimeChange = useCallback(
    (value: NotificationTimeFormData) => {
      handleChange({
        target: {
          name: 'time',
          value,
        },
      });
    },
    [handleChange]
  );

  return (
    <>
      <TextField
        sx={{
          mb: 3,
          maxWidth: '480px',
        }}
        id="name"
        name="name"
        label={t('notifications.name')}
        aria-label={t('notifications.name')}
        type="text"
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.name}
        error={Boolean(errors.name)}
        helperText={errors.name}
        size="small"
        fullWidth
      />
      <Typography sx={{ mb: 1 }} variant="body1" gutterBottom>
        {t('notifications.send-notification')} {t('common.if')}:
      </Typography>
      <RuleConditions
        fieldName="conditions"
        conditions={values.conditions}
        error={errors.conditions as string}
        allowedEvents={allowedEvents}
      />
      {values.conditions.length > 0 &&
        !['DOOR', 'FUEL_LEVEL', 'BATTERY_LEVEL', 'ASSET_OFFLINE', 'TRU_ALARM', 'SETPOINT_CHANGE'].includes(
          values.conditions[0].type
        ) && (
          <>
            <Typography sx={{ mb: 1, mt: 3 }} variant="body1" gutterBottom>
              {t('notifications.except-when')}:
            </Typography>
            <RuleConditions
              fieldName="exceptConditions"
              conditions={values.exceptConditions}
              allowedEvents={['DOOR']}
              exclude
            />
          </>
        )}
      <AdditionalRules notificationType={values.conditions[0]?.type} />
      <Typography variant="body1" sx={{ mb: -1 }}>
        {t('notifications.apply-threshhold')}:
      </Typography>
      {values.conditions.length > 0 && !['ASSET_OFFLINE'].includes(values.conditions[0].type) && (
        <Box display="flex" alignItems="center">
          <FormControlLabel
            control={
              <Checkbox
                checked={values.enableTimeCondition}
                onChange={handleChange}
                name="enableTimeCondition"
                color="primary"
              />
            }
            label={t('notifications.time-conditions-met')}
          />
          <TimePicker
            value={values.time}
            disabled={!values.enableTimeCondition}
            onChange={handleTimeChange}
          />
        </Box>
      )}

      {values.conditions.length > 0 && ['ASSET_OFFLINE'].includes(values.conditions[0].type) && (
        <Box display="flex" alignItems="center">
          <FormControlLabel
            control={
              <Checkbox checked onChange={handleChange} name="enableTimeCondition" color="primary" disabled />
            }
            label={t('notifications.time-conditions-met')}
          />
          <TimePicker value={assetOfflineTime} disabled onChange={handleTimeChange} />
        </Box>
      )}
    </>
  );
};
