import { Feature } from 'geojson';
import mapboxgl from 'mapbox-gl';

export const getFeature = (
  eventId: string,
  map: mapboxgl.Map | undefined,
  sourceId: string
): Feature | null => {
  const features = map?.querySourceFeatures(sourceId);
  const feature = features?.find(
    (item: mapboxgl.MapboxGeoJSONFeature) => eventId === item.properties?.eventId
  );
  if (feature?.id == null || !feature.geometry) {
    return null;
  }

  return feature;
};
