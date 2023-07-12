import { shallowEqual } from 'react-redux';

import { getDeviceInfo } from '../stores/selectors';

import { useAppSelector } from '@/stores';

export const useConfigStatus = () => {
  const deviceInfo = useAppSelector(getDeviceInfo, shallowEqual);

  return deviceInfo;
};
