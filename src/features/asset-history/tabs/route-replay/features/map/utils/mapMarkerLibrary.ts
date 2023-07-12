import startMarker from '../assets/startMarker.png';
import selectedStartMarker from '../assets/selectedStartMarker.png';
import finishMarker from '../assets/finishMarker.png';
import selectedFinishMarker from '../assets/selectedFinishMarker.png';
import hoveredStartMarker from '../assets/hoveredStartMarker.png';
import hoveredFinishMarker from '../assets/hoveredFinishMarker.png';
import {
  FINISH_MARKER_IMAGE,
  HOVERED_FINISH_MARKER_IMAGE,
  HOVERED_START_MARKER_IMAGE,
  SELECTED_FINISH_MARKER_IMAGE,
  SELECTED_START_MARKER_IMAGE,
  START_MARKER_IMAGE,
} from '../constants';

export const replayMapMarkerLibrary = [
  {
    name: START_MARKER_IMAGE,
    path: startMarker,
  },
  {
    name: FINISH_MARKER_IMAGE,
    path: finishMarker,
  },
  {
    name: SELECTED_START_MARKER_IMAGE,
    path: selectedStartMarker,
  },
  {
    name: SELECTED_FINISH_MARKER_IMAGE,
    path: selectedFinishMarker,
  },
  {
    name: HOVERED_START_MARKER_IMAGE,
    path: hoveredStartMarker,
  },
  {
    name: HOVERED_FINISH_MARKER_IMAGE,
    path: hoveredFinishMarker,
  },
];
