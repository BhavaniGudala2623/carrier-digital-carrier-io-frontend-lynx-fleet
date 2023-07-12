import { useTranslation } from 'react-i18next';
import { ICellRendererParams } from '@ag-grid-community/core';
import { NotificationPageItem } from '@carrier-io/lynx-fleet-types';

import { TableCellLink } from '@/components';

interface RuleRendererProps {
  onRuleViewChange: (anchor: HTMLElement | null, notification: NotificationPageItem | undefined) => void;
}

export const RuleRenderer = (
  { data }: ICellRendererParams<NotificationPageItem>,
  { onRuleViewChange }: RuleRendererProps
) => {
  const { t } = useTranslation();

  return (
    <TableCellLink onClick={(event) => onRuleViewChange(event.currentTarget, data)}>
      {t('common.view')}
    </TableCellLink>
  );
};
