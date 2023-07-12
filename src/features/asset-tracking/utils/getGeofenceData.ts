import { Geofence, Maybe } from '@carrier-io/lynx-fleet-types';

import { GeofenceProperties } from '../types';

export function getGeofenceData(geofence: Geofence): Maybe<GeofenceProperties> {
  return geofence.center
    ? {
        id: geofence.geofenceId,
        longitude: geofence.center.long,
        latitude: geofence.center.lat,
        lastUpdate: new Date().getTime(),
      }
    : null;
}
