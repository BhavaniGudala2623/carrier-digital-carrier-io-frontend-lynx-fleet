import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Group } from '@carrier-io/lynx-fleet-types';

import { AddUserInput } from '../types';

import { localeToCountryCode } from '@/utils';

export const useReviewData = (values: AddUserInput, groupData?: Group[]) => {
  const { t } = useTranslation();

  const { company, firstName, lastName, email, phone, preferences, editableGroups, nonEditableGroups } =
    values;
  const { language, timezone, temperature, distance, volume, speed } = preferences;

  const userInfo = useMemo(
    () => [
      { label: t('company.management.company-name'), text: company?.name },
      { label: t('user.management.first-name'), text: firstName },
      { label: t('user.management.last-name'), text: lastName },
      { label: t('common.email'), text: email },
      { label: t('common.components.phone-number'), text: phone },
    ],
    [t, company, firstName, lastName, email, phone]
  );

  const companyPreferencesInfo = useMemo(
    () => [
      {
        label: t('common.language'),
        text: t(`company.management.language.${localeToCountryCode(language)}`),
      },
      { label: t('company.management.timezone'), text: timezone },
      { label: t('preferences.temperature'), text: temperature },
      { label: t('preferences.distance'), text: distance },
      { label: t('preferences.volume'), text: volume },
      { label: t('preferences.speed'), text: speed },
    ],
    [t, language, timezone, temperature, distance, volume, speed]
  );

  const groupInfo = useMemo(() => {
    const groupCount = editableGroups.length + nonEditableGroups.length;
    const groupRoleMap = [...editableGroups, ...nonEditableGroups].flatMap((group) => {
      const foundGroup = groupData?.find((g) => g.id === group.id);

      return foundGroup ? [{ name: foundGroup.name, role: group.role }] : [];
    });

    return {
      description: [
        {
          label: t('company.management.add-a-user.member-of-groups'),
          text: t('company.management.add-a-user.member-of-groups-total', { groupCount }),
        },
      ],
      groupRoleMap,
    };
  }, [t, editableGroups, nonEditableGroups, groupData]);

  return { userInfo, companyPreferencesInfo, groupInfo };
};
