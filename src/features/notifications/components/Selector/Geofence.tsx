import { useMemo } from 'react';
import TextField from '@carrier-io/fds-react/TextField';
import Autocomplete, { AutocompleteProps } from '@carrier-io/fds-react/Autocomplete';
import { useTranslation } from 'react-i18next';
import { shallowEqual } from 'react-redux';

import { useAppSelector } from '@/stores';

type GeofenceSelectorProps = Omit<AutocompleteProps, 'options' | 'renderInput' | 'value'> & {
  selectedIds: string[];
};

export function GeofenceSelector({ selectedIds, onChange, ...rest }: GeofenceSelectorProps) {
  const { t } = useTranslation();
  const { geofences, geofenceGroups } = useAppSelector(
    (state) => ({
      geofences: state.geofences,
      geofenceGroups: state.geofenceGroups,
    }),
    shallowEqual
  );

  const { entities, isLoading } = geofences;

  const { entities: groups, isLoading: isGroupsLoading } = geofenceGroups;

  const ungroupedTitle = t('geofences.geofence-ungrouped');

  const options = useMemo(
    () =>
      entities
        ?.map((geofence) => ({
          id: geofence.geofenceId,
          name: geofence.name,
          groupName: groups?.find((group) => group.groupId === geofence.groupId)?.name || ungroupedTitle,
        }))
        .sort((a, b) => {
          const compareGroupNames = a.groupName.localeCompare(b.groupName);
          if (compareGroupNames === 0) {
            return a.name.localeCompare(b.name);
          }

          return compareGroupNames;
        }) || [],
    [entities, groups, ungroupedTitle]
  );

  const value =
    entities
      ?.filter((geofence) => selectedIds.includes(geofence.geofenceId))
      .map((geofence) => ({
        id: geofence.geofenceId,
        name: geofence.name,
        groupName: groups?.find((group) => group.groupId === geofence.groupId)?.name || ungroupedTitle,
      })) || [];

  return (
    <Autocomplete
      multiple
      limitTags={1}
      options={options}
      groupBy={(option) => option.groupName}
      getOptionLabel={(option) => option.name}
      value={value}
      loading={isLoading || isGroupsLoading}
      onChange={onChange}
      isOptionEqualToValue={(option, val) => option.id === val.id}
      renderInput={(params) => <TextField {...params} label={t('notifications.select-geofences')} />}
      {...rest}
    />
  );
}
