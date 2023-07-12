import { Company } from '@carrier-io/lynx-fleet-types';

export const isRegionValid = (values: Company) => {
  const region = values?.contactInfo?.region;

  return !!region;
};
