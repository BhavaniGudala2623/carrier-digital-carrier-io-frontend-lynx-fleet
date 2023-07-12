import { useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { DateRange as DateRangeType, DateRangePicker } from '@carrier-io/fds-react/DateTime/DateRangePicker';
import Box from '@carrier-io/fds-react/Box';
import Typography from '@carrier-io/fds-react/Typography';
import Select from '@carrier-io/fds-react/Select';
import Input from '@carrier-io/fds-react/Input';
import MenuItem from '@carrier-io/fds-react/MenuItem';
import { ReportFileFormat } from '@carrier-io/lynx-fleet-types';
import { getDateFormat } from '@carrier-io/lynx-fleet-common';

import { GenerateReportDialogButtons } from './GenerateReportDialogButtons';

import { CsvIcon, XlsIcon } from '@/components';
import { useUserSettings } from '@/providers/UserSettings';
import { getDateInputMask } from '@/utils';

interface Props {
  onClose: () => void;
  reportFormat: ReportFileFormat;
  onChangeReportFormat: (format: ReportFileFormat) => void;
  dateRange: DateRangeType<Date>;
  onChangeDateRange: (newDateRange: DateRangeType<Date>) => void;
  isLoading: boolean;
  onGenerateReport: () => Promise<void>;
  text: string;
}

export const GenerateReportDialogContent = ({
  onClose,
  reportFormat,
  onChangeReportFormat,
  dateRange,
  onChangeDateRange,
  onGenerateReport,
  isLoading,
  text,
}: Props) => {
  const { t } = useTranslation();

  const { userSettings } = useUserSettings();
  const { dateFormat } = userSettings;

  const handleGenerateReportClick = () => {
    // eslint-disable-next-line no-console
    onGenerateReport().catch((error) => console.error(error));
  };

  const handleChangeReportFormat = (event) => {
    onChangeReportFormat(event.target.value);
  };

  const inputDateFormat = useMemo(() => getDateFormat(dateFormat, { variant: 'date' }), [dateFormat]);
  const inputDateMask = useMemo(() => getDateInputMask(inputDateFormat), [inputDateFormat]);

  return (
    <Box display="flex" flexDirection="column" justifyContent="space-between" height="100%">
      <Typography variant="body1" paddingY={1.8} width="90%">
        <Trans i18nKey={text} />
      </Typography>
      <Box display="flex" paddingY={1.8}>
        <DateRangePicker
          startPlaceholder={t('common.start')}
          startLabelText={t('common.dateRange')}
          endLabelText={t('common.end')}
          endPlaceholder={t('common.end')}
          value={dateRange}
          onChange={onChangeDateRange}
          size="small"
          inputFormat={inputDateFormat}
          mask={inputDateMask}
          noSizeTransition
        />
        <Select
          value={reportFormat}
          name="run_mode"
          onChange={handleChangeReportFormat}
          size="small"
          sx={{ width: 148, marginLeft: 1 }}
          input={<Input hiddenLabel />}
        >
          <MenuItem value="xlsx">
            <Box display="flex" alignItems="center">
              <XlsIcon />
              <Typography paddingTop={0.5}>XLS</Typography>
            </Box>
          </MenuItem>
          <MenuItem value="csv">
            <Box display="flex" alignItems="center">
              <CsvIcon />
              <Typography paddingTop={0.5}>CSV</Typography>
            </Box>
          </MenuItem>
        </Select>
      </Box>
      <Typography variant="body1">
        <Trans i18nKey="device.management.date-range-will-apply-to" />
      </Typography>
      <GenerateReportDialogButtons
        isLoading={isLoading}
        onGenerateReportClick={handleGenerateReportClick}
        date={dateRange[0]}
        onClose={onClose}
      />
    </Box>
  );
};

GenerateReportDialogContent.displayName = 'GenerateReportDialogContent';
