import { useTranslation } from 'react-i18next';
import { useFormikContext } from 'formik';
import { useContext } from 'react';
import Grid from '@carrier-io/fds-react/Grid';
import TextField from '@carrier-io/fds-react/TextField';

import { DeviceCommissioningContext } from '../../providers';
import { DeviceCommissioningFormValues } from '../../types';

import { useUserSettings } from '@/providers/UserSettings';
import { LynxFormControl, LynxFormLabel, dateTimeFormatter } from '@/components';

export const NotesSection = () => {
  const { t } = useTranslation();
  const { values, setFieldValue } = useFormikContext<DeviceCommissioningFormValues>();
  const { asset } = values;

  const { permissions, snapshot } = useContext(DeviceCommissioningContext);
  const { assetEditAllowed, deviceEditAllowed } = permissions;

  const { userSettings } = useUserSettings();

  const { timezone, dateFormat } = userSettings;
  const format = (dateTime) => dateTimeFormatter(dateTime, { dateFormat, timezone });
  const commissionedBy = snapshot?.device?.commissionedBy || '';
  const commissionedOn = snapshot?.device?.commissionedOn || '';

  return (
    <Grid alignItems="flex-start" container direction="row" justifyContent="flex-start" spacing={2}>
      <>
        <Grid item xs={3}>
          <LynxFormLabel title={t('device.management.device.commissioning.commissionedBy')} variant="body2" />
          <LynxFormControl inputId="asset.commissionedBy">
            <TextField
              id="asset.commissionedBy"
              name="asset.commissionedBy"
              size="small"
              value={commissionedBy}
              InputProps={{ readOnly: true }}
            />
          </LynxFormControl>
        </Grid>
        <Grid item xs={3}>
          <LynxFormLabel title={t('device.management.device.commissioning.commissionedOn')} variant="body2" />
          <LynxFormControl inputId="asset.commissionedOn">
            <TextField
              id="asset.commissionedOn"
              name="asset.commissionedOn"
              size="small"
              value={format(commissionedOn)}
              InputProps={{ readOnly: true }}
            />
          </LynxFormControl>
        </Grid>
      </>
      <Grid item xs={12}>
        <LynxFormLabel title={t('device.management.device.commissioning.notes')} variant="body2" />
        <LynxFormControl inputId="asset.notes">
          <TextField
            id="asset.notes"
            name="asset.notes"
            size="small"
            value={asset.notes}
            onChange={(event) => setFieldValue('asset.notes', event.target.value)}
            placeholder={`${t('device.management.device.commissioning.add-a-note')}...`}
            InputProps={{
              readOnly: !assetEditAllowed || !deviceEditAllowed,
            }}
          />
        </LynxFormControl>
      </Grid>
    </Grid>
  );
};
