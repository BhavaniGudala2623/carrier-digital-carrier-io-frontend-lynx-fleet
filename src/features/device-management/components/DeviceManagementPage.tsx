import { DeviceProvisioningProvider } from '../providers';

import { DeviceManagement } from './DeviceManagement';

export function DeviceManagementPage() {
  return (
    <DeviceProvisioningProvider>
      <DeviceManagement />
    </DeviceProvisioningProvider>
  );
}
