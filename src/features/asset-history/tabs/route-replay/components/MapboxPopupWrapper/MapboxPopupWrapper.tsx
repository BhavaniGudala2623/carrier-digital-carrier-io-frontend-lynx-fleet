import { PropsWithChildren, useCallback, useEffect, useRef, useState, MutableRefObject } from 'react';
import mapboxgl, { LngLatLike, Popup } from 'mapbox-gl';
import Paper from '@carrier-io/fds-react/Paper';

import { MapboxPopupContext } from '../../providers/MapboxPopupProvider';
import { EnrichedEventData } from '../../types';

import './styles.scss';

export interface CreatePopupProps {
  popupRef: MutableRefObject<HTMLDivElement | null>;
  coordinates: LngLatLike;
  events?: EnrichedEventData[];
}

interface MapboxPopupWrapperProps extends PropsWithChildren<{}> {
  map: mapboxgl.Map;
  onClose?: () => void;
  handleCreatePopup: (props: CreatePopupProps) => Popup | null;
  coordinates: LngLatLike;
  events?: EnrichedEventData[];
}

export const MapboxPopupWrapper = ({
  children,
  map,
  onClose,
  handleCreatePopup,
  coordinates,
  events,
}: MapboxPopupWrapperProps) => {
  const [popup, setPopup] = useState<mapboxgl.Popup | null>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);

  const handleClose = useCallback(() => {
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (map && popupRef.current && coordinates) {
      const newPopup = handleCreatePopup({ popupRef, coordinates, events });

      if (newPopup) {
        newPopup.on('close', handleClose);
        setPopup(newPopup);
      }

      return () => {
        if (newPopup) {
          newPopup.remove();
          newPopup.off('close', handleClose);
        }
      };
    }

    return undefined;
  }, [events, handleClose, handleCreatePopup, map, coordinates]);

  return (
    /**
     * This component has to have 2 divs.
     * Because if you remove outter div, React has some difficulties
     * with unmounting this component.
     * Also `display: none` is solving that map does not jump when hovering
     */
    <div style={{ display: 'none' }}>
      <Paper ref={popupRef}>
        <MapboxPopupContext.Provider value={popup}>{children}</MapboxPopupContext.Provider>
      </Paper>
    </div>
  );
};
