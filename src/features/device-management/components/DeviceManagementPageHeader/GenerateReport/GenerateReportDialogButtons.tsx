import { useTranslation } from 'react-i18next';
import { Maybe } from '@carrier-io/lynx-fleet-types';
import Button from '@carrier-io/fds-react/Button';
import CircularProgress from '@carrier-io/fds-react/CircularProgress';
import Box from '@carrier-io/fds-react/Box';

interface Props {
  isLoading: boolean;
  date: Maybe<Date>;
  onGenerateReportClick: () => void;
  onClose: () => void;
}
export const GenerateReportDialogButtons = ({ isLoading, date, onGenerateReportClick, onClose }: Props) => {
  const { t } = useTranslation();

  return (
    <Box display="flex" justifyContent="right">
      <Button sx={{ mt: 1, ml: 1 }} variant="outlined" color="secondary" size="medium" onClick={onClose}>
        {t('common.cancel')}
      </Button>
      <Button
        sx={{ mt: 1, ml: 1, whiteSpace: 'nowrap' }}
        type="submit"
        variant="outlined"
        color="primary"
        size="medium"
        disabled={isLoading || !date}
        endIcon={isLoading ? <CircularProgress size={13} /> : null}
        onClick={onGenerateReportClick}
      >
        {isLoading ? t('common.loading') : t('device.management.generate-report')}
      </Button>
    </Box>
  );
};

GenerateReportDialogButtons.displayName = 'GenerateReportDialogButtons';
