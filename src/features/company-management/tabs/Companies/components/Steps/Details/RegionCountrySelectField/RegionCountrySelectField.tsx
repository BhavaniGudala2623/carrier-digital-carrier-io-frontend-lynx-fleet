import { Maybe } from '@carrier-io/lynx-fleet-types';
import { RegionType } from '@carrier-io/lynx-fleet-common';
import { getIn, useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';

import { RegionCountrySelect } from './RegionCountrySelect';

import { CreateCompanyFormData } from '@/features/company-management/types';

interface RegionCountrySelectFieldProps {
  region?: Maybe<RegionType>;
  country?: Maybe<string>;
  regionFieldId?: string;
  countryFieldId?: string;
  allowedRegions: Maybe<string[]>;
  allowedCountries: Maybe<string[]>;
}

export const RegionCountrySelectField = ({
  region,
  country,
  regionFieldId,
  countryFieldId,
  allowedRegions,
  allowedCountries,
}: RegionCountrySelectFieldProps) => {
  const { t } = useTranslation();

  const { errors, setFieldValue, setFieldTouched, touched } = useFormikContext<CreateCompanyFormData>();

  const onRegionChange = (r: RegionType) => {
    if (regionFieldId) {
      setFieldTouched(regionFieldId, true);
      setFieldValue(regionFieldId, r);
    }
  };

  const onCountryChange = (countryCode: string) => {
    if (countryFieldId) {
      setFieldValue(countryFieldId, countryCode);
    }
  };

  const regionError = regionFieldId
    ? getIn(touched, regionFieldId) && getIn(errors, regionFieldId) && t(getIn(errors, regionFieldId))
    : undefined;

  return (
    <RegionCountrySelect
      region={region}
      country={country}
      onRegionChange={onRegionChange}
      onCountryChange={onCountryChange}
      regionError={regionError}
      allowedRegions={allowedRegions}
      allowedCountries={allowedCountries}
    />
  );
};
