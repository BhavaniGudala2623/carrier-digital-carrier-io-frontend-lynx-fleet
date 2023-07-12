import { useContext, memo } from 'react';
import { useTranslation } from 'react-i18next';
import Typography from '@carrier-io/fds-react/Typography';

import { DeviceCommissioningContext } from '../../../providers/DeviceCommissioningContext';

import { CompartmentComponent } from './CompartmentComponent';

import { isCompartmentConfigured } from '@/utils';

export const CompartmentSetup = memo(() => {
  const { t } = useTranslation();
  const { snapshot } = useContext(DeviceCommissioningContext);
  const { flespiData } = snapshot;

  const showCompartment1 = isCompartmentConfigured(1, flespiData);
  const showCompartment2 = isCompartmentConfigured(2, flespiData);
  const showCompartment3 = isCompartmentConfigured(3, flespiData);

  return (
    <>
      {(showCompartment1 || showCompartment2 || showCompartment3) && (
        <Typography variant="subtitle1" sx={{ mb: 3 }}>
          {t('device.management.asset.configuration.compartment-setup')}
        </Typography>
      )}
      {showCompartment1 && (
        <CompartmentComponent
          compartmentMode={flespiData?.freezer_comp1_mode}
          compartmentSetpoint={flespiData?.freezer_zone1_temperature_setpoint}
          index={1}
        />
      )}
      {showCompartment2 && (
        <CompartmentComponent
          compartmentMode={flespiData?.freezer_comp2_mode}
          compartmentSetpoint={flespiData?.freezer_zone2_temperature_setpoint}
          index={2}
        />
      )}
      {showCompartment3 && (
        <CompartmentComponent
          compartmentMode={flespiData?.freezer_comp3_mode}
          compartmentSetpoint={flespiData?.freezer_zone3_temperature_setpoint}
          index={3}
        />
      )}
    </>
  );
});

CompartmentSetup.displayName = 'CompartmentSetup';
