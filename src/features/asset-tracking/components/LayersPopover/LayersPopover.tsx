import Popover from '@carrier-io/fds-react/Popover';
import Box from '@carrier-io/fds-react/Box';

import { GeofenceLayers } from '../../features/geofences';

import { AssetLayers } from './AssetLayers';

import { HasPermission } from '@/features/authorization';
import { useAppSelector } from '@/stores';
import { getAuthTenantId } from '@/features/authentication';

export const LayersPopover = ({
  legendAnchorEl,
  onClose,
}: {
  legendAnchorEl: HTMLElement | null;
  onClose: () => void;
}) => {
  const tenantId = useAppSelector(getAuthTenantId);
  const openLegend = Boolean(legendAnchorEl);
  const legendId = openLegend ? 'legend-popover' : undefined;

  return (
    <Popover
      id={legendId}
      open={openLegend}
      anchorEl={legendAnchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      <Box sx={{ padding: 1, minWidth: (theme) => theme.spacing(35) }}>
        <AssetLayers />

        <HasPermission action="geofence.groupList" subjectId={tenantId} subjectType="COMPANY">
          <GeofenceLayers />
        </HasPermission>
      </Box>
    </Popover>
  );
};
