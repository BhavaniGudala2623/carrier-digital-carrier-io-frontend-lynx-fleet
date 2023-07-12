import { FreezerControlType, Maybe, ProductFamilyType } from '@carrier-io/lynx-fleet-types';

import { getProductFamiliesByFotawebGroup } from './getProductFamiliesByFotawebGroup';

export const getTruInfoByFotawebGroup = (
  groupName?: string,
  deviceProductFamily?: Maybe<ProductFamilyType>,
  flespiControlType?: Maybe<FreezerControlType>
): { productFamily: Maybe<ProductFamilyType>; truControlSystemType: FreezerControlType | '' } => {
  if (!groupName) {
    return {
      productFamily: null,
      truControlSystemType: '',
    };
  }

  const groupNameSplitted = groupName.split(/\s|\//g);

  let productFamilyFromGroup = groupNameSplitted[0].toLowerCase();
  const productFamilyHE = groupNameSplitted[1] === 'HE';

  const productFamilies = getProductFamiliesByFotawebGroup(groupName);

  if (productFamilyFromGroup === 'trs') {
    productFamilyFromGroup = 'syberia';
  }

  const family = productFamilies.find((item) => item.family.toLowerCase().startsWith(productFamilyFromGroup));

  if (!family) {
    return {
      productFamily: null,
      truControlSystemType: '',
    };
  }

  const controllers = productFamilyHE ? (family.heControllers as FreezerControlType[]) : family.controllers;

  return {
    productFamily: productFamilies.length > 1 ? deviceProductFamily || null : productFamilies[0].family,
    truControlSystemType: controllers.length > 1 ? flespiControlType || '' : controllers[0],
  };
};
