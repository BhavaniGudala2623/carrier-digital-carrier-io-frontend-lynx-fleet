import Box from '@carrier-io/fds-react/Box';
import Button, { ButtonProps } from '@carrier-io/fds-react/Button';
import { Maybe, QuickDate } from '@carrier-io/lynx-fleet-types';
import { useTranslation } from 'react-i18next';
import { DateTimePicker } from '@carrier-io/fds-react/DateTime/DateTimePicker';
import IconButton from '@carrier-io/fds-react/IconButton';
import { MouseEventHandler, useCallback, useMemo } from 'react';
import TextField, { TextFieldProps } from '@carrier-io/fds-react/TextField';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { getDateFormat } from '@carrier-io/lynx-fleet-common';

import { useUserSettings } from '@/providers/UserSettings';
import { getDateInputMask } from '@/utils';

interface DateRangeFilterProps {
  startDate: Maybe<Date>;
  endDate: Maybe<Date>;
  quickDate?: Maybe<QuickDate>;
  minDate?: Date;
  maxDate?: Date;
  disableQuickDateButtons?: boolean;
  onStartDateChange: (startDate: Maybe<Date>) => void;
  onEndDateChange: (endDate: Maybe<Date>) => void;
  onQuickDateChange: (quickDate: Maybe<QuickDate>) => void;
}

const stub = () => {};

// we need to hide pencil icon to disable manual input mode as it's buggy
// and there is no prop for it
// but this is not stable
const pickerDialogSx = {
  '.PrivateDateTimePickerToolbar-penIcon': {
    display: 'none',
  },
};

export const DateRangeFilter = (props: DateRangeFilterProps) => {
  const {
    startDate,
    endDate,
    quickDate,
    minDate,
    maxDate,
    disableQuickDateButtons,
    onStartDateChange,
    onEndDateChange,
    onQuickDateChange,
  } = props;
  const { t } = useTranslation();
  const { userSettings } = useUserSettings();
  const { dateFormat } = userSettings;

  const getHandleQuickDateChange = (value: QuickDate) => () => onQuickDateChange(value);

  const handleStartDateAccepted = (date: unknown) => {
    if (startDate && (date as Date).toString() !== startDate?.toString()) {
      onStartDateChange(date as Date);
    }
  };

  const handleEndDateAccepted = (date: unknown) => {
    if (endDate && (date as Date).toString() !== endDate?.toString()) {
      onEndDateChange(date as Date);
    }
  };

  const renderInput = useCallback((params: TextFieldProps) => {
    const onClick = params.inputProps?.onClick
      ? (params.inputProps.onClick as MouseEventHandler<HTMLButtonElement>)
      : undefined;

    return (
      <TextField
        {...params}
        size="small"
        hiddenLabel
        InputProps={{
          endAdornment: (
            <IconButton onClick={onClick}>
              <CalendarTodayIcon fontSize="small" color="secondary" />
            </IconButton>
          ),
        }}
      />
    );
  }, []);

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

  const inputDateFormat = useMemo(() => getDateFormat(dateFormat), [dateFormat]);
  const inputDateMask = useMemo(() => getDateInputMask(inputDateFormat), [inputDateFormat]);

  return (
    <Box display="flex" alignItems="center" flexWrap="nowrap">
      <DateTimePicker
        disableFuture
        ampm={false}
        value={startDate}
        onChange={stub}
        onAccept={handleStartDateAccepted}
        renderInput={renderInput}
        minDate={minDate}
        inputFormat={inputDateFormat}
        mask={inputDateMask}
        DialogProps={{
          sx: pickerDialogSx,
        }}
        CancelButton={CancelButton}
        OkButton={OkButton}
      />
      <ArrowRightAltIcon sx={{ mx: 0.5 }} color="action" />
      <DateTimePicker
        ampm={false}
        disableFuture
        value={endDate}
        onChange={stub}
        onAccept={handleEndDateAccepted}
        renderInput={renderInput}
        minDate={startDate ?? undefined}
        maxDate={maxDate}
        inputFormat={inputDateFormat}
        mask={inputDateMask}
        DialogProps={{
          sx: pickerDialogSx,
        }}
        CancelButton={CancelButton}
        OkButton={OkButton}
      />

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          ml: 3,
          height: '38px',
        }}
      >
        <Button
          variant="text"
          sx={{
            color: (theme) => (quickDate === '24h' ? theme.palette.grey['900'] : theme.palette.grey['500']),
          }}
          disabled={disableQuickDateButtons}
          onClick={getHandleQuickDateChange('24h')}
          data-testid="last24h"
        >
          {t('common.last.24h')}
        </Button>
        <Button
          variant="text"
          sx={{
            color: (theme) => (quickDate === '48h' ? theme.palette.grey['900'] : theme.palette.grey['500']),
          }}
          disabled={disableQuickDateButtons}
          onClick={getHandleQuickDateChange('48h')}
          data-testid="last48h"
        >
          {t('common.last.48h')}
        </Button>
        <Button
          variant="text"
          sx={{
            color: (theme) => (quickDate === '7d' ? theme.palette.grey['900'] : theme.palette.grey['500']),
          }}
          disabled={disableQuickDateButtons}
          onClick={getHandleQuickDateChange('7d')}
          data-testid="last7d"
        >
          {t('common.last.7d')}
        </Button>
      </Box>
    </Box>
  );
};
