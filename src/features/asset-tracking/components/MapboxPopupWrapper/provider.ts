import { createContext, useContext } from 'react';
import mapboxgl from 'mapbox-gl';

export const MapboxPopupContext = createContext<mapboxgl.Popup | null>(null);

export function useMapboxPopup() {
  return useContext(MapboxPopupContext);
}
