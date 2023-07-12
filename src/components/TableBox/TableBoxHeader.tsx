import Box from '@carrier-io/fds-react/Box';
import { ReactElement, CSSProperties } from 'react';
import Paper from '@carrier-io/fds-react/Paper';
import Divider from '@carrier-io/fds-react/Divider';
import { SxProps } from '@mui/material';

interface TableBoxHeaderProps {
  children?: ReactElement | ReactElement[];
  noBackground?: boolean;
  spaceBetween?: boolean;
  dividers?: boolean;
  sxPaper?: SxProps;
  stylePaper?: CSSProperties;
}

export const TableBoxHeader = ({
  children,
  noBackground,
  spaceBetween,
  dividers,
  sxPaper,
  stylePaper,
}: TableBoxHeaderProps) => {
  const spacingSx = spaceBetween ? { justifyContent: 'space-between' } : { gap: 2 };

  return noBackground ? (
    <Box display="flex" alignItems="center" sx={{ mb: 2, border: 'none', ...spacingSx }}>
      {children}
    </Box>
  ) : (
    <>
      <Paper
        variant="outlined"
        sx={{
          mb: 1,
          p: 1,
          border: 'none',
          minHeight: 60,
          ...sxPaper,
        }}
        style={stylePaper}
      >
        <Box display="flex" alignItems="center" sx={{ position: 'relative', ...spacingSx }}>
          {children}
        </Box>
      </Paper>
      {dividers && <Divider variant="fullWidth" />}
    </>
  );
};
