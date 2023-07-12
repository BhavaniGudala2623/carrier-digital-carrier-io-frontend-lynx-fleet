import { useCallback, useMemo, useState } from 'react';
import { shallowEqual } from 'react-redux';

import { useAppSelector } from '@/stores/hooks/useAppSelector';

export function useGeofenceGroup() {
  const [groupId, setGroupId] = useState<string | null>(null);
  const { geofenceGroups } = useAppSelector(
    (state) => ({
      geofenceGroups: state.geofenceGroups,
    }),
    shallowEqual
  );

  const group = useMemo(
    () => geofenceGroups.entities?.find((groupsItem) => groupsItem.groupId === groupId),
    [groupId, geofenceGroups.entities]
  );

  const handleSetGroupId = useCallback((data) => {
    setGroupId(data);
  }, []);

  return {
    group,
    groupId,
    handleSetGroupId,
  };
}
