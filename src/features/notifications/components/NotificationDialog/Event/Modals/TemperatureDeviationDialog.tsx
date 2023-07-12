import { useCallback, useMemo, useState, ChangeEvent } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import {
  TemperatureDeviationExpression,
  TemperatureDeviationFixedValueExpression,
  SetpointChangeExpression,
  NotificationRuleCondition,
} from '@carrier-io/lynx-fleet-types';
import Box from '@carrier-io/fds-react/Box';
import Typography from '@carrier-io/fds-react/Typography';
import RadioGroup from '@carrier-io/fds-react/RadioGroup';
import Radio from '@carrier-io/fds-react/Radio';
import FormControlLabel from '@carrier-io/fds-react/FormControlLabel';
import Slider from '@carrier-io/fds-react/Slider';
import { AutocompleteProps } from '@carrier-io/fds-react/Autocomplete';

import { Dropdown, useDropdownOption } from '../../Dropdown';
import { useNumericValue } from '../../../../hooks';
import { EventDialogTempDeviationProps, TemperatureDeviationComparisonType } from '../../../../types';
import { TemperaturePicker } from '../../TemperaturePicker';
import { CompartmentSelector } from '../../../Selector/Compartment';

import { DialogActions } from './DialogActions';
import { boldTextSx } from './styles';

import { Dialog } from '@/components';
import { toCelsiusDelta, getTemperatureDelta, toUnit, toCelsius } from '@/utils';
import { useUserSettings } from '@/providers/UserSettings';

export const TemperatureDeviationDialog = ({
  handleCancel,
  handleOk,
  expression,
  type,
}: EventDialogTempDeviationProps) => {
  const { userSettings } = useUserSettings();
  const { temperature } = userSettings;

  const initialCompartments = (expression as TemperatureDeviationExpression)?.compartments ?? [1, 2, 3];
  const initialUpperValueRange = toUnit(
    (expression as SetpointChangeExpression)?.range?.upperValue ?? 5,
    temperature,
    0
  );
  const initialLowerValueRange = toUnit(
    (expression as SetpointChangeExpression)?.range?.lowerValue ?? 0,
    temperature,
    0
  );

  const [selectedCompartments, setSelectedCompartments] = useState<number[]>(initialCompartments);
  const [range, setRange] = useState<number[]>([initialLowerValueRange, initialUpperValueRange]);
  const { t } = useTranslation();

  const isCompartmentSelected = Boolean(selectedCompartments.length > 0);
  const isCelsiusTemperature = temperature === 'C';
  const isTemperatureDeviationFixedValue = type === 'TEMPERATURE_DEVIATION_FIXED_VALUE';
  const isTemperatureDeviation = type === 'TEMPERATURE_DEVIATION';
  const isSetpointChange = type === 'SETPOINT_CHANGE';
  const lowerLimit = isCelsiusTemperature ? -30 : -22;
  const upperLimit = isCelsiusTemperature ? 35 : 95;

  const dropdownItems = useMemo<{ label: string; value: TemperatureDeviationComparisonType }[]>(
    () => [
      {
        label: t('common.above').toLocaleLowerCase(),
        value: 'ABOVE',
      },
      {
        label: t('common.below').toLocaleLowerCase(),
        value: 'BELOW',
      },
      {
        label: `${t('common.above').toLocaleLowerCase()} ${t('common.or').toLocaleLowerCase()} ${t(
          'common.below'
        ).toLocaleLowerCase()}`,
        value: 'ABOVE_OR_BELOW',
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const sliderMarks = useMemo(
    () => [
      {
        value: lowerLimit,
        label: `${lowerLimit} °${temperature}`,
      },
      {
        value: upperLimit,
        label: `${upperLimit} °${temperature}`,
      },
    ],
    [lowerLimit, upperLimit, temperature]
  );

  const initialTemperatureValue = (expression as TemperatureDeviationExpression)?.value || 0;
  const initialTemperatureSetpoint = (expression as TemperatureDeviationFixedValueExpression)?.setpoint || 0;
  const initialComparison =
    (expression as TemperatureDeviationExpression | SetpointChangeExpression)?.comparison ||
    (isSetpointChange ? 'CHANGED' : dropdownItems[0].value);

  const { value: temperatureValue, handleValueChange: handleTemperatureValueChange } = useNumericValue(
    getTemperatureDelta(initialTemperatureValue, temperature)
  );

  const { value: temperatureSetpoint, handleValueChange: handleTemperatureSetpointChange } = useNumericValue(
    getTemperatureDelta(initialTemperatureSetpoint, temperature)
  );

  const { option, handleOptionChange } = useDropdownOption<
    TemperatureDeviationComparisonType | SetpointChangeExpression['comparison']
  >(initialComparison);

  const getDialogTitle = () => {
    if (isTemperatureDeviation) {
      return 'notifications.temperature-deviation-setpoint';
    }

    if (isSetpointChange) {
      return 'notifications.setpoint-change';
    }

    return 'notifications.temperature-deviation-fixed-value';
  };

  const getCelsiusTemperature = useCallback(
    (isCelsius, tempValue) => (isCelsius ? tempValue : toCelsiusDelta(tempValue)),
    []
  );

  const handleSave = useCallback(() => {
    const expressionCommon = {
      comparison: option,
      compartments: selectedCompartments,
    };

    if (isTemperatureDeviationFixedValue) {
      handleOk({
        type: 'TEMPERATURE_DEVIATION_FIXED_VALUE',
        expression: {
          value: getCelsiusTemperature(isCelsiusTemperature, temperatureValue),
          setpoint: getCelsiusTemperature(isCelsiusTemperature, temperatureSetpoint),
          ...expressionCommon,
        } as TemperatureDeviationFixedValueExpression,
      });
    }

    if (isTemperatureDeviation) {
      handleOk({
        type: 'TEMPERATURE_DEVIATION',
        expression: {
          value: getCelsiusTemperature(isCelsiusTemperature, temperatureValue),
          ...expressionCommon,
        } as TemperatureDeviationExpression,
      });
    }

    if (isSetpointChange) {
      const setpointChangeSettings = {
        type: 'SETPOINT_CHANGE',
        expression: {
          ...expressionCommon,
        } as SetpointChangeExpression,
      };

      if (option === 'OUTSIDE_RANGE') {
        setpointChangeSettings.expression.range = {
          lowerValue: isCelsiusTemperature ? range[0] : toCelsius(range[0]),
          upperValue: isCelsiusTemperature ? range[1] : toCelsius(range[1]),
        };
      }

      handleOk(setpointChangeSettings as NotificationRuleCondition);
    }
  }, [
    option,
    selectedCompartments,
    isTemperatureDeviationFixedValue,
    isTemperatureDeviation,
    isSetpointChange,
    handleOk,
    getCelsiusTemperature,
    isCelsiusTemperature,
    temperatureValue,
    temperatureSetpoint,
    range,
  ]);

  const handleCompartmentsChange: AutocompleteProps['onChange'] = useCallback((_event, value) => {
    setSelectedCompartments(value.map((compartment) => compartment.value));
  }, []);

  const handleSetpointChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleOptionChange(event.target.value as SetpointChangeExpression['comparison']);
  };

  const handleChangeRange = (_event, newValue: number | number[]) => {
    setRange(newValue as number[]);
  };

  return (
    <Dialog
      open
      onClose={handleCancel}
      dialogTitle={t(getDialogTitle())}
      fullWidth
      maxWidth="sm"
      content={
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ mb: 1 }}>
            <CompartmentSelector
              selectedCompartments={selectedCompartments}
              onChange={handleCompartmentsChange}
              isCompartmentSelected={isCompartmentSelected}
            />
          </Box>
          <Box display="flex" flexDirection="column">
            {isTemperatureDeviationFixedValue && (
              <Box display="flex" alignItems="center" width="100%">
                <Typography>{t('notifications.reference-return-air')}</Typography>
                <Box ml={1}>
                  <TemperaturePicker
                    value={temperatureSetpoint}
                    onChange={handleTemperatureSetpointChange}
                    lowerLimit={lowerLimit}
                    upperLimit={upperLimit}
                    prefix={userSettings.temperature}
                  />
                </Box>
              </Box>
            )}

            {(isTemperatureDeviation || isTemperatureDeviationFixedValue) && (
              <Box display="flex" alignItems="center" width="100%">
                <Typography variant="body1" component="div">
                  <Typography sx={boldTextSx}>{t('common.if')}</Typography>
                  &nbsp;
                  {t('notifications.return-air')}
                </Typography>
                <Dropdown value={option} onChange={handleOptionChange} items={dropdownItems} />
                <Typography variant="body1">
                  {t(
                    isTemperatureDeviationFixedValue
                      ? 'notifications.fixed-value-by'
                      : 'notifications.setpoint-by'
                  )}
                </Typography>
                <Box ml={1}>
                  <TemperaturePicker
                    value={temperatureValue}
                    onChange={handleTemperatureValueChange}
                    lowerLimit={0}
                    prefix={userSettings.temperature}
                    step={1}
                  />
                </Box>
              </Box>
            )}

            {isSetpointChange && (
              <Box display="flex" flexDirection="column" width="100%">
                <RadioGroup value={option} onChange={handleSetpointChange}>
                  <FormControlLabel
                    control={<Radio size="small" />}
                    label={t('notifications.if-setpoint-changed')}
                    labelPlacement="end"
                    size="medium"
                    value="CHANGED"
                    sx={option === 'OUTSIDE_RANGE' ? { color: 'text.disabled' } : null}
                  />
                  <FormControlLabel
                    control={<Radio size="small" />}
                    label={
                      <Trans
                        i18nKey="notifications.if-setpoint-changed-range"
                        values={{
                          lowerCount: `${range[0]} °${temperature}`,
                          upperCount: `${range[1]} °${temperature}`,
                        }}
                      />
                    }
                    labelPlacement="end"
                    size="medium"
                    value="OUTSIDE_RANGE"
                    sx={option === 'CHANGED' ? { color: 'text.disabled' } : null}
                  />
                </RadioGroup>

                <Box display="flex" ml={3} pt={2} pb={1}>
                  <Slider
                    onChange={handleChangeRange}
                    value={range}
                    min={lowerLimit}
                    max={upperLimit}
                    step={1}
                    size="small"
                    valueLabelDisplay="on"
                    marks={sliderMarks}
                    disabled={option === 'CHANGED'}
                    componentsProps={{
                      valueLabel: {
                        // @ts-ignore
                        color: 'secondary',
                        style: { height: 30, fontSize: 12, paddingTop: 8 },
                      },
                    }}
                  />
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      }
      actionsSx={{ p: 1 }}
      actions={
        <DialogActions onCancel={handleCancel} onSave={handleSave} disabled={!isCompartmentSelected} />
      }
    />
  );
};
