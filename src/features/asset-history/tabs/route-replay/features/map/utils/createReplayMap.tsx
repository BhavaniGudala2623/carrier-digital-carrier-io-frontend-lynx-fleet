import mapboxgl from 'mapbox-gl';

import { MAP_CENTER_DEFAULT } from '../constants';

import { MapStyleControl } from '@/components';

export function createReplayMap(
  container: mapboxgl.MapboxOptions['container'],
  onMapLoaded: (map: mapboxgl.Map) => void
) {
  const map = new mapboxgl.Map({
    center: MAP_CENTER_DEFAULT,
    zoom: 1,
    minZoom: 1,
    maxZoom: 20,
    accessToken: process.env.REACT_APP_MAPBOX_KEY,
    container,
    style: 'mapbox://styles/mapbox/streets-v11',
    attributionControl: false,
    logoPosition: 'top-left',
  });

  map.addControl(new mapboxgl.GeolocateControl(), 'bottom-right');
  map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'bottom-right');
  map.addControl(new MapStyleControl(), 'bottom-left');

  map.on('load', () => {
    onMapLoaded(map);
  });
}
