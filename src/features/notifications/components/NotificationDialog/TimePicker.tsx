import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import SetTime from '@carrier-io/fds-react/patterns/SetTime/SetTime';

import { NotificationTimeFormData } from '../../types';

interface TimePickerProps {
  value: NotificationTimeFormData;
  disabled?: boolean;
  onChange: (value: NotificationTimeFormData) => void;
}

export const TimePicker = memo(({ value, disabled = false, onChange }: TimePickerProps) => {
  const { t } = useTranslation();

  const limitHours = new Date(1970, 1, 1, 12, 0, 0, 0).getHours();

  return (
    <SetTime
      value={value}
      disabled={disabled}
      dropDownHeight={200}
      limitHours={limitHours}
      limitMinutes={59}
      onChange={onChange}
      size="small"
      stepHours={1}
      stepMinutes={1}
      hourUnitText={t('common.hours-short')}
      minuteUnitText={t('common.minutes-short')}
    />
  );
});

TimePicker.displayName = 'TimePicker';
