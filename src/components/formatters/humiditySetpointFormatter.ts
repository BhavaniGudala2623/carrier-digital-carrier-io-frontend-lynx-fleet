import { ValueFormatterParams } from '@ag-grid-community/core';
import { TFunction } from 'i18next';

export function humiditySetpointFormatter(props: ValueFormatterParams, t: TFunction): string {
  const { value } = props;

  if (value === null || value === undefined) {
    return '';
  }

  if (Number(value) === 12345) {
    return t('asset.data.n-a');
  }

  return `${value}`;
}

export function truAwareHumiditySetpointFormatter(props: ValueFormatterParams, t: TFunction): string {
  if (props.data?.synthetic_tru_status === 'ON') {
    return humiditySetpointFormatter(props, t);
  }

  return '';
}
