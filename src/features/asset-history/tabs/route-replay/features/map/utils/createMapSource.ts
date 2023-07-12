import mapboxgl from 'mapbox-gl';

import {
  EDGE_POINT_SOURCE_NAME,
  MULTI_EVENT_SOURCE_NAME,
  ROUTE_SOURCE_NAME,
  SINGLE_EVENT_SOURCE_NAME,
} from '../constants';

import { getEmptyFeatureCollectionData } from './getEmptyFeatureCollectionData';
import { replayMapMarkerLibrary } from './mapMarkerLibrary';

export const createMapSource = (map: mapboxgl.Map) => {
  map.addSource(ROUTE_SOURCE_NAME, {
    type: 'geojson',
    data: getEmptyFeatureCollectionData(),
  });

  map.addSource(SINGLE_EVENT_SOURCE_NAME, {
    type: 'geojson',
    data: getEmptyFeatureCollectionData(),
    generateId: true,
  });

  map.addSource(MULTI_EVENT_SOURCE_NAME, {
    type: 'geojson',
    data: getEmptyFeatureCollectionData(),
    generateId: true,
    cluster: true,
    clusterMaxZoom: 22,
    clusterRadius: 15,
    clusterProperties: {
      eventsCounterSum: ['+', ['get', 'eventsCounter', ['properties']]],
    },
  });

  replayMapMarkerLibrary.forEach((marker) => {
    if (marker) {
      map.loadImage(marker.path, (error, image) => {
        if (error) {
          throw error;
        }

        if (image) {
          map.addImage(marker.name, image);
        } else {
          // eslint-disable-next-line no-console
          console.error(`could not load ${marker.name} image`);
        }
      });
    }
  });

  map.addSource(EDGE_POINT_SOURCE_NAME, {
    type: 'geojson',
    data: getEmptyFeatureCollectionData(),
    generateId: true,
  });
};
