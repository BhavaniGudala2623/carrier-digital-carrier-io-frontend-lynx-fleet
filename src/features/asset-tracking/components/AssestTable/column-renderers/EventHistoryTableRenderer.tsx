import { Maybe } from '@carrier-io/lynx-fleet-types';
import { useTranslation } from 'react-i18next';

import { eventHistoryCellFormatter } from '../column-formatters';

interface EventHistoryParams {
  value?: Maybe<string | number>;
  eventName?: string;
  column?: {
    userProvidedColDef?: {
      eventName?: string;
    };
  };
}

function getLabelClass(params: EventHistoryParams) {
  if (!params || params.value === null) {
    return '';
  }

  switch (params?.column?.userProvidedColDef?.eventName) {
    case 'rearDoor':
    case 'sideDoor':
    case 'truStatus':
    case 'inMotion':
      return params.value ? 'info' : 'dark';
    case 'defrost':
      return params.value === 'true' ? 'info' : 'dark';
    default:
      return '';
  }
}

// todo: move to event history
export function EventHistoryTableRenderer(params: EventHistoryParams, rowClass: string) {
  const { value } = params;
  const { t } = useTranslation();

  if (value !== null) {
    return <span />;
  }

  const cellContent = eventHistoryCellFormatter(params, t);
  const labelClass = getLabelClass(params);
  const lightLabelClass = labelClass ? `label-light-${labelClass}` : '';
  const className = `label label-lg ${lightLabelClass} label-inline ${rowClass}`;

  return <span className={className}>{cellContent}</span>;
}
