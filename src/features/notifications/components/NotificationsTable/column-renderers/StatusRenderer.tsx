import Chip from '@carrier-io/fds-react/Chip';
import { useTranslation } from 'react-i18next';
import { ICellRendererParams } from '@ag-grid-community/core';

export function StatusRenderer({ value }: ICellRendererParams) {
  const { t } = useTranslation();
  const label = value ? t('common.active') : t('common.inactive');
  const color = value ? 'primary' : 'default';

  return <Chip color={color} label={label} size="small" lightBackground />;
}
