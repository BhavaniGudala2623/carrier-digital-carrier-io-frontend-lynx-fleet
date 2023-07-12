import { useTranslation } from 'react-i18next';
import { FuelLevelExpression } from '@carrier-io/lynx-fleet-types';
import Box from '@carrier-io/fds-react/Box';
import { Typography } from '@carrier-io/fds-react';

import { FuelIcon } from '../icons';
import { EventViewProps } from '../../types';

import { eventViewIconStyle } from './styles';

interface FuelLevelProps extends EventViewProps {
  expression: FuelLevelExpression;
}

export const FuelLevelEventView = ({ expression, showIcon = true }: FuelLevelProps) => {
  const { t } = useTranslation();
  const comparisonTranslate = (() => {
    switch (expression.comparison) {
      case 'FREEZER_FUEL_LEVEL':
        return t('notifications.fuel-level').toLowerCase();
      default:
        return expression.comparison;
    }
  })();

  return (
    <Box display="flex" alignItems="center">
      {showIcon && <FuelIcon sx={{ ...eventViewIconStyle }} />}
      <Typography component="span" variant="body1">
        &nbsp;{t('notifications.if-fuel')},&nbsp;<b>{comparisonTranslate}&nbsp;</b>
        {t('common.goes-below')}&nbsp; {`${expression.value} %`}
      </Typography>
    </Box>
  );
};
