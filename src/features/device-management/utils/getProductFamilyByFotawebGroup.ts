import { productFamilies } from '@/constants';
import { ProductFamily } from '@/types';

export const getProductFamilyByFotawebGroup = (groupName?: string): ProductFamily | undefined => {
  if (groupName) {
    let productFamily = groupName.split(/\s|\//g)[0].toLowerCase();

    if (productFamily === 'trs') {
      productFamily = 'syberia';
    }

    if (productFamily === 'standalone') {
      return undefined;
    }

    const family = productFamilies.find((item) => item.family.toLowerCase().startsWith(productFamily));

    return family;
  }

  return undefined;
};
