import { selectDeviceProvisionState } from './selectors';

import { useAppSelector } from '@/stores';

export const useDeviceProvision = () => useAppSelector(selectDeviceProvisionState);
