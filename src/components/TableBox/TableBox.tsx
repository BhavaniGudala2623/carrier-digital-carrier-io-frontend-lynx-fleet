import Box from '@carrier-io/fds-react/Box';
import { ReactNode } from 'react';

interface TableBoxProps {
  children?: ReactNode;
}

export const TableBox = ({ children }: TableBoxProps) => (
  <Box
    display="flex"
    paddingLeft={2}
    paddingTop={2}
    paddingRight={2}
    paddingBottom={1}
    position="relative"
    height="100%"
    width="100%"
    flexDirection="column"
    sx={{
      backgroundColor: 'background.desktop',
      overflowY: 'hidden',
    }}
  >
    {children}
  </Box>
);
