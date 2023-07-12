import Box from '@carrier-io/fds-react/Box';
import { ContactInfo } from '@carrier-io/lynx-fleet-types';
import { useTranslation } from 'react-i18next';

import { getCountryName } from '@/utils';

interface CompanyAddressRendererProps {
  contactInfo: ContactInfo;
}

export const CompanyAddressRenderer = ({
  contactInfo: { address, city, country, region },
}: CompanyAddressRendererProps) => {
  const { t } = useTranslation();
  const countryName = t(getCountryName(country ?? ''));
  const cityCountryLine = [city, countryName].filter(Boolean).join(', ');

  return (
    <Box textAlign="end">
      {address || t('common.n-a')}
      <br />
      {cityCountryLine}
      {cityCountryLine && <br />}
      {region}
    </Box>
  );
};
