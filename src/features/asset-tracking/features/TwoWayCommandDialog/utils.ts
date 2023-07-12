import { toFahrenheit } from '@/utils/temperature';

export function getStatus(asset, comp) {
  if (asset?.flespiData?.synthetic_tru_status === 'OFF') {
    return false;
  }

  const temp = asset?.flespiData?.[`freezer_comp${comp}_mode`];

  return !temp || temp.toLowerCase() !== 'off';
}

export const getSetpointValue = (asset, compNo, tempUnit) => {
  let setpoint = asset?.flespiData?.[`freezer_zone${compNo}_temperature_setpoint`] || 0;
  if (tempUnit === 'F') {
    setpoint = toFahrenheit(setpoint);
  }

  return Math.round(setpoint);
};

export const toSelectedUnit = (tempUnit) => (t) => tempUnit === 'C' ? t : toFahrenheit(t);
