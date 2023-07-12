import { Feature, FeatureCollection } from 'geojson';
import mapboxgl, { GeoJSONSource } from 'mapbox-gl';

export function updateMapSourceData(
  map: mapboxgl.Map,
  sourceName: string,
  data: FeatureCollection | Feature
) {
  const source = map.getSource(sourceName) as GeoJSONSource | undefined;

  if (source) {
    source.setData(data);
  }
}
