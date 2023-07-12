import { FC, ReactElement, ReactNode, CSSProperties } from 'react';
import DialogFDS, { DialogProps as DialogPropsFDS } from '@carrier-io/fds-react/Dialog';
import DialogActions from '@carrier-io/fds-react/DialogActions';
import { SxProps } from '@mui/material';
import DialogContent from '@carrier-io/fds-react/DialogContent';
import DialogTitle from '@carrier-io/fds-react/DialogTitle';
import Typography from '@carrier-io/fds-react/Typography';
import Box from '@carrier-io/fds-react/Box';
import Tooltip from '@carrier-io/fds-react/Tooltip';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

interface DialogProps extends DialogPropsFDS {
  dialogTitle: string;
  content: ReactElement;
  actions?: ReactElement;
  dividers?: boolean;
  contentSx?: SxProps;
  styleContent?: CSSProperties;
  actionsSx?: SxProps;
  dialogTitleSx?: SxProps;
  tooltipTitle?: NonNullable<ReactNode>;
  open: boolean;
}

export const Dialog: FC<DialogProps> = ({
  onClose,
  open,
  dialogTitle,
  content,
  actions,
  dividers,
  contentSx,
  styleContent,
  actionsSx,
  dialogTitleSx,
  tooltipTitle,
  maxWidth,
  ...rest
}) => (
  <DialogFDS onClose={onClose} open={open} maxWidth={maxWidth || 'xs'} {...rest}>
    <DialogTitle
      sx={dialogTitleSx}
      clearable
      onClose={() => {
        if (onClose) {
          onClose({}, 'backdropClick');
        }
      }}
    >
      <Box display="flex" justifyContent="space-between">
        <Box display="flex" alignItems="flex-end">
          <Typography sx={{ mr: 1, fontWeight: 600, fontSize: '1.25rem' }} variant="h6">
            {dialogTitle}
          </Typography>
          {tooltipTitle && (
            <Tooltip title={tooltipTitle}>
              <InfoOutlinedIcon fontSize="small" sx={{ mb: 0.25 }} />
            </Tooltip>
          )}
        </Box>
      </Box>
    </DialogTitle>
    <DialogContent sx={contentSx} style={styleContent} dividers={dividers}>
      {content}
    </DialogContent>
    {actions && <DialogActions sx={actionsSx || { padding: 2.5 }}>{actions}</DialogActions>}
  </DialogFDS>
);
