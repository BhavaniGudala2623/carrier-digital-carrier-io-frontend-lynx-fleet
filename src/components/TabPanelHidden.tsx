import Box from '@carrier-io/fds-react/Box';
import { SxProps } from '@carrier-io/fds-react/styles';
import { ReactElement } from 'react';

export const TabPanelHidden = ({
  children,
  value,
  selectedTab,
  sx,
}: {
  children: ReactElement | ReactElement[];
  value: string | number;
  selectedTab: string | number;
  sx: SxProps;
}) => (
  <Box hidden={value !== selectedTab} sx={sx}>
    {value === selectedTab ? children : null}
  </Box>
);
