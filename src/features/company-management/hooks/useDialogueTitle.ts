import { useTranslation } from 'react-i18next';

import { selectActiveCompanyIds, selectAllCompanies } from '../stores';

import { useAppSelector } from '@/stores';

export const useDialogueTitle = () => {
  const { t } = useTranslation();
  const companyIds = useAppSelector(selectActiveCompanyIds);
  const allCompanies = useAppSelector(selectAllCompanies);

  if (companyIds.length > 1) {
    return t('company.filter.multiple');
  }

  if (companyIds.length === 1) {
    const currentCompany = allCompanies.find((company) => company.id === companyIds[0]);

    return currentCompany?.name;
  }

  return t('company.filter.all-companies');
};
