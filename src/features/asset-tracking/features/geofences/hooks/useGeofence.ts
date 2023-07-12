import { useCallback, useMemo, useState } from 'react';
import { shallowEqual } from 'react-redux';
import { Maybe } from '@carrier-io/lynx-fleet-types';

import { useAppSelector } from '@/stores/hooks/useAppSelector';
import { GeofenceProperties } from '@/features/asset-tracking/types';

export function useGeofence() {
  const [geofenceProperties, setGeofenceProperties] = useState<Maybe<GeofenceProperties>>(null);
  const { geofenceGroups, geofences } = useAppSelector(
    (state) => ({
      geofenceGroups: state.geofenceGroups,
      geofences: state.geofences,
    }),
    shallowEqual
  );

  const currentGeofence = useMemo(
    () => geofences.entities?.find((item) => item.geofenceId === geofenceProperties?.id),
    [geofenceProperties?.id, geofences.entities]
  );

  const currentGroup = useMemo(
    () => geofenceGroups.entities?.find((group) => group.groupId === currentGeofence?.groupId),
    [currentGeofence?.groupId, geofenceGroups.entities]
  );

  const handleSetGeofenceProperties = useCallback((data: Maybe<GeofenceProperties>) => {
    setGeofenceProperties(data);
  }, []);

  return {
    geofence: currentGeofence,
    group: currentGroup,
    geofenceProperties,
    handleSetGeofenceProperties,
  };
}
