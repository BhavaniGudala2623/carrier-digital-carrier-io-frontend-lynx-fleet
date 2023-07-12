import NumberInput from '@carrier-io/fds-react/patterns/NumberInput';
import Checkbox from '@carrier-io/fds-react/Checkbox';
import { useTranslation } from 'react-i18next';
import Switch from '@carrier-io/fds-react/Switch';
import FormControlLabel from '@carrier-io/fds-react/FormControlLabel';
import { useMemo } from 'react';
import { useFormikContext } from 'formik';
import Typography from '@carrier-io/fds-react/Typography';
import Grid from '@carrier-io/fds-react/Grid';

import { TwoWayCommandFormState } from '../useTwoWayCommandForm';
import {
  COMPARTMENT_SETPOINT_MAX_LIMIT_VALUE_IN_CELCIUS,
  COMPARTMENT_SETPOINT_MIN_LIMIT_VALUE_IN_CELCIUS,
} from '../constants';
import { toSelectedUnit } from '../utils';

import { CommandListItem } from './CommandListItem';

import { useUserSettings } from '@/providers/UserSettings';

interface CompartmentControlComponentProps {
  compartmentIndex: number;
  hidden: boolean;
  showInput: boolean;
  showToggle: boolean;
  checkBoxDisabled: boolean;
}

export function CompartmentControl({
  compartmentIndex,
  hidden,
  showInput,
  showToggle,
  checkBoxDisabled,
}: CompartmentControlComponentProps) {
  const { t } = useTranslation();
  const { userSettings } = useUserSettings();
  const { temperature } = userSettings;
  const [min, max] = useMemo(
    () =>
      [COMPARTMENT_SETPOINT_MIN_LIMIT_VALUE_IN_CELCIUS, COMPARTMENT_SETPOINT_MAX_LIMIT_VALUE_IN_CELCIUS].map(
        toSelectedUnit(temperature)
      ),
    [temperature]
  );
  const { values, handleChange, setFieldValue } = useFormikContext<TwoWayCommandFormState>();

  // 8451: Celsius, 8457: Fahrenheit
  const tempUnicode = temperature === 'C' ? <>&#8451;</> : <>&#8457;</>;

  const onChangeNumberInput = (value: unknown) => {
    setFieldValue(`c${compartmentIndex}_temp`, value);
  };

  return (
    <CommandListItem hidden={hidden}>
      <FormControlLabel
        control={
          <Checkbox
            name={`c${compartmentIndex}_checked`}
            disabled={checkBoxDisabled}
            checked={values[`c${compartmentIndex}_checked`]}
            onChange={handleChange}
          />
        }
        label={t(`asset.compartment${compartmentIndex}`)}
      />

      {showToggle && (
        <FormControlLabel
          control={
            <Switch
              disabled={!values[`c${compartmentIndex}_checked`]}
              size="small"
              name={`c${compartmentIndex}_status`}
              color="primary"
              checked={values[`c${compartmentIndex}_status`]}
              onChange={handleChange}
              sx={{ mr: 1 }}
            />
          }
          label={values[`c${compartmentIndex}_status`] ? t('common.on') : t('common.off')}
        />
      )}
      {showInput && (
        <Grid container alignItems="center">
          <Typography variant="body2" sx={{ mr: 1 }}>
            {t('common.setpoint')}
          </Typography>
          <NumberInput
            prefix={tempUnicode}
            defaultValue={values[`c${compartmentIndex}_temp`]}
            lowerLimit={min}
            upperLimit={max}
            onChange={onChangeNumberInput}
            disabled={!values[`c${compartmentIndex}_checked`]}
            placeholder=""
          />
        </Grid>
      )}
    </CommandListItem>
  );
}
