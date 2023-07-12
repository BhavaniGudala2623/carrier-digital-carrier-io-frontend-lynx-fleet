import { PropsWithChildren, useCallback, useEffect, useRef, useState, MutableRefObject } from 'react';
import mapboxgl, { Popup, LngLatLike } from 'mapbox-gl';
import Paper from '@carrier-io/fds-react/Paper';

import { MapboxPopupContext } from './provider';

import './styles.scss';

interface CreatePopupProps {
  maxWidth: string;
  popupRef: MutableRefObject<HTMLDivElement | null>;
  coordinates?: LngLatLike;
}

interface MapboxPopupWrapperProps extends PropsWithChildren<{}> {
  map: mapboxgl.Map;
  onClose?: () => void;
  handleCreatePopup: (props: CreatePopupProps) => Popup | null;
  coordinates?: LngLatLike;
}

export const MapboxPopupWrapper = ({
  children,
  map,
  onClose,
  handleCreatePopup,
  coordinates,
}: MapboxPopupWrapperProps) => {
  const [popup, setPopup] = useState<mapboxgl.Popup | null>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);

  const handleClose = useCallback(() => {
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (map && popupRef && popupRef.current) {
      const newPopup = handleCreatePopup({ popupRef, maxWidth: '270px', coordinates });

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
  }, [handleClose, handleCreatePopup, map, coordinates]);

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
