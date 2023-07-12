import { useTranslation } from 'react-i18next';
import { GeofenceExpression } from '@carrier-io/lynx-fleet-types';
import Box from '@carrier-io/fds-react/Box';
import { Typography } from '@carrier-io/fds-react';

import { EventViewProps } from '../../types';

import { eventViewIconStyle } from './styles';

import { useAppSelector } from '@/stores';
import { selectGeofencesState } from '@/stores/assets';
import { PolygonIcon } from '@/icons';
import { ListPopover } from '@/components/ListPopover';

interface GoefenceEventProps extends EventViewProps {
  expression: GeofenceExpression;
}

export const GeofenceEventView = ({ expression, showIcon = true }: GoefenceEventProps) => {
  const { t } = useTranslation();
  const { entities: geofences, isLoading } = useAppSelector(selectGeofencesState);

  const items =
    geofences
      ?.filter((geofence) => expression.geofences.includes(geofence.geofenceId))
      .map((geofence) => ({
        value: geofence.geofenceId,
        label: geofence.name,
      })) || [];

  const selectValue = `(${items.length}) ${t('common.selected')}`.toLowerCase();

  const comparisonTranslate = (() => {
    switch (expression.comparison) {
      case 'INSIDE':
        return t('common.inside').toLowerCase();
      case 'OUTSIDE':
        return t('common.outside').toLowerCase();
      default:
        return expression.comparison;
    }
  })();

  return (
    <Box display="flex" alignItems="center">
      {showIcon && <PolygonIcon sx={{ ...eventViewIconStyle }} />}
      <Typography component="span" variant="body1">
        {t('common.if')}
        <b>&nbsp;{comparisonTranslate}&nbsp;</b>
        {t('notifications.any-of-geofence')}{' '}
        <ListPopover items={items} containerContent={selectValue} isLoading={isLoading} />
      </Typography>
    </Box>
  );
};
