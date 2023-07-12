import React from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { SetpointChangeExpression } from '@carrier-io/lynx-fleet-types';
import Box from '@carrier-io/fds-react/Box';
import Typography from '@carrier-io/fds-react/Typography';
import Chip from '@carrier-io/fds-react/Chip';

import { EventViewProps } from '../../types';
import { getCompartmentOptions } from '../Selector';

import { eventViewIconStyle } from './styles';

import { TemperatureIcon } from '@/components/icons';
import { toUnit } from '@/utils';
import { useUserSettings } from '@/providers/UserSettings';

interface SetpointEventViewProps extends EventViewProps {
  expression: SetpointChangeExpression;
}

export const SetpointEventView = ({ expression, showIcon = true }: SetpointEventViewProps) => {
  const { userSettings } = useUserSettings();
  const { temperature } = userSettings;
  const { t } = useTranslation();
  const { compartments, range, comparison } = expression;

  const compartmentOptions = getCompartmentOptions(t);

  const renderSelectedCompartments = () =>
    [...(compartments || [])].sort().map((compartment) => {
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
        {comparison === 'CHANGED' && <Trans i18nKey="notifications.the-setpoint-is-changed" />}
        {comparison === 'OUTSIDE_RANGE' && range && (
          <Trans
            i18nKey="notifications.the-setpoint-is-changed-outside-range"
            values={{
              lowerCount: `${toUnit(range.lowerValue, temperature, 0)} °${temperature}`,
              upperCount: `${toUnit(range.upperValue, temperature, 0)} °${temperature}`,
            }}
          />
        )}
        &nbsp;
        <span>{renderSelectedCompartments()}</span>
      </Typography>
    </Box>
  );
};
