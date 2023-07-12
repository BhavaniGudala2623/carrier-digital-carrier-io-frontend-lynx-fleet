import { DeleteGeofenceGroupModeType, GeofenceGroupColor } from '@carrier-io/lynx-fleet-types';

export interface GeofenceGroupFormData {
  name: string;
  color?: GeofenceGroupColor;
}

export interface DeleteGeofenceGroupFormData {
  mode: DeleteGeofenceGroupModeType;
}
