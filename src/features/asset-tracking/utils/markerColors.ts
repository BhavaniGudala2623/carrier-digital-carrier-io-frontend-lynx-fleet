import { blue, grey, cyan, green, indigo, orange, pink, purple, red, yellow } from '@mui/material/colors';
import { GeofenceGroupColor } from '@carrier-io/lynx-fleet-types';

export const UNASSIGNED_COLOR = grey[500];

export const PALETTE_COLORS_MAP: Record<string, GeofenceGroupColor> = {
  [cyan[500]]: 'color8',
  [indigo.A700]: 'color1',
  [purple.A700]: 'color2',
  [green.A700]: 'color3',
  [red[200]]: 'color4',
  [red.A700]: 'color5',
  [orange.A700]: 'color6',
  [yellow.A700]: 'color7',
};

// todo remove old colors once migration is run
const OLD_COLORS_MAP: Record<string, GeofenceGroupColor> = {
  [blue[500]]: 'color1',
  [purple[500]]: 'color2',
  [green[500]]: 'color3',
  [pink[200]]: 'color4',
  [red[500]]: 'color5',
  [orange[500]]: 'color6',
  [yellow[500]]: 'color7',
  [cyan[500]]: 'color8',
};

const COLORS_MAP: Record<string, GeofenceGroupColor> = {
  ...OLD_COLORS_MAP,
  ...PALETTE_COLORS_MAP,
};

const COLOR_TO_HEX_MAP = Object.entries(PALETTE_COLORS_MAP).reduce(
  (acc, [key, value]) => ({
    ...acc,
    [value]: key,
  }),
  {}
);

export const getHexColor = (color: GeofenceGroupColor | string): string =>
  color in COLOR_TO_HEX_MAP ? COLOR_TO_HEX_MAP[color] : color;

export const getAbstractColorName = (color: GeofenceGroupColor | string): GeofenceGroupColor =>
  color in COLORS_MAP ? COLORS_MAP[color] : (color as GeofenceGroupColor);
