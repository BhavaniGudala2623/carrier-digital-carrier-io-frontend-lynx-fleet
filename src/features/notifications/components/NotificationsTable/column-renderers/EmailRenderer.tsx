import { Check } from '@mui/icons-material';
import { ICellRendererParams } from '@ag-grid-community/core';
import Box from '@carrier-io/fds-react/Box';

export function EmailRenderer({ value }: ICellRendererParams) {
  return value ? (
    <Box display="flex" alignItems="center">
      <Check />
    </Box>
  ) : null;
}
