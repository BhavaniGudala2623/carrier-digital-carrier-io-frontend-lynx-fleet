import { Device, Maybe } from '@carrier-io/lynx-fleet-types';

export const parseActivationDate = (date: Device['activationDate']): Maybe<Date> => {
  if (!date) {
    return null;
  }

  const isNumber = !Number.isNaN(Number(date));

  if (isNumber) {
    return new Date(Number(date));
  }

  return new Date(date);
};
