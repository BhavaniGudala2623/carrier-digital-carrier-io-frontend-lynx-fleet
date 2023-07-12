import { UserGroupConfig } from '@carrier-io/lynx-fleet-types';
import { useTranslation } from 'react-i18next';

import { ListPopover } from '@/components/ListPopover';

export const UserGroupsRenderer = ({ value }: { value: UserGroupConfig[] | null }) => {
  const { t } = useTranslation();
  const groups =
    value?.map((config) => ({
      label: config.group.name,
      value: config.group.id,
    })) || [];

  const label = `${groups.length} ${
    groups.length === 1 ? t('company.management.group') : t('company.management.groups')
  }`;

  return <ListPopover items={groups} containerContent={label} />;
};
