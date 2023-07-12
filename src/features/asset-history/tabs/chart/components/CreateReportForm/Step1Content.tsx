import Typography from '@carrier-io/fds-react/Typography';
import Box from '@carrier-io/fds-react/Box';
import FormControlLabel from '@carrier-io/fds-react/FormControlLabel';
import Checkbox from '@carrier-io/fds-react/Checkbox';
import FormHelperText from '@carrier-io/fds-react/FormHelperText';
import { useTranslation } from 'react-i18next';
import { ChangeEvent } from 'react';
import Paper from '@carrier-io/fds-react/Paper';
import { Description, DescriptionVariants } from '@carrier-io/fds-react/patterns/Description';

import { ReportFormData } from '../../types';

import { Step1FormValues, Step1FormErrors } from './types';
import { getDescriptionData, getIncludeInReport } from './utils';

import { useUserSettings } from '@/providers/UserSettings';

type Step1ContentProps = {
  data: ReportFormData;
  values: Step1FormValues;
  errors: Step1FormErrors;
  handleChange: (e: ChangeEvent<unknown>) => void;
};

export const Step1Content = (props: Step1ContentProps) => {
  const { data, values, errors, handleChange } = props;

  const { t } = useTranslation();
  const {
    userSettings: { dateFormat },
  } = useUserSettings();

  const getTimeframe = (): string => {
    switch (data.quickDate) {
      case '24h':
        return t('common.last.24h');
      case '48h':
        return t('common.last.48h');
      case '7d':
        return t('common.last.7d');
      default:
        return t('assets.asset.table.custom-timeframe');
    }
  };

  const timeframe = getTimeframe();
  const descriptionData = getDescriptionData(t, data, timeframe, dateFormat);

  return (
    <>
      <Typography mb={3}>{t('assets.reports.create.header-information')}</Typography>
      <Paper sx={{ background: 'background.description', mb: 4, p: 2 }} elevation={0}>
        <Box minWidth={250}>
          <Description
            rowIndentCssUnit="rem"
            rowIndentValue={1.25}
            variant={DescriptionVariants.HorizontalJustifiedWithNoDots}
            sx={{ backgroundColor: 'background.description', overflowY: 'hidden', minWidth: '450px' }}
          >
            {descriptionData.map(({ label, value }) => (
              <Description.Item TextProps={{ textAlign: 'right' }} key={label} label={label}>
                {value}
              </Description.Item>
            ))}
          </Description>
        </Box>
      </Paper>
      <Box>
        <Typography>{t('assethistory.report.include-in-report')}</Typography>
        <Box display="flex" flexDirection="column" sx={{ pl: 2 }}>
          {getIncludeInReport(t, values).map(({ value, label, name }) => (
            <FormControlLabel
              key={name}
              control={<Checkbox name={name} size="small" checked={value} onChange={handleChange} />}
              label={<Typography variant="body2">{label}</Typography>}
            />
          ))}
          <FormHelperText error>{errors.legendError}</FormHelperText>
        </Box>
      </Box>
    </>
  );
};
