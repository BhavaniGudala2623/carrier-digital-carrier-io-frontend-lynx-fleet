import { shallowEqual } from 'react-redux';
import Typography from '@carrier-io/fds-react/Typography';
import Box from '@carrier-io/fds-react/Box';

import { UNASSIGNED_COLOR, getHexColor } from '../../../../../utils';

import { GeofenceGroupsState } from '@/stores/assets/geofenceGroup/slice';
import { useAppSelector } from '@/stores/hooks/useAppSelector';
import { LocationIcon } from '@/components';

interface ParamsProps {
  value?: string;
}

export function GeofenceGroupRenderer(params: ParamsProps) {
  const { entities: geofenceGroups } = useAppSelector<GeofenceGroupsState>(
    (state) => state.geofenceGroups,
    shallowEqual
  );
  const { value } = params;

  if (value) {
    const cellContent = value ?? '';
    const group = geofenceGroups?.find((element) => element.groupId === cellContent);

    return (
      <Box display="flex" alignItems="center" height="100%">
        <Box display="flex" alignItems="center" sx={{ mr: 0.5 }}>
          <LocationIcon
            colorIcon={group?.color ? getHexColor(group.color) : UNASSIGNED_COLOR}
            fontSize="small"
          />
        </Box>
        <Typography variant="body2">{group?.name || ''}</Typography>
      </Box>
    );
  }

  return <span />;
}
