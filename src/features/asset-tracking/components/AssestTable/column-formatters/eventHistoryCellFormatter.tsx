import { Maybe } from '@carrier-io/lynx-fleet-types';
import { TFunction } from 'i18next';

interface EventHistoryParams {
  value?: Maybe<string | number>;
  eventName?: string;
  column?: {
    userProvidedColDef?: {
      eventName?: string;
    };
  };
}

export function eventHistoryCellFormatter(params: EventHistoryParams, t: TFunction) {
  if (!params || params.value === null) {
    return '';
  }

  switch (params?.eventName || params?.column?.userProvidedColDef?.eventName) {
    case 'rearDoor':
    case 'sideDoor':
      return params.value ? t('assets.door.status.open') : t('assets.door.status.closed');
    case 'defrost':
      return params.value === 'true' ? t('common.on') : t('common.off');
    case 'truStatus':
      return params.value ? t('common.on') : t('common.off');
    case 'inMotion':
      return params.value ? t('assets.asset.table.moving') : t('assets.asset.table.stationary');
    default:
      return '';
  }
}
