import Typography from '@carrier-io/fds-react/Typography';
import { useTranslation } from 'react-i18next';
import Grid from '@carrier-io/fds-react/Grid';
import Chip from '@carrier-io/fds-react/Chip';

import { getSetpointValue, getStatus } from '../utils';

import { useUserSettings } from '@/providers/UserSettings';
import { translateEngineControlMode } from '@/utils/translateEngineControlMode';
import type { SnapshotDataEx } from '@/features/common';

/**
 * Helper function to render compartment on the left side of the dialog.
 * @param {*} classes css classes.
 * @param {*} t translation.
 * @param {*} asset
 * @param {*} compNo compartment number.
 * @returns
 */
function getCompartment(t, asset, compNo, tempUnicode, tempUnit) {
  const setpointValue = getSetpointValue(asset, compNo, tempUnit);
  let temp = <span>{setpointValue}</span>;

  if (setpointValue || setpointValue === 0) {
    temp = (
      <Typography variant="body2">
        {temp} {tempUnicode}
      </Typography>
    );
  }
  let statusClass = 'on';
  let status = t('common.on');
  if (!getStatus(asset, compNo)) {
    status = t('common.off');
    statusClass = 'off';
  }

  return (
    <Grid container alignItems="center" justifyContent="space-between" sx={{ height: '40px', mt: 1, mb: 1 }}>
      <Grid item>
        <Grid container alignItems="center">
          <Typography variant="subtitle1">{t(`asset.compartment${compNo}`)}</Typography>
          <Chip
            label={status}
            lightBackground
            color={statusClass === 'off' ? 'error' : 'success'}
            style={{ borderRadius: 4 }}
            sx={{ ml: 1 }}
            size="small"
          />
        </Grid>
      </Grid>
      <Grid item>
        <Grid container alignItems="center">
          <Typography variant="body2" sx={{ mr: 1 }}>
            {t(`common.setpoint`)}
          </Typography>
          <Typography variant="subtitle1">{temp}</Typography>
        </Grid>
      </Grid>
    </Grid>
  );
}

function getCompartmentBoxComponent(label: string, value: string | number) {
  return (
    <Grid container alignItems="center" justifyContent="space-between" sx={{ height: '40px', mt: 1, mb: 1 }}>
      <Grid item>
        <Typography variant="subtitle1">{label}</Typography>
      </Grid>
      <Grid item>
        <Typography variant="subtitle1">{value}</Typography>
      </Grid>
    </Grid>
  );
}

interface TwoWayStatusProps {
  asset: SnapshotDataEx | null;
  applicableCompartments: Set<string>;
}

export function TwoWayStatus({ applicableCompartments, asset }: TwoWayStatusProps) {
  const { t } = useTranslation();
  const { userSettings } = useUserSettings();
  const { temperature } = userSettings;
  // 8451: Celsius, 8457: Fahrenheit
  const tempUnicode = temperature === 'C' ? <>&#8451;</> : <>&#8457;</>;

  return (
    <>
      <Typography variant="subtitle1">{t('asset.command.status')}</Typography>
      <Typography variant="body2">{t('asset.command.current-status')}</Typography>
      <Grid
        container
        direction="column"
        sx={{
          mt: 2.5,
          borderRadius: 1,
          pr: 2,
          pl: 2,
          backgroundColor: '#ECEFF180', // TODO: change this to color from palette
        }}
      >
        {applicableCompartments.has('comp1') && getCompartment(t, asset || {}, 1, tempUnicode, temperature)}
        {applicableCompartments.has('comp2') && getCompartment(t, asset || {}, 2, tempUnicode, temperature)}
        {applicableCompartments.has('comp3') && getCompartment(t, asset || {}, 3, tempUnicode, temperature)}
        {getCompartmentBoxComponent(
          t('asset.run-mode'),
          translateEngineControlMode(t, asset?.computedFields?.engineControlMode) || '-'
        )}
        {getCompartmentBoxComponent(t('asset.active-alarms'), asset?.activeFreezerAlarms?.length || 0)}
        {getCompartmentBoxComponent(
          t('asset.command.intelliset'),
          asset?.flespiData?.freezer_intelliset_active || '-'
        )}
      </Grid>
    </>
  );
}
