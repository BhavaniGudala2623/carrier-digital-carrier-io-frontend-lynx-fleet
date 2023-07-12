import Box from '@carrier-io/fds-react/Box';
import { CSSProperties, ReactElement } from 'react';
import { SxProps } from '@mui/material';

import { useTabPanelsContext } from '../providers';

export const TabPanel = ({
  tabId,
  children,
  panelSx = {},
}: {
  tabId: string | number;
  children: ReactElement;
  panelSx?: SxProps;
}) => {
  const { selectedTab, shouldUnmount } = useTabPanelsContext();

  const isSelected = tabId === selectedTab;

  if (shouldUnmount) {
    return <Box sx={panelSx}>{isSelected && children}</Box>;
  }

  const styles: CSSProperties = {};

  if (!isSelected) {
    styles.display = 'none';
  }

  return (
    <Box sx={panelSx} style={styles}>
      {children}
    </Box>
  );
};
