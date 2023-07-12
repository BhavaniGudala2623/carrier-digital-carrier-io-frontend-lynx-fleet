import { GeofenceGroup, Geofence, LanguageType } from '@carrier-io/lynx-fleet-types';

import { FilterOption, Address } from '../types';

import { getGeofenceAddressByLanguage } from './getGeofenceAddressByLanguage';
import { UNASSIGNED_COLOR } from './markerColors';

import type { SnapshotDataEx } from '@/features/common';

export const getAssetsOptions = (snapshots: SnapshotDataEx[]) =>
  snapshots.reduce<FilterOption[]>((options, asset) => {
    if (asset?.asset?.id) {
      options.push({
        tenantId: asset.tenant?.id,
        label: asset.asset.name || '',
        type: 'Asset',
        value: asset.asset.id,
      });
    }

    return options;
  }, []);

export const getGeofencesOptions = (
  geofences: Geofence[],
  geofenceGroups: GeofenceGroup[],
  languageCode: LanguageType
): FilterOption[] =>
  geofences.map((geofence) => {
    const geofenceGroup = geofenceGroups.find((group) => group.groupId === geofence.groupId);

    return {
      label: geofence.name,
      type: 'Geofence',
      value: geofence.geofenceId,
      groupColor: geofenceGroup?.color || UNASSIGNED_COLOR,
      address: getGeofenceAddressByLanguage(geofence, languageCode),
      tenantId: geofence.tenantId,
    };
  });

export const getAddressOptions = (addresses: Address[]): FilterOption[] =>
  addresses.map((address) => ({
    label: address.place_name,
    type: 'Address',
    value: address.id,
    center: address.center,
  }));

export const sortAssetsFilterOptions = (options: FilterOption[]) => {
  if (options.every((item) => item.type === 'Address')) {
    return options;
  }

  return [...options].sort((a, b) => {
    if (a.type === b.type) {
      const nameA = (a?.label || '').toLowerCase();
      const nameB = (b?.label || '').toLowerCase();

      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }

      return 0;
    }
    if (a.type === 'Asset') {
      return -1;
    }

    return 1;
  });
};
