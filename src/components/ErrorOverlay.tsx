import { Error } from '@mui/icons-material';
import Box from '@carrier-io/fds-react/Box';
import Typography, { TypographyProps } from '@carrier-io/fds-react/Typography';
import { useTranslation } from 'react-i18next';

type ErrorCommonProps = {
  message?: string;
  errorIconFontSize?: number;
};

type ErrorProps = ErrorCommonProps & Pick<TypographyProps, 'variant'>;

export function ErrorOverlay({ message, errorIconFontSize = 64, variant = 'h4' }: ErrorProps) {
  const { t } = useTranslation();

  return (
    <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="100%">
      <Error style={{ fontSize: errorIconFontSize }} color="error" />
      <Box mt="0.5em">
        <Typography variant={variant} color="error">
          {message ?? t('common.something-went-wrong')}
        </Typography>
      </Box>
    </Box>
  );
}
