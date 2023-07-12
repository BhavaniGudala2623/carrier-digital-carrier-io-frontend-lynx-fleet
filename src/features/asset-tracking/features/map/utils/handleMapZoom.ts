import { mapPopup } from '../mapPopup';

export function handleMapZoom() {
  if (mapPopup.isOpen()) {
    mapPopup.remove();
  }
}
