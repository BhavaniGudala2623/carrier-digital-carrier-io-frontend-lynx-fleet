import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { ReactNode } from 'react';
import Chip from '@carrier-io/fds-react/Chip';
import Typography from '@carrier-io/fds-react/Typography';
import { ProcessCellForExportParams } from '@ag-grid-community/core';
import { Maybe, TemperatureType, CommandKey } from '@carrier-io/lynx-fleet-types';

import { temperatureFormatter } from '@/components';

const getCompartmentFromArgument = (commandType: Maybe<CommandKey>, arg: Maybe<string>) => {
  switch (commandType?.split(' ')[0]) {
    case 'Compartment':
      if (!arg) {
        return '';
      }

      if (arg.startsWith('C1')) {
        return 'C1';
      }

      if (arg.startsWith('C2')) {
        return 'C2';
      }

      return 'C3';

    case 'Toggle':
      return `C${commandType.charAt(commandType.length - 1)}`;

    default:
      return '';
  }
};

const getValueText = (temperatureUnit: TemperatureType, params, t: TFunction, format = true) => {
  let cellText = '';

  switch (params.value?.commandName) {
    case 'Compartment Setpoint':
      cellText = temperatureFormatter({ ...params, value: params.value.value }, { units: temperatureUnit });
      cellText += format ? `°${temperatureUnit}` : ` ${temperatureUnit}`;
      break;

    case 'Run Mode':
      cellText = params.value.value;
      break;

    case 'Toggle Compartment 1':
    case 'Toggle Compartment 2':
    case 'Toggle Compartment 3':
      cellText = params.value.value === 'true' ? t('common.on') : t('common.off');
      break;

    default:
      break;
  }

  return cellText;
};

export const ValueRenderer = ({ temperatureUnit, data }: { temperatureUnit: TemperatureType; data }) => {
  const { t } = useTranslation();

  const { value } = data;
  const commandName = value?.commandName;
  const element = value?.element;

  const chipText = commandName ? getCompartmentFromArgument(commandName, element) : null;

  const chip: ReactNode = chipText ? (
    <Chip label={chipText} sx={{ marginRight: '.625rem' }} color="primary" lightBackground />
  ) : null;

  const text: ReactNode = (
    <Typography variant="body2" component="div" sx={{ display: 'inline' }}>
      {getValueText(temperatureUnit, data, t, true) || '-'}
    </Typography>
  );

  return (
    <>
      {chip}
      {text}
    </>
  );
};

export const getCompartmentAndValueText = (
  temperatureUnit: TemperatureType,
  params: ProcessCellForExportParams,
  t: TFunction,
  format = true
) => {
  const { value } = params;

  const valueText = getValueText(temperatureUnit, params, t, format);
  const compartmentText = getCompartmentFromArgument(value?.commandName, value?.element);

  return compartmentText ? `${compartmentText} ${valueText}` : valueText;
};
