import { useState, useEffect } from 'react';
import { useFormikContext } from 'formik';
import {
  getDefaultBluetoothSensorsReplacementPeriod,
  CountryType,
  BLUETOOTH_SENSORS_MIN_REPLACEMENT_PERIOD_IN_MONTH,
  BLUETOOTH_SENSORS_MAX_REPLACEMENT_PERIOD_IN_MONTH,
} from '@carrier-io/lynx-fleet-common';
import { useTranslation } from 'react-i18next';

import { ContractView } from './ContractView';

import { CreateCompanyFormData } from '@/features/company-management/types';
import { getCountryName } from '@/utils';
import { usePrevious } from '@/hooks';

export const Contract = ({ editMode }: { editMode: boolean }) => {
  const { t } = useTranslation();
  const { values, setFieldValue } = useFormikContext<CreateCompanyFormData>();

  const countryLabel = t(getCountryName(values.contactInfo?.country || ''));
  const defaultReplacementPeriod = getDefaultBluetoothSensorsReplacementPeriod(
    (values.contactInfo?.country || 'US') as CountryType
  );

  const [checkBoxChecked, setCheckBoxChecked] = useState(false);
  const [replacementPeriod, setReplacementPeriod] = useState(
    values.contractSettings?.bluetoothSensorsReplacementPeriodInMonths || defaultReplacementPeriod - 1
  );

  const previousCountry = usePrevious(values.contactInfo?.country);

  useEffect(() => {
    if (!previousCountry && editMode) {
      return;
    }
    setReplacementPeriod(defaultReplacementPeriod - 1);
    if (values.contractSettings?.usesBluetoothSensors) {
      setFieldValue('contractSettings.usesBluetoothSensors', false);
      setCheckBoxChecked(false);
    }
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [values.contactInfo?.country]);

  useEffect(() => {
    if (
      values.contractSettings?.bluetoothSensorsReplacementPeriodInMonths &&
      values.contractSettings?.bluetoothSensorsReplacementPeriodInMonths !== defaultReplacementPeriod
    ) {
      setCheckBoxChecked(true);
    }

    if (
      values.contractSettings?.bluetoothSensorsReplacementPeriodInMonths &&
      values.contractSettings?.bluetoothSensorsReplacementPeriodInMonths === defaultReplacementPeriod
    ) {
      setReplacementPeriod(defaultReplacementPeriod - 1);
    }
    /* eslint-disable react-hooks/exhaustive-deps */
  }, []);

  useEffect(() => {
    if (
      values.contractSettings?.usesBluetoothSensors &&
      !values.contractSettings?.bluetoothSensorsReplacementPeriodInMonths
    ) {
      setFieldValue(
        'contractSettings.bluetoothSensorsReplacementPeriodInMonths',
        checkBoxChecked ? replacementPeriod : defaultReplacementPeriod
      );
    }
    if (
      !values.contractSettings?.usesBluetoothSensors &&
      values.contractSettings?.bluetoothSensorsReplacementPeriodInMonths
    ) {
      setFieldValue('contractSettings.bluetoothSensorsReplacementPeriodInMonths', null);
    }
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [values.contractSettings?.usesBluetoothSensors]);

  const handleToggle = () => {
    setFieldValue('contractSettings.usesBluetoothSensors', !values.contractSettings?.usesBluetoothSensors);
  };

  const toggleChecked = (_, checked: boolean) => {
    setCheckBoxChecked(checked);
    if (checked) {
      setFieldValue('contractSettings.bluetoothSensorsReplacementPeriodInMonths', replacementPeriod);
    }
    if (!checked) {
      setReplacementPeriod(defaultReplacementPeriod - 1);
      setFieldValue('contractSettings.bluetoothSensorsReplacementPeriodInMonths', defaultReplacementPeriod);
    }
  };

  const handleChangeReplacementPeriod = (value: number) => {
    if (
      value < BLUETOOTH_SENSORS_MIN_REPLACEMENT_PERIOD_IN_MONTH ||
      value > BLUETOOTH_SENSORS_MAX_REPLACEMENT_PERIOD_IN_MONTH
    ) {
      return;
    }
    if (value > defaultReplacementPeriod - 1) {
      return;
    }
    setReplacementPeriod(value);
    setFieldValue('contractSettings.bluetoothSensorsReplacementPeriodInMonths', Number(value));
  };

  return (
    <ContractView
      usesBluetoothSensors={values.contractSettings?.usesBluetoothSensors || false}
      replacementPeriod={replacementPeriod}
      handleToggle={handleToggle}
      checkBoxChecked={checkBoxChecked}
      toggleChecked={toggleChecked}
      countryLabel={countryLabel}
      defaultReplacementPeriod={defaultReplacementPeriod}
      handleChangeReplacementPeriod={handleChangeReplacementPeriod}
      editMode={editMode}
    />
  );
};
