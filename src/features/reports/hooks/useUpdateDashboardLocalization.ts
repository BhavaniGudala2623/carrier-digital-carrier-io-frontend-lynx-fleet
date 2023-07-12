import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';
import { LookerService } from '@carrier-io/lynx-fleet-data-lib';
import { LookerUserProviderState } from '@carrier-io/lynx-fleet-types';
import { DashboardElement } from '@carrier-io/lynx-fleet-types/dist/looker/reports';

import { LOOKER_PROJECT, LOOKER_VIEW } from '../utils';

import { useApplicationContext } from '@/providers/ApplicationContext';

export const useUpdateDashboardLocalization = (
  dashboardId: string,
  lookerAccessToken: LookerUserProviderState['user']['accessToken']
) => {
  const { t } = useTranslation();
  const { appLanguage } = useApplicationContext();

  const headerLabels: Record<string, string> = {
    reportTitle: String(t('assethistory.report.temperature-report')),
    companyLabel: String(t('assets.management.company')),
    licensePlateNumberLabel: String(t('assets.management.license-plate')),
    startDateLabel: String(t('assethistory.report.starts-on')),
    fleetNameLabel: String(t('assets.management.fleet')),
    serialNumberLabel: String(t('assets.management.tru-serial')),
    endDateLabel: String(t('assethistory.report.ends-on')),
    assetNameLabel: String(t('assets.management.asset-name')),
    freezerControlModeLabel: String(t('assets.asset.table.tru-control-system-type')),
    reportTimeFrameLabel: String(t('assethistory.report.timeframe')),
    reportTimeGeneratedLabel: String(t('assethistory.report.report-generated-on')),
    reportGeneratedByLabel: String(t('assethistory.report.generated-by')),
    timezoneLabel: String(t('company.management.timezone')),
    userLanguage: appLanguage,
  };

  const chartLabels: { [key: string]: string } = {
    Compartment_1: t('asset.compartment1'),
    Compartment_2: t('asset.compartment2'),
    Compartment_3: t('asset.compartment3'),
    Events: t('assethistory.graph.events'),
    userLanguage: appLanguage,
  };

  const getDashboard = useCallback(
    (id) => LookerService.fetchDashboard(id, lookerAccessToken),
    [lookerAccessToken]
  );

  const createQuery = useCallback(
    (query) =>
      LookerService.createQuery({ ...query, model: LOOKER_PROJECT, view: LOOKER_VIEW }, lookerAccessToken),
    [lookerAccessToken]
  );

  const createQueryAndUpdateDashboardElement = (
    dashboardElement: DashboardElement,
    labels: Record<string, string>
  ) => {
    if (dashboardElement.query && dashboardElement.query.vis_config?.locale !== appLanguage) {
      return createQuery({
        ...dashboardElement.query,
        client_id: null,
        id: null,
        can: null,
        slug: null,
        share_url: null,
        expanded_share_url: null,
        url: null,
        has_table_calculations: null,
        vis_config: {
          ...dashboardElement.query.vis_config,
          ...labels,
          locale: appLanguage,
        },
      }).then((query) => {
        if (dashboardElement.id && query.id) {
          return LookerService.updateDashboardElementQuery(dashboardElement.id, query.id, lookerAccessToken);
        }

        return undefined;
      });
    }

    return undefined;
  };

  const updateDashboardFilter = async (filter, title: string) =>
    LookerService.updateDashboardFilters(
      filter.id,
      filter.default_value,
      filter.ui_config.options,
      filter.ui_config.display,
      filter.ui_config.type,
      lookerAccessToken,
      title
    );

  const updateDashboardLocalization = async (hasFilters) =>
    getDashboard(dashboardId)
      .then((dashboard) => {
        const header = dashboard.dashboard_elements?.[0];
        const tempChart = dashboard.dashboard_elements?.[1];
        let timeframeFilter;
        let tableIntervalFilter;

        if (hasFilters) {
          timeframeFilter = dashboard.dashboard_filters?.[0];
          tableIntervalFilter = dashboard.dashboard_filters?.[1];
        }

        const promises = [
          header && createQueryAndUpdateDashboardElement(header, headerLabels),
          tempChart && createQueryAndUpdateDashboardElement(tempChart, chartLabels),
          hasFilters &&
            timeframeFilter &&
            updateDashboardFilter(timeframeFilter, t('assethistory.report.timeframe')),
          hasFilters &&
            tableIntervalFilter &&
            updateDashboardFilter(tableIntervalFilter, t('assethistory.report.table-interval')),
        ];

        return Promise.all(promises);
      })
      // eslint-disable-next-line no-console
      .catch((error) => console.error('updateDashboardLocalization error :', error));

  return { updateDashboardLocalization };
};
