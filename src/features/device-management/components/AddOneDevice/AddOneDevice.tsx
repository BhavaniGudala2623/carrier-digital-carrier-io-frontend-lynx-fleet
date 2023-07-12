import { useState } from 'react';
import Button from '@carrier-io/fds-react/Button';
import TextField from '@carrier-io/fds-react/TextField';
import Box from '@carrier-io/fds-react/Box';
import { Field, FieldProps, Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import { CreateDeviceInput } from '@carrier-io/lynx-fleet-types';

import { provisionDevice } from '../../stores';
import { useDeviceProvision } from '../../stores/utils';

import {
  validateIccidField,
  validateImeiField,
  validateSerialNumberField,
} from './validationSchemaAddDevice';

import { textFieldStyle } from '@/constants';
import { useAppDispatch } from '@/stores';

interface AddOneDeviceProps {
  onClose: () => void;
}

export const AddOneDevice = ({ onClose }: AddOneDeviceProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [validationLoading, setValidationLoading] = useState(false);
  const { isLoading: isSubmitting } = useDeviceProvision();

  const loadingCallback = (value: boolean) => {
    setValidationLoading(value);
  };

  const initialValues: CreateDeviceInput = {
    serialNumber: '',
    imei: '',
    iccid: '',
  };

  const handleSubmitDevice = (input: CreateDeviceInput) => {
    dispatch(
      provisionDevice(
        {
          serialNumber: input.serialNumber,
          imei: input.imei,
          iccid: input.iccid,
          hardwareTypeId: 0,
        },
        t('device.management.device.provisioning.device-сreated'),
        () => {
          onClose();
        }
      )
    );
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmitDevice}
      enableReinitialize
      validateOnChange
      validateOnBlur
    >
      {({ isValid, values, errors, touched, handleChange, handleBlur, handleSubmit }) => {
        const isSubmitButtonDisabled = validationLoading || !isValid || isSubmitting;

        return (
          <>
            <Field
              id="serialNumber"
              name="serialNumber"
              type="text"
              validate={(value) => validateSerialNumberField(value, loadingCallback)}
              value={values.serialNumber}
              onChange={handleChange}
              onBlur={handleBlur}
            >
              {(props: FieldProps) => {
                const { field } = props;

                return (
                  <TextField
                    label={t('device.management.drawer.device-serial-number')}
                    id="serialNumber"
                    name="serialNumber"
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    value={field.value}
                    sx={textFieldStyle}
                    error={touched.serialNumber && Boolean(errors.serialNumber)}
                    helperText={touched.serialNumber && errors.serialNumber && t(errors.serialNumber)}
                    size="small"
                    required
                    fullWidth
                  />
                );
              }}
            </Field>
            <Field
              id="imei"
              name="imei"
              type="text"
              validate={(value) => validateImeiField(value, loadingCallback)}
              value={values.imei}
              onChange={handleChange}
              onBlur={handleBlur}
            >
              {(props: FieldProps) => {
                const { field } = props;

                return (
                  <TextField
                    label={t('device.management.drawer.device-IMEI-number')}
                    id="imei"
                    name="imei"
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    value={field.value}
                    sx={textFieldStyle}
                    error={touched.imei && Boolean(errors.imei)}
                    helperText={touched.imei && errors.imei && t(errors.imei)}
                    size="small"
                    required
                    fullWidth
                  />
                );
              }}
            </Field>
            <Field
              id="iccid"
              name="iccid"
              type="text"
              validate={(value) => validateIccidField(value, loadingCallback)}
              value={values.iccid}
              onChange={handleChange}
              onBlur={handleBlur}
            >
              {(props: FieldProps) => {
                const { field } = props;

                return (
                  <TextField
                    label={t('device.management.drawer.device-ICCID')}
                    id="iccid"
                    name="iccid"
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    value={field.value}
                    sx={textFieldStyle}
                    error={touched.iccid && Boolean(errors.iccid)}
                    helperText={touched.iccid && errors.iccid && t(errors.iccid)}
                    size="small"
                    required
                    fullWidth
                  />
                );
              }}
            </Field>
            <Box display="flex" justifyContent="flex-end" my={1}>
              <Button autoFocus onClick={onClose} color="secondary" variant="outlined" sx={{ mr: 1 }}>
                {t('common.cancel')}
              </Button>
              <Button
                color="primary"
                onClick={() => handleSubmit()}
                type="submit"
                variant="outlined"
                disabled={isSubmitButtonDisabled}
              >
                {t('device.management.drawer.create-device')}
              </Button>
            </Box>
          </>
        );
      }}
    </Formik>
  );
};
