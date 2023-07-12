import { MoreVert } from '@mui/icons-material';
import IconButton from '@carrier-io/fds-react/IconButton';
import { ICellRendererParams } from '@ag-grid-community/core';

interface ActionsRendererProps {
  onStateChange: (anchor: HTMLElement | null, notificationId: string) => void;
}

export const ActionsRenderer = ({ data }: ICellRendererParams, { onStateChange }: ActionsRendererProps) => (
  <IconButton onClick={(event) => onStateChange(event.currentTarget, data.notificationId)}>
    <MoreVert />
  </IconButton>
);
