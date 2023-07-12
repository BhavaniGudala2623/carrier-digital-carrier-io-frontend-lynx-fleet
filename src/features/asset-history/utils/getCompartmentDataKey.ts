import { isAT52Device } from './isAT52Device';

export const getCompartmentDataKey = (compNumber: string, freezer_control_mode?: string | null): string =>
  isAT52Device(freezer_control_mode)
    ? `freezer_trs_comp${compNumber}_power_status`
    : `freezer_comp${compNumber}_power_status`;
