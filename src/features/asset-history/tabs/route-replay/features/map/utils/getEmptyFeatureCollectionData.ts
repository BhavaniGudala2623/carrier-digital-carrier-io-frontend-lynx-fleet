import { FeatureCollection } from 'geojson';

export const getEmptyFeatureCollectionData = (): FeatureCollection => ({
  type: 'FeatureCollection',
  features: [],
});
