import { mapOptions } from '../../../constants';

export const flyToAddress = (map: mapboxgl.Map | null, coordinates: [number, number], updateZoom = true) => {
  if (!map) {
    return;
  }

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
};
