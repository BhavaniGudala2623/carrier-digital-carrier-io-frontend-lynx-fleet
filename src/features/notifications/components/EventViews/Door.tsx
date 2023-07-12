import { useTranslation } from 'react-i18next';
import { DoorExpression } from '@carrier-io/lynx-fleet-types';
import Box from '@carrier-io/fds-react/Box';
import { Typography } from '@carrier-io/fds-react';

import { EventViewProps } from '../../types';

import { eventViewIconStyle } from './styles';

import { DoorIcon } from '@/components';

interface DoorEventProps extends EventViewProps {
  expression: DoorExpression;
}

export const DoorEventView = ({ expression, showIcon = true }: DoorEventProps) => {
  const { t } = useTranslation();

  const comparisonTranslate = (() => {
    switch (expression.comparison) {
      case 'OPEN':
        return t('assets.door.status.open').toLowerCase();
      case 'CLOSED':
        return t('assets.door.status.closed').toLowerCase();
      default:
        return expression.comparison;
    }
  })();

  return (
    <Box display="flex" alignItems="center">
      {showIcon && <DoorIcon sx={{ ...eventViewIconStyle }} />}
      <Typography variant="body1">
        {t('notifications.door-is')} <b>{comparisonTranslate}</b>
      </Typography>
    </Box>
  );
};
