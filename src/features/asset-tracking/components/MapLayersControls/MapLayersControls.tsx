import Box from '@carrier-io/fds-react/Box';
import LayersIcon from '@mui/icons-material/Layers';
import SvgIcon from '@carrier-io/fds-react/SvgIcon';
import { useCallback, useState, memo } from 'react';
import Tooltip from '@carrier-io/fds-react/Tooltip';
import { useTranslation } from 'react-i18next';

import { LayersPopover } from '../LayersPopover';
import { useDrawControls } from '../../features/geofences';

import { HasPermission } from '@/features/authorization';
import { PolygonIcon } from '@/icons/PolygonIcon';
import { CircleIcon } from '@/icons/CircleIcon';
import { useAppSelector } from '@/stores';
import { selectGeofenceGroupsFilters } from '@/stores/assets/geofenceGroup';
import { getAuthTenantId } from '@/features/authentication';

const iconSx = {
  width: '20px',
  height: '20px',
  color: 'action.active',
};

const buttonStyles = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

export const MapLayersControls = memo(() => {
  const { t } = useTranslation();

  const authTenantId = useAppSelector(getAuthTenantId);
  const filterGroups = useAppSelector(selectGeofenceGroupsFilters);

  const [legendAnchorEl, setLegendAnchorEl] = useState(null);

  const { drawMode, handleDrawModeChange } = useDrawControls();

  const handleLayersPopoverClose = useCallback(() => setLegendAnchorEl(null), []);

  const handleClickLayers = (e) => {
    setLegendAnchorEl(e.currentTarget);
  };

  return (
    <Box position="absolute" top="10px" right="10px">
      <Box className="mapboxgl-ctrl mapboxgl-ctrl-group">
        <Tooltip classes={{ popper: 'MuiTooltip-popper-subheader' }} title={t('buttons.tooltip.map-layers')}>
          <button type="button" style={buttonStyles} onClick={handleClickLayers}>
            <LayersIcon sx={iconSx} />
          </button>
        </Tooltip>
        {!!filterGroups?.length && (
          <HasPermission action="geofence.create" subjectId={authTenantId} subjectType="COMPANY">
            <>
              <Tooltip
                classes={{ popper: 'MuiTooltip-popper-subheader' }}
                title={t('geofences.feature.create-polygon')}
              >
                {/* using buttons here to mimic Mapbox style */}
                <Box
                  component="button"
                  aria-label={t('geofences.feature.polygon')}
                  sx={buttonStyles}
                  style={drawMode === 'draw_polygon' ? { backgroundColor: 'rgba(0, 0, 0, 0.05)' } : undefined}
                  onClick={() => handleDrawModeChange('draw_polygon')}
                >
                  <SvgIcon sx={iconSx}>
                    <PolygonIcon sx={iconSx} />
                  </SvgIcon>
                </Box>
              </Tooltip>
              <Tooltip
                classes={{ popper: 'MuiTooltip-popper-subheader' }}
                title={t('geofences.feature.create-circle')}
              >
                <Box
                  component="button"
                  aria-label={t('geofences.feature.circle')}
                  sx={buttonStyles}
                  style={drawMode === 'draw_circle' ? { backgroundColor: 'rgba(0, 0, 0, 0.05)' } : undefined}
                  onClick={() => handleDrawModeChange('draw_circle')}
                >
                  <CircleIcon sx={iconSx} />
                </Box>
              </Tooltip>
            </>
          </HasPermission>
        )}
        <LayersPopover legendAnchorEl={legendAnchorEl} onClose={handleLayersPopoverClose} />
      </Box>
    </Box>
  );
});

MapLayersControls.displayName = 'MapLayersControls';
