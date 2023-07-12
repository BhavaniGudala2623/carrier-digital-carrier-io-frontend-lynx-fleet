import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  TemperatureDeviationExpression,
  TemperatureDeviationFixedValueExpression,
  NotificationRuleConditionType,
} from '@carrier-io/lynx-fleet-types';
import Box from '@carrier-io/fds-react/Box';
import Typography from '@carrier-io/fds-react/Typography';
import Chip from '@carrier-io/fds-react/Chip';

import { EventViewProps } from '../../types';
import { getCompartmentOptions } from '../Selector';

import { eventViewIconStyle } from './styles';

import { getTemperatureDelta } from '@/utils';
import { useUserSettings } from '@/providers/UserSettings';
import { TemperatureIcon } from '@/components';

interface TemperatureDeviationEventViewProps extends EventViewProps {
  expression: TemperatureDeviationExpression | TemperatureDeviationFixedValueExpression;
  type: NotificationRuleConditionType;
}

export const TemperatureDeviationEventView = ({
  expression,
  showIcon = true,
  type,
}: TemperatureDeviationEventViewProps) => {
  const { userSettings } = useUserSettings();
  const { temperature } = userSettings;
  const { t } = useTranslation();
  const { setpoint, value } = expression as TemperatureDeviationFixedValueExpression;

  const comparisonTranslate = (() => {
    switch (expression.comparison) {
      case 'ABOVE':
        return t('notifications.above');
      case 'BELOW':
        return t('notifications.below');
      case 'ABOVE_OR_BELOW':
        return t('notifications.above-or-below');
      default:
        return expression.comparison;
    }
  })();

  const compartmentOptions = getCompartmentOptions(t);
  const isTemperatureDeviationType = type === 'TEMPERATURE_DEVIATION';

  const renderSelectedCompartments = () =>
    [...(expression?.compartments || [])]?.sort().map((compartment) => {
      const compartmentName = compartmentOptions.find((item) => item.value === compartment);

      return compartmentName?.label ? (
        <React.Fragment key={compartment}>
          <Chip
            key={compartment}
            label={compartmentName.label}
            lightBackground
            color="secondary"
            size="small"
          />
          &nbsp;
        </React.Fragment>
      ) : (
        ''
      );
    });

  return (
    <Box display="flex" alignItems="center">
      {showIcon && <TemperatureIcon sx={eventViewIconStyle} />}
      <Typography component="span" variant="body1">
        {t('notifications.return-air')} <b>{comparisonTranslate}</b>
        &nbsp;
        {isTemperatureDeviationType ? t('notifications.setpoint-by') : t('notifications.the-fixed-value')}
        &nbsp;
        <b>{`${getTemperatureDelta(
          !isTemperatureDeviationType ? setpoint : value,
          temperature
        )} °${temperature}`}</b>
        &nbsp;
        {!isTemperatureDeviationType && (
          <>
            {t('common.by')}
            &nbsp;
            <b>{`${getTemperatureDelta(value, temperature)} °${temperature}`}</b>
          </>
        )}
        &nbsp;
        <span>{t('common.for')}</span> &nbsp;
        <span>{renderSelectedCompartments()}</span>
      </Typography>
    </Box>
  );
};
