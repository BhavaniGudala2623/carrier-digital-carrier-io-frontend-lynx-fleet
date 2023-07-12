import { SnapshotDataEx } from '../../../types/asset';

const mapCallback = (alarm) => ({
  ...alarm,
  response: alarm?.response?.replace(/\s/g, '').toLowerCase() === 'shutdown' ? 'Shut Down' : alarm?.response,
});

export const replaceAlarmResponseName = (asset: SnapshotDataEx): SnapshotDataEx => ({
  ...asset,
  activeFreezerAlarms: [...(asset.activeFreezerAlarms?.map(mapCallback) || [])],
  inactiveFreezerAlarms: [...(asset.inactiveFreezerAlarms?.map(mapCallback) || [])],
});
