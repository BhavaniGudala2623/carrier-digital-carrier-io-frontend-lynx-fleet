import { useTranslation } from 'react-i18next';
import { useContext, useEffect, useMemo } from 'react';
import { useFormikContext } from 'formik';
import MenuItem from '@carrier-io/fds-react/MenuItem';
import TextField from '@carrier-io/fds-react/TextField';
import FormHelperText from '@carrier-io/fds-react/FormHelperText';
import Typography from '@carrier-io/fds-react/Typography';
import Box from '@carrier-io/fds-react/Box';

import { DeviceCommissioningContext } from '../../../providers';
import { DeviceCommissioningFormValues } from '../../../types';
import { getControllersByFotawebGroup, getProductFamiliesByFotawebGroup } from '../../../utils';

import { FormSelect } from '@/components';

export const TruInfo = () => {
  const { t } = useTranslation();
  const { permissions } = useContext(DeviceCommissioningContext);
  const { values, setFieldValue, handleBlur, errors, initialValues, setFieldTouched, handleChange } =
    useFormikContext<DeviceCommissioningFormValues>();

  const { deviceEditAllowed } = permissions;

  const filteredProductFamilies = useMemo(
    () => getProductFamiliesByFotawebGroup(values.fotaweb.groupName),
    [values.fotaweb.groupName]
  );

  const filteredControllerTypes = useMemo(
    () => getControllersByFotawebGroup(values.fotaweb.groupName),
    [values.fotaweb.groupName]
  );

  useEffect(() => {
    if (values.device.productFamily !== initialValues.device.productFamily) {
      setFieldTouched('device.productFamily');
    }
  }, [values.device.productFamily, initialValues.device.productFamily, setFieldTouched]);

  return (
    <>
      <Typography variant="subtitle1" sx={{ mb: 3 }}>
        {t('device.management.asset.info.tru-info')}
      </Typography>
      <Box mb={2.5}>
        <FormSelect
          labelId="device.productFamily.label"
          label={t('device.management.drawer.product-family')}
          name="device.productFamily"
          value={values.device.productFamily ?? ''}
          onChange={handleChange}
          required
          readOnly={!deviceEditAllowed}
          onBlur={handleBlur}
          error={!!errors.device?.productFamily}
          sx={{ maxWidth: 380 }}
          fullWidth
          disableUnderline
        >
          {filteredProductFamilies.map(({ family }) => (
            <MenuItem key={family} value={family}>
              {family}
            </MenuItem>
          ))}
        </FormSelect>
        {errors.device?.productFamily && <FormHelperText error>{errors.device.productFamily}</FormHelperText>}
      </Box>
      <>
        <FormSelect
          label={t('device.management.device.info.TRU-control-system-type')}
          name="device.truControlSystemType"
          value={values.device.truControlSystemType}
          onChange={(event) => {
            setFieldValue('device.truControlSystemType', event.target.value);
          }}
          size="small"
          readOnly={!deviceEditAllowed}
          onBlur={handleBlur}
          error={!!errors.device?.truControlSystemType}
          labelId="device.truControlSystemType.label"
          sx={{ mb: 2.5, maxWidth: 380 }}
          fullWidth
          disableUnderline
        >
          {filteredControllerTypes?.map((controller) => (
            <MenuItem key={controller} value={controller}>
              {controller}
            </MenuItem>
          ))}
        </FormSelect>
        {errors.device?.truControlSystemType && (
          <FormHelperText error>{errors.device.truControlSystemType}</FormHelperText>
        )}
      </>
      <TextField
        id="device.truSerialNumber"
        name="device.truSerialNumber"
        size="small"
        value={values?.device?.truSerialNumber}
        onChange={handleChange}
        InputProps={{
          readOnly: !deviceEditAllowed,
        }}
        onBlur={handleBlur}
        error={!!errors.device?.truSerialNumber}
        helperText={errors.device?.truSerialNumber}
        label={t('device.management.device.info.TRU-serial-number')}
        sx={{ mb: 2.5, maxWidth: 380 }}
        fullWidth
      />
      <TextField
        id="device.truModelNumber"
        name="device.truModelNumber"
        size="small"
        value={values?.device?.truModelNumber}
        onChange={handleChange}
        InputProps={{
          readOnly: !deviceEditAllowed,
        }}
        onBlur={handleBlur}
        error={!!errors.device?.truModelNumber}
        helperText={errors.device?.truModelNumber}
        label={t('device.management.device.info.TRU-model-number')}
        sx={{ maxWidth: 380 }}
        fullWidth
      />
    </>
  );
};

TruInfo.displayName = 'TruInfo';
