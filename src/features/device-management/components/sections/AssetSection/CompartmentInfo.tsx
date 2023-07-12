import { useTranslation } from 'react-i18next';
import Grid from '@carrier-io/fds-react/Grid';
import Box from '@carrier-io/fds-react/Box';
import Typography from '@carrier-io/fds-react/Typography';
import { isNil } from 'lodash-es';
import Switch from '@carrier-io/fds-react/Switch';
import { useFormikContext } from 'formik';
import Chip from '@carrier-io/fds-react/Chip';
import Divider from '@carrier-io/fds-react/Divider';
import { useContext } from 'react';
import { CompartmentModeType } from '@carrier-io/lynx-fleet-types';
import Tooltip from '@carrier-io/fds-react/Tooltip';

import { DeviceCommissioningContext } from '../../../providers';

import { DeviceCommissioningFormValues } from '@/features/device-management/types';
import { isCompartmentConfigured, toFahrenheit, translateOperatingMode } from '@/utils';
import { useUserSettings } from '@/providers/UserSettings';

export const CompartmentInfo = () => {
  const { t } = useTranslation();
  const { userSettings } = useUserSettings();
  const { temperature } = userSettings;
  const { snapshot } = useContext(DeviceCommissioningContext);
  const { flespiData } = snapshot;
  const { values, setFieldValue } = useFormikContext<DeviceCommissioningFormValues>();
  const nCompartments = [1, 2, 3] as const;
  type NCompartment = (typeof nCompartments)[number];
  const compartmentConfig = values?.device?.compartmentConfig;

  const getTemperatureValue = (value: number) => (temperature === 'C' ? value : toFahrenheit(value));

  const getCompSetpoint = (compNum): number | undefined =>
    flespiData?.[`freezer_zone${compNum}_temperature_setpoint`];

  const getCompMode = (compNum): CompartmentModeType | undefined =>
    flespiData?.[`freezer_comp${compNum}_mode`];

  const getCompConfigStatus = (compNum): boolean => compartmentConfig?.[`comp${compNum}Configured`];

  const handleToggleCompartment = (_, value, compNum: NCompartment) => {
    if (compNum === 1) {
      return;
    }
    setFieldValue(`device.compartmentConfig.comp${compNum}Configured`, value);
  };

  return (
    <>
      <Typography variant="subtitle1" sx={{ mb: 3 }}>
        {t('device.management.asset.configuration.enable-compartments')}
      </Typography>
      <Grid container rowGap={4} maxWidth={550} paddingRight={2}>
        {nCompartments.map((compNum) => (
          <Grid container display="flex" key={compNum} rowGap={2} columnGap={1} paddingTop="12px">
            <Box display="flex" alignItems="center" gap={1} flexGrow={1}>
              <Tooltip
                disableHoverListener={compNum !== 1}
                arrow
                enterDelay={100}
                leaveDelay={0}
                placement="top"
                title={t('device.management.asset.configuration.comp-1-always-enabled')}
              >
                <Switch
                  size="medium"
                  checked={getCompConfigStatus(compNum)}
                  onChange={(_, value) => handleToggleCompartment(_, value, compNum)}
                />
              </Tooltip>
              <Typography sx={{ minWidth: 'fit-content' }} variant="body2">{`${t(
                'asset.compartment'
              )} ${compNum}`}</Typography>
            </Box>
            {getCompConfigStatus(compNum) && isCompartmentConfigured(compNum, flespiData) ? (
              <Box display="flex" flexWrap="wrap" alignItems="center" gap={1}>
                <Box style={{ minWidth: '15px' }}>
                  {getCompMode(compNum) ? (
                    <Chip label={translateOperatingMode(t, getCompMode(compNum) ?? null)} size="xsmall" />
                  ) : (
                    <Divider sx={{ borderStyle: 'dashed' }} />
                  )}
                </Box>

                <Divider orientation="vertical" flexItem />
                <Box style={{ width: '50px' }}>
                  {!isNil(getCompSetpoint(compNum)) ? (
                    <Typography sx={{ whiteSpace: 'nowrap' }} variant="body2">
                      {`${getTemperatureValue(getCompSetpoint(compNum)!)} º${temperature}`}
                    </Typography>
                  ) : (
                    <Divider sx={{ borderStyle: 'dashed', width: '15px' }} />
                  )}
                </Box>
              </Box>
            ) : null}
          </Grid>
        ))}
      </Grid>
    </>
  );
};

CompartmentInfo.displayName = 'CompartmentInfo';
