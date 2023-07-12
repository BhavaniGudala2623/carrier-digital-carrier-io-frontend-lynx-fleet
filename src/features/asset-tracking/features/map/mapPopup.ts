import { Popup } from 'mapbox-gl';

import { mapPopupOffset } from './mapPopupOffset';

export const mapPopup = new Popup({
  closeButton: false,
  offset: mapPopupOffset,
});
