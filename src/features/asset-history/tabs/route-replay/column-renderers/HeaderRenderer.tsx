import Box from '@carrier-io/fds-react/Box';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TemperatureType } from '@carrier-io/lynx-fleet-types';

import { useStyles } from '../components/styles';
import { RouteHistoryDefaultColIds } from '../types';
import { timelineTableColumnsConfig } from '../utils';

import { ParamsProps } from '@/features/device-management/types';
import { addTemperatureUnit } from '@/utils';
import { TimelineHeaderDef } from '@/types';

export interface HeaderOptions {
  options?: {
    temperatureUnit?: TemperatureType;
    sensorColumnsConfig?: Record<RouteHistoryDefaultColIds, TimelineHeaderDef>;
  };
}
export const HeaderRenderer = (params: ParamsProps & HeaderOptions) => {
  const { column, setSort, options } = params;
  const { temperatureUnit, sensorColumnsConfig } = options ?? {};
  const classes = useStyles();
  const { t } = useTranslation();
  const config = { ...timelineTableColumnsConfig, ...(sensorColumnsConfig || {}) };

  const descSorted = `ag-icon ag-icon-desc ${classes.arrowSort}`;
  const ascSorted = `${descSorted} ${classes.sortAsc}`;
  const [styledArrow, setStyledArrow] = useState(column.sort === 'desc' ? descSorted : ascSorted);
  const colId = column.getColId();
  const colConfig = (config[colId] as TimelineHeaderDef) ?? ({ titleKey: colId } as TimelineHeaderDef);

  const style = { pl: colId === 'event' ? '28px' : 0 };

  const handleSorting = () => {
    if (column.getColId() === 'time') {
      if (column.sort === 'desc') {
        setSort('asc');
        setStyledArrow(ascSorted);
      } else {
        setSort('desc');
        setStyledArrow(descSorted);
      }
    }
  };

  let subTitle = colConfig.subTitleKey ? t(colConfig.subTitleKey) : '';
  if (colConfig.isTemperature && temperatureUnit) {
    subTitle = addTemperatureUnit(subTitle, temperatureUnit);
  }

  return (
    <Box onClick={colConfig.sortable ? handleSorting : () => {}}>
      <Box className={classes.topElement} sx={style}>
        {t(colConfig.titleKey)}
        {colConfig.sortable && <span className={styledArrow} />}
      </Box>
      <Box className={classes.bottomElement} sx={style}>
        {subTitle}
      </Box>
    </Box>
  );
};
