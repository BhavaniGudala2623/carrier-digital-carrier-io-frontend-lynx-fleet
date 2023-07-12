import i18n from 'i18next';
import { Chip } from '@carrier-io/fds-react';

import { IEventHistoryParams } from './types';
import { getTRUStaus, isTruOn } from './utils';

export function getEventCellContent(
  params: IEventHistoryParams,
  isFeatureCompartmentOnOffModeEnabled: boolean
): string | null {
  if (!params || params.value === null) {
    return null;
  }

  const powerStatus = isTruOn(params);
  let compartmentStatus;
  if (isFeatureCompartmentOnOffModeEnabled) {
    if (powerStatus !== undefined && powerStatus !== null) {
      compartmentStatus = params.value && powerStatus ? i18n.t('common.on') : i18n.t('common.off');
    } else {
      compartmentStatus = i18n.t('asset.data.n-a');
    }
  }

  switch (params?.eventName || params?.column?.userProvidedColDef?.eventName) {
    case 'rearDoor':
    case 'sideDoor':
      return params.value ? i18n.t('assets.door.status.open') : i18n.t('assets.door.status.closed');
    case 'defrost':
      return params.value ? i18n.t('common.on') : i18n.t('common.off');
    case 'c1On':
    case 'c2On':
    case 'c3On':
      return compartmentStatus;
    case 'truStatus':
      return params.value ? i18n.t('common.on') : i18n.t('common.off');
    case 'inMotion':
      return params.value ? i18n.t('assets.asset.table.moving') : i18n.t('assets.asset.table.stationary');
    case 'powerMode':
      if (powerStatus) {
        return params.value ? i18n.t('asset.data.standby') : i18n.t('asset.data.engine');
      }

      return null;
    case 'controlMode':
      if (powerStatus) {
        return params.value ? i18n.t('asset.data.continuous') : i18n.t('asset.data.start-stop');
      }

      return null;
    case 'geofence':
      return params.value as string;
    default:
      return null;
  }
}

function shouldHiglight(params, isFeatureCompartmentOnOffModeEnabled: boolean) {
  if (!params || params.value === null) {
    return null;
  }
  const { value } = params;

  switch (params?.column?.userProvidedColDef?.eventName) {
    case 'powerMode':
      return !value;
    case 'controlMode':
    case 'c1On':
    case 'c2On':
    case 'c3On':
      return isFeatureCompartmentOnOffModeEnabled ? !!getTRUStaus(params) : Boolean(value);
    case 'rearDoor':
    case 'sideDoor':
    case 'truStatus':
    case 'inMotion':
      return Boolean(value);
    case 'defrost':
      return value;
    default:
      return false;
  }
}

function displayGeofenceValue(value: IEventHistoryParams['value']) {
  if (!value || value === 'NONE') {
    return i18n.t('notifications.none');
  }

  // Negative lookahead regex to add space btw comma separated geofences temp table (multi-geofence)
  return (value as string).replace(/,(?!\s)/g, ', ');
}

export function EventHistoryTableFormatter(
  params: IEventHistoryParams,
  rowClass: string | undefined,
  isFeatureCompartmentOnOffModeEnabled: boolean
) {
  const { value, eventName, column } = params;

  if (eventName === 'geofence' || column?.userProvidedColDef?.eventName === 'geofence') {
    return displayGeofenceValue(value);
  }
  const cellContent = getEventCellContent(params, isFeatureCompartmentOnOffModeEnabled);
  if (cellContent !== null) {
    return (
      <Chip
        color={shouldHiglight(params, isFeatureCompartmentOnOffModeEnabled) ? 'primary' : 'secondary'}
        label={cellContent}
        size="small"
        lightBackground
        className={rowClass}
      />
    );
  }

  return <span />;
}
