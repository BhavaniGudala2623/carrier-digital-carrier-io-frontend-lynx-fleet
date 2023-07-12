import { useState } from 'react';

import { DeviceManagementTabs } from '../types';

export const useTabsContent = () => {
  const [totalDeviceCount, setTotalDeviceCount] = useState<number>(0);
  const [totalBluetoothSensorsCount, setTotalBluetoothSensorsCount] = useState<number>(0);
  const [totalDeviceCountLoading, setTotalDeviceCountLoading] = useState(false);
  const [totalBluetoothSensorsCountLoading, setTotalBluetoothSensorsCountLoading] = useState(false);
  const [selectedTabId, setSelectedTabId] = useState<DeviceManagementTabs>('DEVICES');

  return {
    totalDeviceCount,
    setTotalDeviceCount,
    totalBluetoothSensorsCount,
    setTotalBluetoothSensorsCount,
    totalDeviceCountLoading,
    setTotalDeviceCountLoading,
    totalBluetoothSensorsCountLoading,
    setTotalBluetoothSensorsCountLoading,
    selectedTabId,
    setSelectedTabId,
  };
};
