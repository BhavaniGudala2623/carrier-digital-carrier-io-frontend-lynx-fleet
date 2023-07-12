import { useTranslation } from 'react-i18next';
import { TruAlarmExpression } from '@carrier-io/lynx-fleet-types';
import Box from '@carrier-io/fds-react/Box';
import { Typography } from '@carrier-io/fds-react';

import { AlarmIcon } from '../icons';
import { EventViewProps } from '../../types';

import { eventViewIconStyle } from './styles';

interface AlarmEventProps extends EventViewProps {
  expression: TruAlarmExpression;
}

export const AlarmEventView = ({ expression, showIcon = true }: AlarmEventProps) => {
  const { t } = useTranslation();

  const comparisonTranslate = (() => {
    switch (expression.comparison) {
      case 'ACTIVE_SHUTDOWN':
        return t('notifications.active-shutdown').toLowerCase();
      default:
        return expression.comparison;
    }
  })();

  return (
    <Box display="flex" alignItems="center">
      {showIcon && <AlarmIcon sx={{ ...eventViewIconStyle }} />}
      <Typography component="span" variant="body1">
        &nbsp;{t('notifications.if-alarm')},&nbsp;<b>{comparisonTranslate}&nbsp;</b>
        {t('common.is')}&nbsp;{t('common.active').toLowerCase()}
      </Typography>
    </Box>
  );
};
