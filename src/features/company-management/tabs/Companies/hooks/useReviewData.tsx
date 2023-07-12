import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { CreateCompanyFormData } from '../../../types';
import { companyTypeEntity } from '../../../constants';
import { accessLevelTextMap, getFeatureConfigs } from '../../common';

import { CompanyAddressRenderer, CompanyAdminRenderer } from '@/components';
import { localeToCountryCode } from '@/utils';

export const useReviewData = ({
  name: companyName,
  companyType,
  contactInfo,
  companyPreferences,
  parentCompany,
  features,
  contractSettings,
}: CreateCompanyFormData) => {
  const { t } = useTranslation();

  const companyInfo = useMemo(
    () => [
      { label: t('common.components.parent-company'), text: parentCompany?.name || t('common.n-a') },
      { label: t('company.management.company-name'), text: companyName },
      {
        label: t('company.management.company-type'),
        text: (companyType && t(companyTypeEntity[companyType])) || companyType,
      },
      {
        label: t('company.management.drawer.company-address'),
        text: contactInfo && <CompanyAddressRenderer contactInfo={contactInfo} />,
      },
      {
        label: t('common.components.phone-number'),
        text: contactInfo?.phone,
      },
      {
        label: t('company.management.company-admin'),
        text: contactInfo && <CompanyAdminRenderer contactInfo={contactInfo} />,
      },
      {
        label: t('company.management.contract'),
        text: contractSettings.usesBluetoothSensors
          ? t('company.management.company.contract.replacement-schedule', {
              months: contractSettings.bluetoothSensorsReplacementPeriodInMonths,
            })
          : t('common.n-a'),
      },
    ],
    [
      companyName,
      companyType,
      contactInfo,
      parentCompany?.name,
      t,
      contractSettings.usesBluetoothSensors,
      contractSettings.bluetoothSensorsReplacementPeriodInMonths,
    ]
  );
  const preferences = useMemo(
    () => [
      {
        label: t('preferences.language'),
        text: t(
          `company.management.language.${localeToCountryCode(companyPreferences?.language || 'en-US')}`
        ),
      },
      {
        label: t('preferences.timezone'),
        text: companyPreferences?.timeZone,
      },
      {
        label: t('preferences.temperature'),
        text: companyPreferences?.temperature,
      },
      {
        label: t('preferences.distance'),
        text: companyPreferences?.distance,
      },
      {
        label: t('preferences.volume'),
        text: companyPreferences?.volume,
      },
      {
        label: t('preferences.speed'),
        text: companyPreferences?.speed,
      },
    ],
    [
      companyPreferences?.distance,
      companyPreferences?.language,
      companyPreferences?.speed,
      companyPreferences?.temperature,
      companyPreferences?.timeZone,
      companyPreferences?.volume,
      t,
    ]
  );

  const featuresData = useMemo(
    () =>
      getFeatureConfigs(true)?.map((feature) => {
        const level = features?.find(({ name }) => name === feature.name);

        return {
          text: t(level?.accessLevel ? accessLevelTextMap[level.accessLevel] : 'common.off'),
          label: t(`company.management.users.create-group.step.features-name.${feature.name}`),
        };
      }),
    [features, t]
  );

  return { preferences, companyInfo, featuresData };
};
