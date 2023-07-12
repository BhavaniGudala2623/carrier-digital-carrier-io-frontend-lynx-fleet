import { useState, useCallback, useEffect } from 'react';
import TextField from '@carrier-io/fds-react/TextField';
import IconButton from '@carrier-io/fds-react/IconButton';
import InputAdornment from '@carrier-io/fds-react/InputAdornment';
import { DateTimePicker } from '@carrier-io/fds-react/DateTime/DateTimePicker';
import { CalendarToday } from '@mui/icons-material';
import { formatISO } from 'date-fns';
import { useTranslation } from 'react-i18next';
import Button, { ButtonProps } from '@carrier-io/fds-react/Button';
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';
import { Maybe } from '@carrier-io/lynx-fleet-types';

import { SensorsConfigTableProps, ParamsProps } from '../../../types';

import { useUserSettings } from '@/providers/UserSettings';

type OptionsProps = Pick<SensorsConfigTableProps, 'handleChangeSensorField'>;

export const SensorInstalledFormatter = (
  { data: { dataField, installed }, editAllowed }: ParamsProps,
  { handleChangeSensorField }: OptionsProps
) => {
  const {
    userSettings: { timezone },
  } = useUserSettings();
  const [installedDate, setInstalledDate] = useState<Maybe<number | string | Date>>(installed || null);
  const [prevTimeZone, setPrevTimeZone] = useState<Maybe<string>>(null);

  useEffect(() => {
    if (installedDate) {
      if (prevTimeZone) {
        setInstalledDate(utcToZonedTime(zonedTimeToUtc(installedDate, prevTimeZone), timezone));
      } else {
        setInstalledDate(utcToZonedTime(installedDate, timezone));
      }
    }
    setPrevTimeZone(timezone);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timezone]);

  const { t } = useTranslation();

  const onDateChange = (date) => {
    if (!date) {
      setInstalledDate(null);
      handleChangeSensorField(null, dataField, 'installed');

      return;
    }

    setInstalledDate(date.getTime());
    handleChangeSensorField(formatISO(zonedTimeToUtc(date, timezone)), dataField, 'installed');
  };

  const onOpen = () => {
    if (!installedDate) {
      setInstalledDate(utcToZonedTime(new Date().getTime(), timezone));
    }
  };

  const OkButton = useCallback(
    (buttonProps: ButtonProps) => (
      <Button {...buttonProps} variant="outlined" color="primary">
        {t('common.ok')}
      </Button>
    ),
    [t]
  );

  const CancelButton = useCallback(
    (buttonProps: ButtonProps) => (
      <Button {...buttonProps} variant="outlined" color="secondary">
        {t('common.cancel')}
      </Button>
    ),
    [t]
  );

  return (
    <DateTimePicker
      clearable
      value={installedDate}
      onChange={() => {}}
      onAccept={onDateChange}
      ampm={false}
      onOpen={onOpen}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end" disablePointerEvents>
            <IconButton>
              <CalendarToday />
            </IconButton>
          </InputAdornment>
        ),
      }}
      disabled={!editAllowed}
      renderInput={(params) => <TextField {...params} size="small" hiddenLabel hideBackgroundColor />}
      DialogProps={{
        sx: {
          '.PrivateDateTimePickerToolbar-penIcon': {
            display: 'none',
          },
        },
      }}
      CancelButton={CancelButton}
      OkButton={OkButton}
      clearText={t('common.clear')}
    />
  );
};
