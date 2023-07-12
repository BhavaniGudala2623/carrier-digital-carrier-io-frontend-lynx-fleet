import { getProductFamilyByFotawebGroup } from './getProductFamilyByFotawebGroup';
import { isProductFamilyHE } from './isProductFamilyHE';

import { truControllers } from '@/constants';

export const getControllersByFotawebGroup = (groupName?: string) => {
  const productFamily = getProductFamilyByFotawebGroup(groupName);

  if (!productFamily) {
    return truControllers;
  }

  if (productFamily && groupName) {
    if (isProductFamilyHE(groupName)) {
      return productFamily.heControllers;
    }

    return productFamily.controllers;
  }

  return [];
};
