import { Popup } from 'mapbox-gl';

import { multiEventOffset } from './replayMapPopupOffsets';

export const mapPopup = new Popup({
  closeButton: false,
  offset: multiEventOffset,
});
