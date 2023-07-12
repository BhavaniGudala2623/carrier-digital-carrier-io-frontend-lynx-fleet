import { FeatureCollection, Geometry } from 'geojson';
import { LngLatBounds } from 'mapbox-gl';

import { mapOptions } from '../../../constants';

import { AssetFeatureProperties } from '@/features/asset-tracking/types';

export const flyToAssets = (
  map: mapboxgl.Map | null,
  geoJson: FeatureCollection<Geometry, AssetFeatureProperties>,
  assetIds: string[],
  updateZoom = true
) => {
  if (!map) {
    return;
  }

  if (assetIds.length === 1) {
    const assetFeature = geoJson?.features?.find((feature) => feature?.properties?.assetId === assetIds[0]);
    if (assetFeature?.properties) {
      const properties = assetFeature?.properties;
      const coordinates = [properties.longitude, properties.latitude] as [number, number];

      if (updateZoom) {
        map.flyTo({
          center: coordinates,
          zoom: mapOptions.maxZoom! - 6,
        });
      } else {
        map.flyTo({
          center: coordinates,
        });
      }
    }
  } else {
    const assetFeatures = geoJson?.features?.filter((feature) =>
      assetIds?.includes(feature?.properties?.assetId!)
    );
    const coordinates = assetFeatures?.map(
      (feature) => [feature?.properties?.longitude, feature?.properties?.latitude] as [number, number]
    );
    const bounds = coordinates?.length
      ? coordinates.reduce(
          (newBounds, coord) => newBounds.extend(coord),
          new LngLatBounds(coordinates[0], coordinates[0])
        )
      : null;
    if (bounds) {
      map.fitBounds(bounds, { padding: { top: 50, bottom: 50, left: 50, right: 50 } });
    }
  }
};
