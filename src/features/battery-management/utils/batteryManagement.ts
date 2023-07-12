import { BatterySOCStats } from '@carrier-io/lynx-fleet-types';

export const getGraphData = (data: BatterySOCStats) => {
  const { low, normal, high } = data;

  const lowChargingCount = (low?.socDetails?.chargingAxle ?? 0) + (low?.socDetails?.chargingGrid ?? 0);
  const lowActiveCount = low?.socDetails?.inUse ?? 0;
  const normalChargingCount =
    (normal?.socDetails?.chargingAxle ?? 0) + (normal?.socDetails?.chargingGrid ?? 0);
  const normalActiveCount = normal?.socDetails?.inUse ?? 0;
  const highChargingCount = (high?.socDetails?.chargingAxle ?? 0) + (high?.socDetails?.chargingGrid ?? 0);
  const highActiveCount = high?.socDetails?.inUse ?? 0;

  return {
    lowChargingCount,
    lowActiveCount,
    normalChargingCount,
    normalActiveCount,
    highChargingCount,
    highActiveCount,
    total:
      lowChargingCount +
      lowActiveCount +
      normalActiveCount +
      normalChargingCount +
      highActiveCount +
      highChargingCount,
  };
};
