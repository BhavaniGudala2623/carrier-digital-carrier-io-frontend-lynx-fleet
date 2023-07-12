import { memo } from 'react';
import Typography, { TypographyProps } from '@carrier-io/fds-react/Typography';
import { SxProps } from '@mui/material';

import { LynxFormContent } from './LynxFormContent';

interface LynxFormLabelProps {
  title: string | null | undefined;
  variant: TypographyProps['variant'];
  sx?: SxProps;
}

export const LynxFormLabel = memo((props: LynxFormLabelProps) => {
  const { title = '', variant, sx } = props;

  return (
    <LynxFormContent sx={{ ...sx }}>
      <Typography variant={variant}>{title}</Typography>
    </LynxFormContent>
  );
});

LynxFormLabel.displayName = 'LynxFormLabel';
