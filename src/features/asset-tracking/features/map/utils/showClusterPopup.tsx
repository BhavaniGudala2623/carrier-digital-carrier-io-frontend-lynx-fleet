import { createRoot } from 'react-dom/client';
import { Map } from 'mapbox-gl';

import { mapPopup } from '../mapPopup';
import { AssetClusterProperties, AssetsCluster } from '../components';

export const showClusterPopup = (map: Map, feature: mapboxgl.MapboxGeoJSONFeature) => {
  // Display a popup on hover
  // https://docs.mapbox.com/mapbox-gl-js/example/popup-on-hover/
  if (!feature) {
    return;
  }

  const { properties, geometry } = feature;
  const coordinates = (geometry as GeoJSON.Point).coordinates.slice();

  // Create tooltip node
  const tooltipNode = document.createElement('div');
  const root = createRoot(tooltipNode);

  function onLoad() {
    // Populate the popup and set its coordinates based on the feature found.
    // mapPopup.setLngLat(coordinates).setHTML(html).addTo(map);
    mapPopup
      .setMaxWidth('300')
      .setLngLat([coordinates[0], coordinates[1]])
      .setDOMContent(tooltipNode)
      .addTo(map);
  }
  // eslint-disable-next-line react/jsx-no-bind
  root.render(<AssetsCluster properties={properties as AssetClusterProperties} onLoad={onLoad} />);
};
