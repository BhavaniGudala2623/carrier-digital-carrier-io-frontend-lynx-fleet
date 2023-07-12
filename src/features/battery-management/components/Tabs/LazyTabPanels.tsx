import { SxProps } from '@carrier-io/fds-react/styles';
import { CSSProperties, PropsWithChildren, ReactElement, useRef } from 'react';
import Box from '@carrier-io/fds-react/Box';

import { getSelectedTab } from '../../stores';

import { useAppSelector } from '@/stores';

type LazyProps = {
  visible: boolean;
  panelSx?: SxProps;
};

function Lazy({ visible, children, panelSx }: PropsWithChildren<LazyProps>) {
  const rendered = useRef(visible);

  if (visible && !rendered.current) {
    rendered.current = true;
  }

  if (!rendered.current) {
    return null;
  }

  const styles: CSSProperties = {};

  if (!visible) {
    styles.display = 'none';
  }

  return (
    <Box sx={panelSx} style={styles}>
      {children}
    </Box>
  );
}

export const LazyTabPanel = ({
  tabId,
  children,
  panelSx = {},
}: {
  tabId: string | number;
  children: ReactElement;
  panelSx?: SxProps;
}) => {
  const selectedTab = useAppSelector(getSelectedTab);

  return (
    <Lazy visible={tabId === selectedTab} panelSx={panelSx}>
      {children}
    </Lazy>
  );
};
