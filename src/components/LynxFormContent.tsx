import Box from '@carrier-io/fds-react/Box';
import { SxProps } from '@mui/material';

interface LynxFormLabelProps {
  children: JSX.Element;
  sx?: SxProps;
}

export const LynxFormContent = (props: LynxFormLabelProps) => {
  const { children, sx } = props;

  return <Box sx={{ wordWrap: 'break-word', minHeight: '1.7rem', ...sx }}>{children}</Box>;
};
