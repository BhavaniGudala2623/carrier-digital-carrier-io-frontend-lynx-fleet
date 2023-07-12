import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import IconButton from '@carrier-io/fds-react/IconButton';
import Typography from '@carrier-io/fds-react/Typography';
import Box from '@carrier-io/fds-react/Box';
import { Geofence, GeofenceGroup } from '@carrier-io/lynx-fleet-types';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';

import { useMapboxPopup } from '../../../components/MapboxPopupWrapper/provider';
import {
  getFeaturePolygonFromGeofence,
  getPolygonPerimeter,
  getPolygonSquare,
  unitsMap,
} from '../../../utils/polygon';
import { getHexColor, UNASSIGNED_COLOR, getGeofenceAddressByLanguage } from '../../../utils';

import { LocationIcon } from '@/components';
import { useAppSelector } from '@/stores';
import { getAuthTenantId } from '@/features/authentication';
import { useUserSettings } from '@/providers/UserSettings';
import { defAppPreferences } from '@/constants';
import { HasPermission } from '@/features/authorization';
import { useApplicationContext } from '@/providers/ApplicationContext';

interface GeofenceDetailsPopupProps {
  geofence?: Geofence;
  group?: GeofenceGroup;
  onEdit: () => void;
  onDelete: () => void;
}

export const GeofenceDetailsPopup = ({ group, geofence, onDelete, onEdit }: GeofenceDetailsPopupProps) => {
  const { t } = useTranslation();
  const popup = useMapboxPopup();
  const { appLanguage } = useApplicationContext();

  const tenantId = useAppSelector(getAuthTenantId);

  const { userSettings } = useUserSettings();
  const { distance = defAppPreferences.distance } = userSettings;

  const unitsLabel = `geofences.${distance.toLowerCase()}-units`;

  const polygonProperties = useMemo(() => {
    if (geofence) {
      const polygonFeature = getFeaturePolygonFromGeofence(geofence);
      const perimeter = getPolygonPerimeter(polygonFeature, unitsMap[distance]);
      const square = getPolygonSquare(polygonFeature, unitsMap[distance]);

      return {
        perimeter,
        square,
      };
    }

    return null;
  }, [distance, geofence]);

  const handleEditCallback = useCallback(() => {
    onEdit();
    if (popup) {
      popup.remove();
    }
  }, [onEdit, popup]);

  const handleDeleteCallback = useCallback(() => {
    onDelete();
    if (popup) {
      popup.remove();
    }
  }, [onDelete, popup]);

  const geofenceAddress = geofence && getGeofenceAddressByLanguage(geofence, appLanguage);

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: '0.8fr 4fr 1fr',
        px: 1.5,
        py: 1,
      }}
    >
      <LocationIcon
        fontSize="small"
        colorIcon={group?.color ? getHexColor(group.color) : UNASSIGNED_COLOR}
        sx={{
          mt: 1,
        }}
      />

      <Box display="flex" flexDirection="column">
        <Box display="flex" flexDirection="column" mb={2} sx={{ wordBreak: 'break-all' }}>
          <Typography variant="subtitle1" color="text.primary">
            {geofence?.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {group?.name || t('geofences.geofence-ungrouped')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {geofenceAddress}
          </Typography>
        </Box>
        <Box display="flex" flexDirection="column">
          <div>
            <Typography variant="caption" color="text.disabled" mr={1}>
              {` ${t('geofences.area')}`}
            </Typography>
            <Typography variant="caption" color="text.primary">
              {`${polygonProperties?.square} ${t(unitsLabel)}`}
              <sup>2</sup>
            </Typography>
          </div>
          <div>
            <Typography variant="caption" color="text.disabled" mr={1}>
              {` ${t('geofences.perimeter')}`}
            </Typography>
            <Typography variant="caption" color="text.primary">
              {`${polygonProperties?.perimeter} ${t(unitsLabel)}`}
            </Typography>
          </div>
        </Box>
      </Box>

      <Box display="flex" alignItems="flex-start" justifyContent="flex-end" mt={0.5} ml={1}>
        <HasPermission action="geofence.edit" subjectId={tenantId} subjectType="COMPANY">
          <IconButton onClick={handleEditCallback} aria-label={t('geofences.edit-geofence')} size="small">
            <EditIcon sx={{ fontSize: '1rem' }} />
          </IconButton>
        </HasPermission>
        <HasPermission action="geofence.delete" subjectId={tenantId} subjectType="COMPANY">
          <IconButton
            sx={{ ml: 1 }}
            onClick={handleDeleteCallback}
            aria-label={t('geofences.delete-geofence')}
            size="small"
          >
            <DeleteIcon sx={{ fontSize: '1rem' }} />
          </IconButton>
        </HasPermission>
      </Box>
    </Box>
  );
};

GeofenceDetailsPopup.displayName = 'GeofenceDetailsPopup';
