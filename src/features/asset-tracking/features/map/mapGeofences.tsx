/* eslint-disable no-underscore-dangle */
import mapboxgl, { GeoJSONSource, MapLayerMouseEvent } from 'mapbox-gl';
import bbox from '@turf/bbox';
import { GeofenceGroup, Geofence } from '@carrier-io/lynx-fleet-types';

import { geofenceDataToGeoJSON } from '../../utils/polygon';
import { mapMarkerLibrary } from '../../utils/mapMarkerLibrary';
import { getAbstractColorName, getHexColor, UNASSIGNED_COLOR } from '../../utils';
import {
  GEOFENCE_LAYER_ID,
  GEOFENCE_MARKERS_LAYER_ID,
  GEOFENCE_POINTS_SOURCE_NAME,
  GEOFENCES_SOURCE_NAME,
  UNASSIGNED_GROUP_ID,
} from '../../constants';

export function updateGeofenceLayer(map: mapboxgl.Map, groupId: string | null, color: string | null) {
  const markerImage = color ? `marker-${getAbstractColorName(color)}` : 'marker-color9';
  const layerGroupId = groupId || UNASSIGNED_GROUP_ID;
  const fillColor = color ? getHexColor(color) : UNASSIGNED_COLOR;

  if (
    map.getLayer(GEOFENCE_LAYER_ID + layerGroupId) &&
    map.getLayer(GEOFENCE_MARKERS_LAYER_ID + layerGroupId)
  ) {
    map.setPaintProperty(GEOFENCE_LAYER_ID + layerGroupId, 'fill-color', fillColor);
    map.setLayoutProperty(GEOFENCE_MARKERS_LAYER_ID + layerGroupId, 'icon-image', markerImage);
  }
}

function handleMouseEnterGeofence(event: MapLayerMouseEvent) {
  // eslint-disable-next-line no-param-reassign
  event.target.getCanvas().style.cursor = 'pointer';
}

function handleMouseLeaveGeofence(event: MapLayerMouseEvent) {
  // eslint-disable-next-line no-param-reassign
  event.target.getCanvas().style.cursor = '';
}

export function createGeofenceLayer(map: mapboxgl.Map, groupId: string | null, color: string | null) {
  const markerImage = color ? `marker-${getAbstractColorName(color)}` : 'marker-color9';
  const layerGroupId = groupId || UNASSIGNED_GROUP_ID;
  const fillColor = color ? getHexColor(color) : UNASSIGNED_COLOR;

  map.addLayer({
    id: GEOFENCE_LAYER_ID + layerGroupId,
    type: 'fill',
    source: GEOFENCES_SOURCE_NAME,
    filter: ['==', 'groupId', groupId],
    layout: {
      visibility: 'none',
    },
    paint: {
      'fill-color': fillColor,
      'fill-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 0.7, 0.2],
    },
  });

  map.addLayer({
    id: GEOFENCE_MARKERS_LAYER_ID + layerGroupId,
    type: 'symbol',
    source: GEOFENCE_POINTS_SOURCE_NAME,
    filter: ['==', 'groupId', groupId],
    layout: {
      visibility: 'none',
      'text-allow-overlap': true,
      'text-ignore-placement': true,
      'icon-allow-overlap': true,
      'icon-ignore-placement': true,
      'icon-image': markerImage,
    },
  });

  // Keep this commented code at the moment, will review after fix mapbox bug
  // map.on('mouseenter', GEOFENCE_LAYER_ID + layerGroupId, handleMouseEnterGeofence);
  // map.on('mouseleave', GEOFENCE_LAYER_ID + layerGroupId, handleMouseLeaveGeofence);

  map.on('mouseenter', GEOFENCE_MARKERS_LAYER_ID + layerGroupId, handleMouseEnterGeofence);
  map.on('mouseleave', GEOFENCE_MARKERS_LAYER_ID + layerGroupId, handleMouseLeaveGeofence);
}

export function updateGeofenceLayers(
  map: mapboxgl.Map,
  geofenceGroups: GeofenceGroup[],
  filter_groupid: string[]
) {
  geofenceGroups.forEach((group) => {
    const visibilityState = filter_groupid?.indexOf(group.groupId) > -1 ? 'visible' : 'none';
    let layerCreated = true;
    // @ts-ignore
    if (map.style && map.style._loaded && map.getLayer(GEOFENCE_MARKERS_LAYER_ID + group.groupId)) {
      map.setLayoutProperty(GEOFENCE_MARKERS_LAYER_ID + group.groupId, 'visibility', visibilityState);
    } else {
      layerCreated = false;
    }
    // @ts-ignore
    if (map.style && map.style._loaded && map.getLayer(GEOFENCE_LAYER_ID + group.groupId)) {
      map.setLayoutProperty(GEOFENCE_LAYER_ID + group.groupId, 'visibility', visibilityState);
    } else {
      layerCreated = false;
    }

    if (!layerCreated) {
      createGeofenceLayer(map, group.groupId, group.color);
      map.setLayoutProperty(GEOFENCE_MARKERS_LAYER_ID + group.groupId, 'visibility', visibilityState);
      map.setLayoutProperty(GEOFENCE_LAYER_ID + group.groupId, 'visibility', visibilityState);
    } else {
      updateGeofenceLayer(map, group.groupId, group.color);
    }
  });
  const visibilityState = filter_groupid.indexOf(UNASSIGNED_GROUP_ID) > -1 ? 'visible' : 'none';
  let layerCreated = true;
  // @ts-ignore
  if (map.style && map.style._loaded && map.getLayer(GEOFENCE_MARKERS_LAYER_ID + UNASSIGNED_GROUP_ID)) {
    map.setLayoutProperty(GEOFENCE_MARKERS_LAYER_ID + UNASSIGNED_GROUP_ID, 'visibility', visibilityState);
  } else {
    layerCreated = false;
  }
  // @ts-ignore
  if (map.style && map.style._loaded && map.getLayer(GEOFENCE_LAYER_ID + UNASSIGNED_GROUP_ID)) {
    map.setLayoutProperty(GEOFENCE_LAYER_ID + UNASSIGNED_GROUP_ID, 'visibility', visibilityState);
  } else {
    layerCreated = false;
  }

  if (!layerCreated) {
    createGeofenceLayer(map, '', null);
  }
}

export function updateGeofences(
  map: mapboxgl.Map,
  geofences: Geofence[] | null,
  onGeofencesCreated: () => void
) {
  const geofenceSource = map.getSource(GEOFENCES_SOURCE_NAME) as GeoJSONSource;
  const { geofencePolygons, geofenceDataPoints } = geofenceDataToGeoJSON(geofences);
  if (geofenceSource) {
    geofenceSource.setData(geofencePolygons);
  } else {
    map.addSource(GEOFENCES_SOURCE_NAME, {
      type: 'geojson',
      data: geofencePolygons,
      generateId: true,
    });
  }

  const geofencePointsSource =
    // @ts-ignore
    map && map.style && (map.getSource(GEOFENCE_POINTS_SOURCE_NAME) as GeoJSONSource);
  if (geofencePointsSource) {
    geofencePointsSource.setData(geofenceDataPoints);
  } else {
    mapMarkerLibrary.forEach((marker) => {
      map.loadImage(marker.path, (error, image) => {
        if (error) {
          throw error;
        }
        if (image) {
          map.addImage(marker.name, image);
        } else {
          // eslint-disable-next-line no-console
          console.warn(`could not load ${marker.name} image`);
        }
      });
    });
    map.addSource(GEOFENCE_POINTS_SOURCE_NAME, {
      type: 'geojson',
      data: geofenceDataPoints,
    });
    onGeofencesCreated();
  }
}

export function removeGeofenceLayer(map, groupId) {
  const layerGroupId = groupId || UNASSIGNED_GROUP_ID;
  // @ts-ignore
  if (map.style && map.style._loaded && map.getLayer(GEOFENCE_LAYER_ID + groupId)) {
    map.removeLayer(GEOFENCE_LAYER_ID + groupId);
  }
  // @ts-ignore
  if (map.style && map.style._loaded && map.getLayer(GEOFENCE_MARKERS_LAYER_ID + groupId)) {
    map.removeLayer(GEOFENCE_MARKERS_LAYER_ID + groupId);
  }

  // Keep this commented code at the moment, will review after fix mapbox bug
  // map.off('mouseenter', GEOFENCE_LAYER_ID + layerGroupId, handleMouseEnterGeofence);
  // map.off('mouseleave', GEOFENCE_LAYER_ID + layerGroupId, handleMouseLeaveGeofence);

  map.off('mouseenter', GEOFENCE_MARKERS_LAYER_ID + layerGroupId, handleMouseEnterGeofence);
  map.off('mouseleave', GEOFENCE_MARKERS_LAYER_ID + layerGroupId, handleMouseLeaveGeofence);
}

export const flyToGeofence = (map: mapboxgl.Map | null, geofenceId: string) => {
  if (!map) {
    return;
  }

  const geofenceGeoJson = map.getSource(GEOFENCES_SOURCE_NAME) as GeoJSONSource;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const geofenceFeature = (geofenceGeoJson as any)._data.features.find(
    (feature) => feature.properties.geofenceId === geofenceId
  );
  if (geofenceFeature) {
    const bounds = bbox(geofenceFeature);
    // @ts-ignore
    map.fitBounds(bounds, { padding: { top: 150, bottom: 50, left: 50, right: 50 } });
  } else {
    // eslint-disable-next-line no-console
    console.error('flyToGeofence: feature not found');
  }
};
