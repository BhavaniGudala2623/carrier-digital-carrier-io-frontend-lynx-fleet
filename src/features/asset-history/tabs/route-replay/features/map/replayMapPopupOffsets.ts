import mapboxgl from 'mapbox-gl';

export const multiEventOffset: mapboxgl.Offset = {
  top: [0, 15],
  'top-left': [7, 7],
  'top-right': [-7, 7],
  bottom: [0, -15],
  'bottom-left': [7, -7],
  'bottom-right': [-7, -7],
  left: [10, 0],
  right: [-10, 0],
};

export const startPointOffset: mapboxgl.Offset = {
  top: [0, 0],
  'top-left': [6, -9],
  'top-right': [-6, -9],
  bottom: [0, -27],
  'bottom-left': [6, -24],
  'bottom-right': [-6, -24],
  left: [9, -18],
  right: [-9, -18],
};

export const endPointOffset: mapboxgl.Offset = {
  top: [0, 0],
  'top-left': [10, -14],
  'top-right': [-10, -14],
  bottom: [0, -41],
  'bottom-left': [10, -35],
  'bottom-right': [-10, -35],
  left: [15, -25],
  right: [-15, -25],
};
