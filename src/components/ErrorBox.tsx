import Box from '@carrier-io/fds-react/Box';
import { Error } from '@mui/icons-material';
import Typography, { TypographyProps } from '@carrier-io/fds-react/Typography';

type ErrorCommonProps = {
  message: string;
  errorIconFontSize?: number;
};

type ErrorProps = ErrorCommonProps & Pick<TypographyProps, 'variant'>;

export function ErrorBox({ message, errorIconFontSize = 36, variant }: ErrorProps) {
  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' }}
    >
      <Error style={{ fontSize: errorIconFontSize }} color="error" />
      <Typography variant={variant} color="error">
        {message}
      </Typography>
    </Box>
  );
}
