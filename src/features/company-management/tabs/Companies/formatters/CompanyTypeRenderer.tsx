import { useTranslation } from 'react-i18next';

import { CompaniesTableParams } from '../types';

export const CompanyTypeRenderer = ({ data }: CompaniesTableParams) => {
  const { t } = useTranslation();
  const companyType: string = data?.companyType ? data.companyType : '';

  return companyType ? t(`company.management.companyType.${companyType}`) : '';
};
