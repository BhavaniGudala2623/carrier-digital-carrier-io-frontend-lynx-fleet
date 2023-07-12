const i18nKeysWithTemperature = [
  'assets.asset.table.c1-box-sensor',
  'assets.asset.table.c1-ras-sensor',
  'assets.asset.table.c1-sas-sensor',
  'assets.asset.table.c1-box-datacold',
  'assets.asset.table.c1-ras-datacold',
  'assets.asset.table.c1-sas-datacold',
  'assets.asset.table.c2-box-sensor',
  'assets.asset.table.c2-ras-sensor',
  'assets.asset.table.c2-sas-sensor',
  'assets.asset.table.c2-box-datacold',
  'assets.asset.table.c2-ras-datacold',
  'assets.asset.table.c2-sas-datacold',
  'assets.asset.table.c3-box-sensor',
  'assets.asset.table.c3-ras-sensor',
  'assets.asset.table.c3-sas-sensor',
  'assets.asset.table.c3-box-datacold',
  'assets.asset.table.c3-ras-datacold',
  'assets.asset.table.c3-sas-datacold',
];

export const isI18nKeyForTemperatureColumn = (i18nKey: string) => i18nKeysWithTemperature.includes(i18nKey);
