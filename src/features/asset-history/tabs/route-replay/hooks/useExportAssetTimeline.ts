import { ColDef, ProcessCellForExportParams, ProcessHeaderForExportParams } from '@ag-grid-community/core';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getFileNameToExport } from '@carrier-io/lynx-fleet-common';

import { HeaderOptions } from '../column-renderers/HeaderRenderer';
import { EnrichedEventData, RouteHistoryDefaultColIds } from '../types';
import { useReplayTabDataContext } from '../providers';
import { timelineTableColumnsConfig } from '../utils';

import { addTemperatureUnit, formatDate } from '@/utils';
import { temperatureFormatter } from '@/components';
import { useUserSettings } from '@/providers/UserSettings';
import { TimelineHeaderDef } from '@/types';

export const useExportAssetTimeline = () => {
  const { assetId = '' } = useParams<{ assetId: string }>();
  const { userSettings } = useUserSettings();
  const { temperature: temperatureUnit, dateFormat, timezone } = userSettings;
  const { gridApi } = useReplayTabDataContext();
  const { t } = useTranslation();

  const formatDateAndTime = ({ value }: ProcessCellForExportParams) => {
    const date = formatDate(value, dateFormat, { timezone, dateOptions: { variant: 'date' } });
    const time = formatDate(value, dateFormat, {
      timezone,
      dateOptions: { variant: 'time', hideSeconds: true },
    });

    return `${date}, ${time}`;
  };

  const processCellCallback = (params: ProcessCellForExportParams<EnrichedEventData>) => {
    const { column, value, node } = params;
    const data = node?.data;

    if (!data) {
      return '';
    }

    const { position_longitude, position_latitude, address } = data;

    switch (column.getColId()) {
      case 'time':
        return formatDateAndTime(params);
      case 'event':
        return value;
      case 'location':
        return (
          address ||
          `${t('assets.asset.table.latitude')}: ${position_latitude}, \n${t(
            'assets.asset.table.longitude'
          )}: ${position_longitude}`
        );
      default:
        return temperatureFormatter(params, { units: temperatureUnit });
    }
  };

  const processHeaderCallback = (params: ProcessHeaderForExportParams) => {
    const colId = params.column.getColId();
    const {
      sensorColumnsConfig,
    }: HeaderOptions & { sensorColumnsConfig: Record<RouteHistoryDefaultColIds, TimelineHeaderDef> } =
      params.column.getColDef().headerComponentParams?.options ?? {};

    const config: Record<string, TimelineHeaderDef> = {
      ...timelineTableColumnsConfig,
      ...sensorColumnsConfig,
    };

    const { titleKey = colId, subTitleKey = colId, isTemperature } = config[colId];

    const title = t(titleKey);
    const subTitle =
      isTemperature && temperatureUnit ? addTemperatureUnit(t(subTitleKey), temperatureUnit) : t(subTitleKey);

    switch (colId) {
      case 'time':
        return `${subTitle}, ${title} `;
      case 'event':
      case 'location':
        return title;
      default:
        return `${title} ${subTitle}`;
    }
  };

  const visibleExportColumns = () => {
    const colDefs = gridApi?.getColumnDefs();

    const visibleColumns: ColDef<EnrichedEventData>[] =
      colDefs?.filter((colDef: ColDef<EnrichedEventData>) => {
        if (colDef.colId === 'location') {
          return true;
        }

        if (colDef.hide === true) {
          return false;
        }

        if (['menu', 'gapColumn'].includes(colDef.colId || '')) {
          return false;
        }

        return true;
      }) || [];

    const visibleColumnIds = visibleColumns?.map((column) => column.colId).filter(Boolean) as string[];

    if (visibleColumnIds.length) {
      return { columnKeys: visibleColumnIds };
    }

    return { allColumns: false };
  };

  const exportCsv = () => {
    gridApi?.exportDataAsCsv({
      fileName: `${getFileNameToExport(t('route.replay.export'), assetId)}.csv`,
      ...visibleExportColumns(),
      processCellCallback,
      processHeaderCallback,
    });
  };

  const exportExcel = () => {
    gridApi?.exportDataAsExcel({
      fileName: `${getFileNameToExport(t('route.replay.export'), assetId)}.xlsx`,
      ...visibleExportColumns(),
      processCellCallback,
      processHeaderCallback,
    });
  };

  return { exportExcel, exportCsv };
};
