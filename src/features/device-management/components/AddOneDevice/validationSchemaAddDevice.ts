import { MainService } from '@carrier-io/lynx-fleet-data-lib';
import { DeviceFieldType } from '@carrier-io/lynx-fleet-types';
import { debounce } from 'lodash-es';

export const validateDeviceField = async (
  field: DeviceFieldType,
  value: string,
  loadingCallback: (value: boolean) => void
): Promise<boolean> => {
  loadingCallback(true);
  const {
    data: {
      validateCreateDeviceInput: { isValid },
    },
  } = await MainService.validateCreateDeviceInput({ input: { field, value } });
  loadingCallback(false);

  return isValid;
};

export const validateSerialNumberDebounced = debounce(validateDeviceField, 500);
export const validateImeiNumberDebounced = debounce(validateDeviceField, 500);
export const validateIccidNumberDebounced = debounce(validateDeviceField, 500);

const requiredMessageMap: Record<DeviceFieldType, string> = {
  serialNumber: 'device.management.device.error.serial-number-required',
  imei: 'device.management.device.error.IMEI-number-required',
  iccid: 'device.management.device.error.ICCID-number-required',
};

export const validateField = async ({
  field,
  value,
  loadingCallback,
  request,
  errorMessage,
}: {
  field: DeviceFieldType;
  value: string;
  loadingCallback: (value: boolean) => void;
  request: (
    field: DeviceFieldType,
    value: string,
    loadingCallback: (value: boolean) => void
  ) => Promise<boolean> | undefined;
  errorMessage: string;
}) => {
  let validateMessage;

  if (!value) {
    validateMessage = requiredMessageMap[field];

    return validateMessage;
  }

  if (value) {
    try {
      const response = await request(field, value, loadingCallback);

      validateMessage = typeof response === 'undefined' || response ? '' : errorMessage;
    } catch (e) {
      loadingCallback(false);
      // eslint-disable-next-line no-console
      console.error(e);
    }
  }

  return validateMessage as string;
};

export const validateSerialNumberField = (value: string, loadingCallback: (value: boolean) => void) =>
  validateField({
    field: 'serialNumber',
    value,
    loadingCallback,
    request: validateSerialNumberDebounced,
    errorMessage: 'device.management.device-serial-number-exist-error',
  });

export const validateImeiField = (value: string, loadingCallback: (value: boolean) => void) =>
  validateField({
    field: 'imei',
    value,
    loadingCallback,
    request: validateImeiNumberDebounced,
    errorMessage: 'device.management.device-IMEI-number-exist-error',
  });

export const validateIccidField = (value: string, loadingCallback: (value: boolean) => void) =>
  validateField({
    field: 'iccid',
    value,
    loadingCallback,
    request: validateIccidNumberDebounced,
    errorMessage: 'device.management.device-ICCID-exist-error',
  });
