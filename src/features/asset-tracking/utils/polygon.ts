import turfArea from '@turf/area';
import polygonToLine from '@turf/polygon-to-line';
import turfLength from '@turf/length';
import isRingClockwise from '@turf/boolean-clockwise';
import rewind from '@turf/rewind';
import centroid from '@turf/centroid';
import { convertArea, Units } from '@turf/helpers';
import { Feature, FeatureCollection, LineString, Point, Polygon } from 'geojson';
import { Geofence, GeofenceGroup } from '@carrier-io/lynx-fleet-types';

export const unitsMap: Record<string, Units> = {
  KM: 'kilometers',
  MI: 'miles',
};

export function getPolygonSquare(feature: Feature<Polygon>, units: Units = 'kilometers') {
  return Math.round(convertArea(turfArea(feature), 'meters', units) * 100) / 100;
}

export function getPolygonPerimeter(feature: Feature<Polygon>, units: Units = 'kilometers') {
  const line = polygonToLine(feature);

  return Math.round(turfLength(line, { units }) * 100) / 100;
}
/**
 * Get Polygon object from GeoJSON Polygon Feature
 */
export function getPolygon(feature: Feature<Polygon>) {
  let coordinates = feature.geometry.coordinates[0].slice();

  if (isRingClockwise(polygonToLine<Polygon>(feature) as Feature<LineString>)) {
    coordinates = rewind(feature).geometry.coordinates[0].slice();
  }

  return [
    {
      vertices: coordinates.map((coords) => ({
        long: coords[0],
        lat: coords[1],
      })),
    },
  ];
}

export function getFeaturePolygonFromGeofence(geofence: Geofence) {
  const coordinates = geofence.polygon[0].vertices.map((vertex) => [vertex.long, vertex.lat]);

  return {
    type: 'Feature' as 'Feature',
    geometry: {
      type: 'Polygon' as 'Polygon',
      coordinates: [coordinates],
    },
    properties: {
      geofenceId: geofence.geofenceId,
      groupId: geofence.groupId || '',
      perimeter: 0,
      square: 0,
    },
  };
}

export function getGeofenceCenter(geofence: Geofence) {
  return centroid(getFeaturePolygonFromGeofence(geofence));
}

function getFeaturePointFromGeofence(geofence: Geofence) {
  const point = getGeofenceCenter(geofence);

  return {
    ...point,
    properties: {
      geofenceId: geofence.geofenceId,
      groupId: geofence.groupId || '',
      perimeter: 0,
      square: 0,
    },
  };
}
/**
 * Convert geofence data from API to GeoJSON for mapbox source.
 */
export function geofenceDataToGeoJSON(geofences: Geofence[] | null) {
  const geofencePolygons: FeatureCollection<Polygon> = {
    type: 'FeatureCollection',
    features: [],
  };

  const geofenceDataPoints: FeatureCollection<Point> = {
    type: 'FeatureCollection',
    features: [],
  };

  if (!geofences) {
    return { geofencePolygons, geofenceDataPoints };
  }

  const { points, polygons } = geofences.reduce(
    (prev, geofence) => {
      const polygonFeature = getFeaturePolygonFromGeofence(geofence);
      const pointFeature = getFeaturePointFromGeofence(geofence);

      return {
        polygons: [...prev.polygons, polygonFeature],
        points: [...prev.points, pointFeature],
      };
    },
    { polygons: [] as Feature<Polygon>[], points: [] as Feature<Point>[] }
  );

  geofenceDataPoints.features = points;
  geofencePolygons.features = polygons;

  return {
    geofencePolygons,
    geofenceDataPoints,
  };
}

export function getGeofencePoints(geofences: Geofence[] | null, geofenceGroups: GeofenceGroup[] | null) {
  const geofencesDataPoints: FeatureCollection<Point> = {
    type: 'FeatureCollection',
    features: [],
  };
  if (!geofences) {
    return geofencesDataPoints;
  }

  geofencesDataPoints.features = geofences?.map((item) => {
    const found = geofenceGroups?.find((element) => element.groupId === item.groupId);
    const color = found && found.color ? found.color : 'cyan';
    const groupName = found ? found.name : 'unassigned';
    const point = getGeofenceCenter(item);

    return {
      ...point,
      properties: {
        geofenceId: item.geofenceId,
        name: item.name,
        groupId: item.groupId || '',
        group: groupName,
        color,
      },
    };
  });

  return geofencesDataPoints;
}

export function getPolygonCenter(feature: Feature<Polygon>) {
  return centroid(feature);
}
