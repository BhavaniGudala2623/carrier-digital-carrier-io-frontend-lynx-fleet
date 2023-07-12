/* eslint-disable no-underscore-dangle */
import { useCallback, useEffect } from 'react';

import { GEOFENCE_LAYER_ID, GEOFENCE_MARKERS_LAYER_ID, UNASSIGNED_GROUP_ID } from '../../../constants';
import { updateGeofences, updateGeofenceLayers, removeGeofenceLayer } from '../../map/mapGeofences';
import { useGeofenceContext } from '../providers/GeofenceProvider';
import { useMap } from '../../map';

import { useAppSelector } from '@/stores';
import { GeofenceProperties } from '@/features/asset-tracking/types';

export const useGeofenceMapEffects = ({
  onGeofenceClick,
  canProcessGeofenceMarkerClick,
}: {
  onGeofenceClick: (geofenceId: string) => void;
  canProcessGeofenceMarkerClick: () => boolean;
}) => {
  const geofenceGroupsState = useAppSelector((state) => state.geofenceGroups);

  const { filters: filterGroups, entities: geofenceGroups } = geofenceGroupsState;

  const { handleSetGeofenceProperties, filteredGeofences } = useGeofenceContext();

  const { map, draw, changeMapState } = useMap();

  //  We don't use this function, but will keep this code at the moment, will review after fix mapbox bug
  const handleGeofenceClick = useCallback(
    (e: mapboxgl.MapMouseEvent) => {
      if (!canProcessGeofenceMarkerClick()) {
        return;
      }

      const features = map?.queryRenderedFeatures(e.point);

      if (features && features[0].geometry.type === 'Polygon') {
        const { properties } = features[0];
        const addedFeatures = draw?.add(features[0]) ?? [];
        draw?.changeMode('direct_select', { featureId: addedFeatures[0] });

        const geofenceData: GeofenceProperties = {
          id: properties?.geofenceId ?? '',
          longitude: e.lngLat.lng,
          latitude: e.lngLat.lat,
          lastUpdate: new Date().getTime(),
        };
        handleSetGeofenceProperties(geofenceData);
        onGeofenceClick(properties?.geofenceId);
      }
    },
    [map, draw, handleSetGeofenceProperties, onGeofenceClick, canProcessGeofenceMarkerClick]
  );

  const handleGeofenceMarkerClick = useCallback(
    (e: mapboxgl.MapMouseEvent) => {
      if (!canProcessGeofenceMarkerClick()) {
        return;
      }

      const features = map?.queryRenderedFeatures(e.point);

      if (
        features &&
        features[0].geometry.type === 'Point' &&
        features[0].layer.id.includes(GEOFENCE_MARKERS_LAYER_ID)
      ) {
        const { properties, geometry } = features[0];
        const { coordinates } = geometry;

        const geofenceData: GeofenceProperties = {
          id: properties?.geofenceId ?? '',
          longitude: coordinates[0],
          latitude: coordinates[1],
          lastUpdate: new Date().getTime(),
        };

        handleSetGeofenceProperties(geofenceData);
        onGeofenceClick(properties?.geofenceId);
      }
    },
    [map, handleSetGeofenceProperties, onGeofenceClick, canProcessGeofenceMarkerClick]
  );

  useEffect(() => {
    if (map && geofenceGroups) {
      geofenceGroups.forEach((geofenceGroup) => {
        // Keep this commented code at the moment, will review after fix mapbox bug
        // map.on('click', GEOFENCE_LAYER_ID + geofenceGroup.groupId, handleGeofenceClick);
        map.on('click', GEOFENCE_MARKERS_LAYER_ID + geofenceGroup.groupId, handleGeofenceMarkerClick);
      });

      // Keep this commented code at the moment, will review after fix mapbox bug
      // map.on('click', GEOFENCE_LAYER_ID + UNASSIGNED_GROUP_ID, handleGeofenceClick);
      map.on('click', GEOFENCE_MARKERS_LAYER_ID + UNASSIGNED_GROUP_ID, handleGeofenceMarkerClick);

      return () => {
        geofenceGroups.forEach((geofenceGroup) => {
          removeGeofenceLayer(map, GEOFENCE_LAYER_ID + geofenceGroup.groupId);
          removeGeofenceLayer(map, GEOFENCE_MARKERS_LAYER_ID + geofenceGroup.groupId);
          // Keep this commented code at the moment, will review after fix mapbox bug
          // map.off('click', GEOFENCE_LAYER_ID + geofenceGroup.groupId, handleGeofenceClick);
          map.off('click', GEOFENCE_MARKERS_LAYER_ID + geofenceGroup.groupId, handleGeofenceMarkerClick);
        });

        removeGeofenceLayer(map, GEOFENCE_LAYER_ID + UNASSIGNED_GROUP_ID);
        removeGeofenceLayer(map, GEOFENCE_MARKERS_LAYER_ID + UNASSIGNED_GROUP_ID);
        // Keep this commented code at the moment, will review after fix mapbox bug
        // map.off('click', GEOFENCE_LAYER_ID + UNASSIGNED_GROUP_ID, handleGeofenceClick);
        map.off('click', GEOFENCE_MARKERS_LAYER_ID + UNASSIGNED_GROUP_ID, handleGeofenceMarkerClick);
      };
    }

    return undefined;
  }, [map, handleGeofenceClick, geofenceGroups, handleGeofenceMarkerClick]);

  const onGeofencesCreated = useCallback(() => {
    changeMapState('geofencesCreated', true);
  }, [changeMapState]);

  useEffect(() => {
    if (filteredGeofences && map && geofenceGroups) {
      updateGeofences(map, filteredGeofences, onGeofencesCreated);
      updateGeofenceLayers(map, geofenceGroups, filterGroups);
    }
  }, [map, filteredGeofences, geofenceGroups, filterGroups, onGeofencesCreated]);
};
