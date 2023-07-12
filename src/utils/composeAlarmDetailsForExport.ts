import { FreezerAlarm, Maybe } from '@carrier-io/lynx-fleet-types';

import { ALARM_DETAILS_DELIM, ALARM_DETAIL_VALUES_DELIM } from '@/constants';

export const composeAlarmDetailsForExport = (
  activeFreezerAlarms: Maybe<Maybe<FreezerAlarm>[]> | undefined
): string => {
  if (activeFreezerAlarms) {
    const detailsForExport = activeFreezerAlarms.map(
      (alarm) => `${alarm?.code}${ALARM_DETAIL_VALUES_DELIM}${alarm?.description}`
    );

    return detailsForExport.join(ALARM_DETAILS_DELIM);
  }

  return '';
};
