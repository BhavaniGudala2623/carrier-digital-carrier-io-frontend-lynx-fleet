import { EngineControlModeType, EnginePowerModeType, TruStatusType } from '@carrier-io/lynx-fleet-types';
import { TFunction } from 'i18next';
import Chip from '@carrier-io/fds-react/Chip';

import { getLiteralTypeAsStr } from '@/utils/getLiteralTypeAsStr';
import { translateTruStatus } from '@/utils/translateTruStatus';
import { translateEnginePowerMode } from '@/utils/translateEnginePowerMode';
import { translateEngineControlMode } from '@/utils/translateEngineControlMode';

export const assetChipRenderer = (field: string | undefined, value: unknown, t: TFunction): JSX.Element => {
  if (!value || !field) {
    return <span />;
  }

  let formattedValue;
  let highlightValue;

  switch (field) {
    case 'flespiData.synthetic_tru_status':
      formattedValue = translateTruStatus(t, value as TruStatusType);
      highlightValue = getLiteralTypeAsStr<TruStatusType>('ON');
      break;

    case 'computedFields.enginePowerMode':
      formattedValue = translateEnginePowerMode(t, value as EnginePowerModeType);
      highlightValue = getLiteralTypeAsStr<EnginePowerModeType>('Engine');
      break;

    case 'computedFields.engineControlMode':
      formattedValue = translateEngineControlMode(t, value as EngineControlModeType);
      highlightValue = getLiteralTypeAsStr<EngineControlModeType>('Continuous');
      break;

    default:
      formattedValue = value;
      break;
  }

  const highlight =
    value &&
    highlightValue &&
    typeof value === 'string' &&
    typeof highlightValue === 'string' &&
    value.toUpperCase() === highlightValue.toUpperCase();

  return (
    <Chip color={highlight ? 'primary' : 'secondary'} lightBackground size="small" label={formattedValue} />
  );
};
