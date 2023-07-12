import { useTranslation } from 'react-i18next';
import { BatteryLevelExpression } from '@carrier-io/lynx-fleet-types';
import Box from '@carrier-io/fds-react/Box';
import { Typography } from '@carrier-io/fds-react';

import { BatteryIcon } from '../icons';
import { EventViewProps } from '../../types';

import { eventViewIconStyle } from './styles';

interface BatteryLevelProps extends EventViewProps {
  expression: BatteryLevelExpression;
}

export const BatteryLevelEventView = ({ expression, showIcon = true }: BatteryLevelProps) => {
  const { t } = useTranslation();
  const comparisonTranslate = (() => {
    switch (expression.comparison) {
      case 'FREEZER_BATTERY_VOLTAGE':
        return t('notifications.battery-level-accessory').toLowerCase();
      default:
        return expression.comparison;
    }
  })();

  return (
    <Box display="flex" alignItems="center">
      {showIcon && <BatteryIcon sx={{ ...eventViewIconStyle }} />}
      <Typography component="span" variant="body1">
        &nbsp;{t('notifications.if-fuel')},&nbsp;<b>{comparisonTranslate}&nbsp;</b>
        {t('common.goes-below')}&nbsp; {`V ${expression.value}`}
      </Typography>
    </Box>
  );
};
