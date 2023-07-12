import { Marker } from 'mapbox-gl';
import { FeatureCollection, Geometry } from 'geojson';
import { fleetThemeOptions } from '@carrier-io/fds-react/theme';

import {
  ASSETS_SOURCE_NAME,
  mapOptions,
  SATELLITE_LAYER_ID,
  UNCLUSTERED_POINTS_LAYER,
  UNCLUSTERED_POINT_LAYER,
} from '../../../constants';
import { AssetClusterProperties } from '../components';

import { createAssetMarker } from './createAssetMarker';

import { getAssetTypes } from '@/utils';
import { AssetFeatureProperties } from '@/features/asset-tracking/types';

const { palette } = fleetThemeOptions;
const devColors = [palette.error.main, palette.success.main, palette.warning.main];

interface MarkerData {
  marker: mapboxgl.Marker;
  count: number;
}

export const createMapAssets = (
  map: mapboxgl.Map,
  data: FeatureCollection<Geometry, AssetFeatureProperties>,
  handleClusterMouseEnter: (clusterId: number) => void,
  handleClusterMouseLeave: (clusterId: number) => void,
  handleClusterClick: (clusterId: number) => void,
  handleClusterRemoveFromScreen: (clusterId: number) => void
) => {
  // https://docs.mapbox.com/mapbox-gl-js/example/cluster-html/
  // https://docs.mapbox.com/mapbox-gl-js/example/cluster/
  // filters for classifying devices into 3 categories - Alarm, Stationary, Moving
  const devAlarm = ['==', ['get', 'assetState'], 'Alarm'];
  const devMoving = ['==', ['get', 'assetState'], 'Yes'];
  const devStationary = ['==', ['get', 'assetState'], 'No'];

  map.addLayer(
    {
      id: SATELLITE_LAYER_ID,
      type: 'raster',
      layout: {
        visibility: 'none',
      },
      source: {
        type: 'raster',
        tiles: [
          `https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token=${process.env.REACT_APP_MAPBOX_KEY}`,
        ],
        tileSize: 512,
      },
      'source-layer': 'satellite',
      maxzoom: mapOptions.maxZoom,
    },
    'gl-draw-polygon-fill.cold'
  );

  map.addSource(ASSETS_SOURCE_NAME, {
    type: 'geojson',
    data,
    cluster: true,
    clusterRadius: 30,
    clusterMaxZoom: 13,
    maxzoom: mapOptions.maxZoom,
    clusterProperties: {
      devAlarm: ['+', ['case', devAlarm, 1, 0]],
      devMoving: ['+', ['case', devMoving, 1, 0]],
      devStationary: ['+', ['case', devStationary, 1, 0]],
    },
  });

  getAssetTypes().forEach((assetType, index) => {
    map.addLayer({
      id: UNCLUSTERED_POINT_LAYER + index.toString(),
      type: 'circle',
      source: ASSETS_SOURCE_NAME,
      filter: ['all', ['!', ['has', 'point_count']], ['==', ['get', 'assetState'], assetType.assetState]],
      layout: {
        visibility: 'visible',
      },
      paint: {
        'circle-color': '#000',
        'circle-radius': 10,
        'circle-stroke-width': 5,
        'circle-stroke-color': assetType.color,
      },
    });

    map.addLayer({
      id: UNCLUSTERED_POINTS_LAYER + index.toString(),
      type: 'symbol',
      source: ASSETS_SOURCE_NAME,
      filter: ['all', ['!', ['has', 'point_count']], ['==', ['get', 'assetState'], assetType.assetState]],
      layout: {
        visibility: 'visible',
        'text-field': '1',
        'text-size': 12,
        'text-allow-overlap': true,
      },
      paint: {
        'text-color': '#fff',
      },
    });
  });

  // TODO
  // objects for caching and keeping track of HTML marker objects (for performance)
  const markers: Record<string, MarkerData> = {};
  let markersOnScreen: Record<string, mapboxgl.Marker> = {};

  function updateMarkers() {
    const newMarkers = {};
    const features: mapboxgl.MapboxGeoJSONFeature[] = [];

    const clusters = map.querySourceFeatures(ASSETS_SOURCE_NAME)?.filter((item) => item.properties?.cluster);

    for (const feature of clusters) {
      if (!features.find((item) => item.properties?.cluster_id === feature.properties?.cluster_id)) {
        features.push(feature);
      }
    }

    for (const feature of features) {
      const props = feature.properties;

      if (!props?.cluster_id) {
        continue;
      }

      const clusterId = props.cluster_id as number;
      const clusterIdAsStr = clusterId.toString();
      const coords = (feature.geometry as GeoJSON.Point).coordinates;

      let marker: mapboxgl.Marker | undefined = markers[clusterIdAsStr]?.marker;
      const markerCount = markers[clusterIdAsStr]?.count;
      const pointCount = props.point_count as number;

      if (marker && markerCount !== pointCount) {
        marker.remove();
        delete markers[clusterIdAsStr];
        delete markersOnScreen[clusterIdAsStr];
        marker = undefined;
      }

      if (marker) {
        const markerLngLat = marker.getLngLat();
        if (markerLngLat.lat - coords[1] !== 0 || markerLngLat.lng - coords[0] !== 0) {
          marker.setLngLat([coords[0], coords[1]]);
        }
      } else {
        const el = createAssetMarker(props as AssetClusterProperties, devColors);

        marker = new Marker({
          element: el,
        }).setLngLat([coords[0], coords[1]]);

        const markerDiv = marker.getElement();
        markerDiv.addEventListener('mouseenter', () => {
          markerDiv.style.cursor = 'pointer';
          handleClusterMouseEnter(clusterId);
        });
        markerDiv.addEventListener('mouseleave', () => {
          markerDiv.style.cursor = '';
          handleClusterMouseLeave(clusterId);
        });
        markerDiv.addEventListener('click', () => {
          handleClusterClick(clusterId);
        });

        markers[clusterIdAsStr] = {
          marker,
          count: pointCount,
        };
      }
      newMarkers[clusterIdAsStr] = marker;

      if (!markersOnScreen[clusterIdAsStr]) {
        marker.addTo(map);
      }
    }

    // for every marker we've added previously, remove those that are no longer visible
    for (const id of Object.keys(markersOnScreen)) {
      if (!newMarkers[id]) {
        markersOnScreen[id].remove();
        handleClusterRemoveFromScreen(parseInt(id, 10));
      }
    }

    markersOnScreen = newMarkers; // TODO store markersOnScreen in the app stage
  }

  map.on('render', () => {
    if (!map.isSourceLoaded(ASSETS_SOURCE_NAME)) {
      return;
    }
    updateMarkers();
  });
};
