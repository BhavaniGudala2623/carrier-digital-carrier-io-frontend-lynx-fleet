import { TFunction } from 'i18next';

import type { SnapshotDataEx } from '@/features/common';

/**
 *
 * @param {number} level Battery Level
 * @param {*} current Battery Current
 * @returns {BatteryStatusEnum}
 */

const batteryStatus = Object.freeze({
  disconnected: 'assets.battery.status.disconnected',
  danger: 'assets.battery.status.danger',
  low: 'assets.battery.status.low',
  ok: 'assets.battery.status.ok',
});

export function getBatteryStatus(level: number, current?: number | null) {
  if (current === 0) {
    return batteryStatus.disconnected;
  }
  if (level < 10) {
    return batteryStatus.danger;
  }
  if (level < 30) {
    return batteryStatus.low;
  }

  return batteryStatus.ok;
}

export function BatteryStatusRenderer(params: { data: SnapshotDataEx; value: number }, t: TFunction) {
  const { value, data } = params;
  if (value === null || value === undefined) {
    return <span />;
  }

  const status = getBatteryStatus(value, data?.flespiData?.battery_current);
  let labelClass = '';
  switch (status) {
    case batteryStatus.disconnected:
      labelClass = 'dark';
      break;
    case batteryStatus.danger:
      labelClass = 'danger';
      break;
    case batteryStatus.low:
      labelClass = 'warning';
      break;
    default:
      labelClass = 'success';
      break;
  }

  const className = `w-100 label label-lg label-light-${labelClass} label-inline`;

  return <span className={className}>{t(status)}</span>;
}
