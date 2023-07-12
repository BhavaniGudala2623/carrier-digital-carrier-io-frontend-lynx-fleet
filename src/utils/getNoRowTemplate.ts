import { TFunction } from 'i18next';

export const getNoRowsTemplate = (t: TFunction) => `<span>${t('common.table.no-rows-to-show')}</span>`;
