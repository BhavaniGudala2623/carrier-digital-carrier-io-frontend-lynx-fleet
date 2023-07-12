import { Geometry } from 'geojson';

import { EnrichedEventData, MultiEvent } from '../../../types';

export const getGeoJsonGeometry = (event: EnrichedEventData | MultiEvent): Geometry => ({
  type: 'Point',
  coordinates: [event.position_longitude!, event.position_latitude!],
});
