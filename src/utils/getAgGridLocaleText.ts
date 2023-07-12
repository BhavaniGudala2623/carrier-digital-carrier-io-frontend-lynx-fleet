import { TFunction } from 'i18next';

export const getAgGridLocaleText = (t: TFunction): Record<string, string> => ({
  searchOoo: `${t('common.search')}...`,
  pinColumn: t('common.grid.pinColumn') as string,
  pinLeft: t('common.grid.pinLeft') as string,
  pinRight: t('common.grid.pinRight') as string,
  noPin: t('common.grid.noPin') as string,
  autosizeThiscolumn: t('common.grid.autosizeThiscolumn') as string,
  autosizeAllColumns: t('common.grid.autosizeAllColumns') as string,
  resetColumns: t('common.reset-columns') as string,
  expandAll: t('common.grid.expandAll') as string,
  collapseAll: t('common.grid.collapseAll') as string,
});
