import { memo } from 'react';
import FormLabel from '@carrier-io/fds-react/FormLabel';
import FormControl from '@carrier-io/fds-react/FormControl';
import { SxProps } from '@mui/material';

interface LynxFormControlProps {
  children: JSX.Element;
  label?: string;
  inputId?: string;
  sx?: SxProps;
  sxLabel?: SxProps;
}

export const LynxFormControl = memo((props: LynxFormControlProps) => {
  const { children, label, inputId, sx, sxLabel } = props;

  return (
    <FormControl sx={{ mb: 1, width: '100%', ...sx }}>
      {label && (
        <FormLabel htmlFor={inputId} sx={sxLabel}>
          {label}
        </FormLabel>
      )}
      {children}
    </FormControl>
  );
});

LynxFormControl.displayName = 'LynxFormControl';
