import { Feature, Geometry } from 'geojson';

import { MAX_COORDINATES_FOR_API } from '../constants';

const fetchRoute = async (coordinates: string[]): Promise<Geometry> => {
  const geometry: Geometry = { type: 'LineString', coordinates: [] };

  try {
    const requestParams = {
      coordinates: coordinates.join(';'),
      geometries: 'geojson',
      overview: 'full',
      // radiuses: coordinates.map(() => 5).join(';'), // TODO: define optimal radius
    };

    const response = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/driving?access_token=${process.env.REACT_APP_MAPBOX_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(requestParams),
      }
    );

    const data = await response.json();

    if (data.code === 'Ok' && data.routes) {
      geometry.coordinates = data.routes[0].geometry.coordinates;
    }

    return geometry;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('fetchRoute', error);
    // TODO implement error handling behavior informative and userfriendly

    return geometry;
  }
};

export const getRouteData = async (coordinates: string[]): Promise<Feature> => {
  const geoJson: Feature = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates: [],
    },
  };

  if (coordinates.length < 2) {
    return geoJson;
  }

  const geometry: Geometry = { type: 'LineString', coordinates: [] };

  const arr = [...coordinates];
  do {
    const items = arr.splice(0, MAX_COORDINATES_FOR_API);
    const geometryChunk = await fetchRoute(items);

    if (geometryChunk.type === 'LineString' && geometryChunk.coordinates) {
      geometry.coordinates = geometry.coordinates.concat(geometryChunk.coordinates);
    }
  } while (arr.length > 0);

  return { ...geoJson, geometry };
};
