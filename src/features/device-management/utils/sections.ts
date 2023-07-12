import { TFunction } from 'i18next';
import { ProductFamilyType } from '@carrier-io/lynx-fleet-types';

import { DeviceCommissioningFormValues, SectionId } from '../types';
import { DeviceCommissioningContextInterface } from '../providers';

import { getInitialSensorValues } from './sensors';
import { getTruInfoByFotawebGroup } from './getTruInfoByFotawebGroup';

export const getControlSectionId = (contolId: string): SectionId | undefined => {
  switch (contolId) {
    case 'device.productFamily':
    case 'fotaweb.groupId':
      return 'device';

    case 'asset.name':
      return 'asset';

    default:
      break;
  }

  return undefined;
};

export const getInitialValues = (
  {
    flespiData,
    device,
    asset,
    fotawebDevice,
    fotawebGroups,
  }: Pick<DeviceCommissioningContextInterface['snapshot'], 'flespiData' | 'device' | 'asset'> &
    Pick<DeviceCommissioningContextInterface, 'fotawebDevice' | 'fotawebGroups'>,
  t: TFunction
): DeviceCommissioningFormValues => {
  const truSerialNumber = flespiData?.freezer_serial_number || device?.truSerialNumber;
  const truModelNumber = flespiData?.freezer_model_number || device?.truModelNumber;
  const { productFamily, truControlSystemType } = getTruInfoByFotawebGroup(
    fotawebDevice?.group_name,
    (device?.productFamily as ProductFamilyType) || '',
    flespiData?.freezer_control_mode
  );

  let groupConf;
  let groupFirmware;

  if (fotawebDevice?.group_id && fotawebGroups) {
    const currentGroup = fotawebGroups.find((group) => group.id === fotawebDevice.group_id);

    if (currentGroup) {
      groupConf = currentGroup.configuration?.name;
      groupFirmware = currentGroup.firmware?.name;
    }
  }

  return {
    device: {
      id: device?.id ?? '',
      productFamily,
      truControlSystemType,
      configTaskStatus: device?.configTaskStatus,
      configTask: device?.configTask,
      firmwareTask: device?.firmwareTask,
      truSerialNumber: truSerialNumber || '',
      truModelNumber: truModelNumber || '',
      compartmentConfig: {
        comp1Configured: device?.compartmentConfig?.comp1Configured || true,
        comp2Configured: device?.compartmentConfig?.comp2Configured || false,
        comp3Configured: device?.compartmentConfig?.comp3Configured || false,
      },
    },
    asset: {
      id: asset?.id ?? '',
      name: asset?.name ?? '',
      licensePlateNumber: asset?.licensePlateNumber ?? '',
      notes: asset?.notes ?? '',
    },
    sensorConfiguration: getInitialSensorValues(t, flespiData, device),
    fotaweb: {
      groupId: fotawebDevice?.group_id,
      groupName: fotawebDevice?.group_name ?? '',
      groupConf,
      groupFirmware,
    },
  };
};
