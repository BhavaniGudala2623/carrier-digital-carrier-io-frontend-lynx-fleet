import { ProductFamilyType } from '@carrier-io/lynx-fleet-types';

import { productFamilies } from '@/constants';

export const getProductFamiliesByFotawebGroup = (groupName?: string) => {
  const productFamily = groupName?.split(/\s|\//g)[0].toLowerCase();
  const trsProductFamilies: ProductFamilyType[] = ['Iceland', 'Syberia'];

  if (productFamily === 'standalone') {
    return productFamilies;
  }

  if (productFamily === 'trs') {
    return productFamilies.filter((item) => trsProductFamilies.includes(item.family));
  }

  return productFamilies.filter((item) => item.family.toLowerCase() === productFamily);
};
