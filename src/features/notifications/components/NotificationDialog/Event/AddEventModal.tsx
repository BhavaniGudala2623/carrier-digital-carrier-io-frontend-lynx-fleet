import { useCallback, useState } from 'react';
import {
  Maybe,
  NotificationRuleCondition,
  NotificationRuleConditionType,
} from '@carrier-io/lynx-fleet-types';

import {
  DoorDialog,
  GeofenceDialog,
  AlarmDialog,
  FuelDialog,
  BatteryDialog,
  TemperatureDeviationDialog,
  AssetOfflineDialog,
} from './Modals';

import { useApplicationContext } from '@/providers/ApplicationContext';

export interface AddEventModalProps {
  modal: Maybe<NotificationRuleConditionType>;
  handleCancel: () => void;
  handleOk: (event: NotificationRuleCondition) => void;
  initialValue?: NotificationRuleCondition;
  exclude?: boolean;
}

export function useAddEventModal() {
  const [currentModal, setCurrentModal] = useState<Maybe<NotificationRuleConditionType>>(null);

  const handleCloseModal = useCallback(() => {
    setCurrentModal(null);
  }, []);

  const handleOpenModal = useCallback((newModal: NotificationRuleConditionType) => {
    setCurrentModal(newModal);
  }, []);

  return {
    currentModal,
    handleOpenModal,
    handleCloseModal,
  };
}

export function AddEventModal({ modal, handleCancel, handleOk, initialValue, exclude }: AddEventModalProps) {
  const { featureFlags } = useApplicationContext();
  const isFeatureFuelLevelEnabled = featureFlags.REACT_APP_FEATURE_FUEL_LEVEL;
  const isFeatureBatteryLevelEnabled = featureFlags.REACT_APP_FEATURE_BATTERY_LEVEL;
  const isAssetOfflineEnabled = featureFlags.REACT_APP_FEATURE_ASSET_OFFLINE;

  return (
    <>
      {(modal === 'TEMPERATURE_DEVIATION' ||
        modal === 'TEMPERATURE_DEVIATION_FIXED_VALUE' ||
        modal === 'SETPOINT_CHANGE') && (
        <TemperatureDeviationDialog
          expression={initialValue?.expression}
          handleCancel={handleCancel}
          handleOk={handleOk}
          exclude={exclude}
          type={modal}
        />
      )}
      {modal === 'DOOR' && (
        <DoorDialog
          expression={initialValue?.expression}
          handleCancel={handleCancel}
          handleOk={handleOk}
          exclude={exclude}
        />
      )}
      {modal === 'GEOFENCE' && (
        <GeofenceDialog
          expression={initialValue?.expression}
          handleCancel={handleCancel}
          handleOk={handleOk}
          exclude={exclude}
        />
      )}
      {modal === 'FUEL_LEVEL' && isFeatureFuelLevelEnabled && (
        <FuelDialog
          expression={initialValue?.expression}
          handleCancel={handleCancel}
          handleOk={handleOk}
          exclude={exclude}
          type={modal}
        />
      )}
      {modal === 'BATTERY_LEVEL' && isFeatureBatteryLevelEnabled && (
        <BatteryDialog
          expression={initialValue?.expression}
          handleCancel={handleCancel}
          handleOk={handleOk}
          exclude={exclude}
          type={modal}
        />
      )}
      {modal === 'ASSET_OFFLINE' && isAssetOfflineEnabled && (
        <AssetOfflineDialog
          expression={initialValue?.expression}
          handleCancel={handleCancel}
          handleOk={handleOk}
          exclude={exclude}
          type={modal}
        />
      )}
      {modal === 'TRU_ALARM' && (
        <AlarmDialog
          expression={initialValue?.expression}
          handleCancel={handleCancel}
          handleOk={handleOk}
          exclude={exclude}
        />
      )}
    </>
  );
}
