import { Maybe } from '@carrier-io/lynx-fleet-types';

import { productFamilies } from '@/constants';

export const productFamilyFormatter = (value?: Maybe<string | number>) => {
  if (!value) {
    return '';
  }

  const formattedValue = value.toString().split(' ')[0].toLowerCase();
  const productFamily = productFamilies.find((item) => item.family.toLowerCase() === formattedValue);

  return productFamily?.family ?? '';
};
