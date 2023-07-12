import Box from '@carrier-io/fds-react/Box';

import './mapbox.scss';

export const Map = ({ containerId }: { containerId: string }) => (
  <Box id={containerId} sx={{ position: 'relative', top: 0, left: 0, height: '100%', overflow: 'hidden' }} />
);
