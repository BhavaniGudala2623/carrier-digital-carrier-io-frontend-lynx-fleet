import { useContext } from 'react';
import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import TextField from '@carrier-io/fds-react/TextField';
import Typography from '@carrier-io/fds-react/Typography';

import { DeviceCommissioningContext } from '../../../providers';
import { DeviceCommissioningFormValues } from '../../../types';

export const AssetInfo = () => {
  const { t } = useTranslation();
  const { values, errors, setFieldValue, handleBlur } = useFormikContext<DeviceCommissioningFormValues>();
  const { permissions } = useContext(DeviceCommissioningContext);
  const { assetEditAllowed, deviceEditAllowed } = permissions;

  return (
    <>
      <Typography variant="subtitle1" sx={{ mb: 3 }}>
        {t('device.management.asset.info.asset-info')}
      </Typography>
      <TextField
        id="asset.name"
        name="asset.name"
        size="small"
        value={values.asset.name}
        onChange={(event) => setFieldValue('asset.name', event.target.value)}
        onBlur={handleBlur}
        error={!!errors.asset?.name}
        helperText={errors.asset?.name}
        InputProps={{
          readOnly: !assetEditAllowed || !deviceEditAllowed,
        }}
        label={t('device.management.asset.info.asset-name')}
        sx={{ mb: 2.5, maxWidth: 380 }}
        required
        fullWidth
      />
      <TextField
        id="asset.licensePlateNumber"
        name="asset.licensePlateNumber"
        size="small"
        value={values.asset.licensePlateNumber}
        onChange={(event) => setFieldValue('asset.licensePlateNumber', event.target.value)}
        InputProps={{
          readOnly: !assetEditAllowed || !deviceEditAllowed,
        }}
        label={t('device.management.asset.info.asset-license-plate')}
        sx={{ maxWidth: 380 }}
        fullWidth
      />
    </>
  );
};

AssetInfo.displayName = 'AssetInfo';
