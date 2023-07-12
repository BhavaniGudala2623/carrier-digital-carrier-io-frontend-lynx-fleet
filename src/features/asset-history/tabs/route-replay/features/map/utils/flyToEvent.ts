import mapboxgl from 'mapbox-gl';
import { Feature } from 'geojson';

export const flyToEvent = (
  pointId: Feature | number | string | null,
  coordinates: mapboxgl.LngLatLike,
  map: mapboxgl.Map,
  updateZoom?: boolean
) => {
  const currentZoom = map.getZoom();

  map.flyTo({
    center: coordinates,
    zoom: pointId != null && currentZoom < 8 ? 8 : currentZoom,
    speed: updateZoom ? 1.7 : 1.2,
  });
};
