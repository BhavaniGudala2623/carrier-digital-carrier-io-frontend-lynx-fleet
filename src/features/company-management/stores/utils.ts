import { selectCompanyManagementState } from './selectors';

import { useAppSelector } from '@/stores';

export const useCompanyManagementState = () => useAppSelector(selectCompanyManagementState);
