import { Typography } from '@carrier-io/fds-react';
import Box from '@carrier-io/fds-react/Box';
import { fleetThemeOptions } from '@carrier-io/fds-react/theme';
import { useTranslation } from 'react-i18next';

import { primaryFilterStyles } from './styles';

interface ITotalBatteriesCount {
  count: number;
}

export const TotalBatteriesCount = ({ count }: ITotalBatteriesCount) => {
  const classes = primaryFilterStyles();
  const { t } = useTranslation();

  return (
    <Box className={classes.totalBatteriesCount}>
      <Typography variant="h5" color={fleetThemeOptions.palette.primary.dark}>
        {count.toLocaleString()}
      </Typography>
      <Typography variant="subtitle1" color={fleetThemeOptions.palette.primary.dark}>
        {t('battery.management.total-batteries')}
      </Typography>
    </Box>
  );
};
