import { useMemo } from 'react';
import { Maybe } from '@carrier-io/lynx-fleet-types';
import { addWeeks, differenceInYears, subYears } from 'date-fns';

import { getDeviceActivationDate } from '../stores';

import { useAppSelector } from '@/stores';

export const useDateRange = (startDate: Maybe<Date>) => {
  const activationDate = useAppSelector(getDeviceActivationDate);

  const minDate = useMemo(() => {
    const now = new Date();

    if (!activationDate || differenceInYears(now, activationDate) >= 2) {
      return subYears(now, 2);
    }

    return activationDate;
  }, [activationDate]);

  const maxDate = useMemo(() => (startDate ? addWeeks(startDate, 1) : undefined), [startDate]);

  return { minDate, maxDate };
};
