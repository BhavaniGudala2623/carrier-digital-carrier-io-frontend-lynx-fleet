import { TFunction } from 'i18next';

import { CompaniesTableParams } from '../types';
import { getCompanyAdminFullName } from '../utils';

export const CompanyAdminRenderer = ({ data }: CompaniesTableParams, t: TFunction) =>
  getCompanyAdminFullName(data?.contactInfo) || t('common.n-a');
