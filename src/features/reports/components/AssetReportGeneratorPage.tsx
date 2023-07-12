import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { nanoid } from 'nanoid';
import { Alert } from '@carrier-io/fds-react';
import Box from '@carrier-io/fds-react/Box';
import { useNavigate } from 'react-router-dom';
import {
  FolderByWildCardNameResponseWrap,
  Dashboard,
  Field,
  Filters,
  VisConfig,
  Query,
  HistoryFrequency,
} from '@carrier-io/lynx-fleet-types';
import { LookerService } from '@carrier-io/lynx-fleet-data-lib';

import { LookerUserContext } from '../context';
import {
  isCompanyAdmin,
  isFleetAdmin,
  isReportEditor,
  isSubCompanyAdmin,
  isSystemAdmin,
  normalizeFolderPortion,
  DASHBOARD_TEMPLATE_ID,
} from '../utils';
import { ChartArgs, ChartConfig, FlatChartConfig } from '../types';

import { useApplicationContext } from '@/providers/ApplicationContext';
import { useUserSettings } from '@/providers/UserSettings';
import { formatDate } from '@/utils';
import { Loader } from '@/components';

type FilterTimeFrame = '24hrs' | '48hrs' | '7days' | 'custom';

const buildFields = (
  config: FlatChartConfig,
  view: string,
  legendSettings: string[],
  intervalField: string,
  type?: 'chart' | 'table'
): Field[] => {
  const fields: string[] = [`${view}.${intervalField}`];

  Object.keys(config).forEach((field: string) => {
    if (config[field].lookerField && legendSettings.includes(field)) {
      fields.push(`${view}.${config[field].lookerField}`);
    }

    if (type === 'chart') {
      const { statuses } = config[field];
      if (statuses?.length && legendSettings.includes(field)) {
        statuses.forEach((status) => {
          if (status.lookerField) {
            fields.push(`${view}.${status.lookerField}`);
          }
        });
      }
    }
  });

  return fields;
};

const buildFieldVisConfig = (chartConfig: ChartConfig, view: string): VisConfig => {
  const options: VisConfig = {};
  Object.keys(chartConfig).forEach((compartment: string) => {
    if (!chartConfig[compartment].children) {
      options[`${view}.${compartment}_color`] = chartConfig[compartment].color;
      options[`${view}.${compartment}_compartment`] = '1 No Compartment';
    } else {
      Object.keys(chartConfig[compartment].children).forEach((option: string) => {
        if (
          chartConfig[compartment].children[option].lookerField &&
          chartConfig[compartment].children[option].available
        ) {
          options[`${view}.${chartConfig[compartment].children[option].lookerField}_color`] =
            chartConfig[compartment].children[option].color;
          options[`${view}.${chartConfig[compartment].children[option].lookerField}_compartment`] =
            chartConfig[compartment].lookerField;
        }
        const { statuses } = chartConfig[compartment].children[option];
        if (chartConfig[compartment].children[option].available && statuses?.length) {
          statuses.forEach((status) => {
            options[`${view}.${status.lookerField}_color`] = status.color;
            options[`${view}.${status.lookerField}_compartment`] = chartConfig[compartment].lookerField;
          });
        }
      });
    }
  });

  return options;
};

const buildFilters = (
  args: ChartArgs | { [key: string]: string | boolean },
  view: string,
  isTableView?: boolean,
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  historyFrequency?: HistoryFrequency // TODO reserved for future use
) => {
  const filters: Filters = {};
  filters[`${view}.value__asset_id`] = String(args.asset);
  filters[`${view}.date_filter_option`] = String(args.filterTimeframe);
  filters[`${view}.date_range`] = `${args.startDate} to ${args.endDate}`;
  filters['parameters.dataset'] = String(process.env.REACT_APP_STAGE);

  // TODO Should we support other intervals? (historyFrequency === '15m')
  if (isTableView) {
    filters[`${view}.is_minute_divisible_by_15`] = 'No';
  }

  return filters;
};

const buildChartQuery = (chartArgs: ChartArgs, query: Query): Query => ({
  fields: buildFields(
    chartArgs.flatChartConfig,
    query.view!,
    chartArgs.legendSettings,
    'reporting_interval',
    'chart'
  ),
  limit: 5000,
  model: query.model,
  view: query.view,
  filters: buildFilters(chartArgs, query.view!),
  query_timezone: query.query_timezone,
  vis_config: {
    Compartment_1: chartArgs.compartment1Label,
    Compartment_2: chartArgs.compartment2Label,
    Compartment_3: chartArgs.compartment3Label,
    Events: chartArgs.eventsLabel,
    type: query.vis_config!.type!,
    showLegend: chartArgs.showLegend,
    showLines: chartArgs.showLines,
    showEvents: chartArgs.showEvents,
    isFahrenheit: chartArgs.isFahrenheit,
    ...buildFieldVisConfig(chartArgs.chartConfig, query.view!),
  },
});

const buildChartHeaderQuery = (headerArgs: { [key: string]: string | boolean }, query: Query) => ({
  fields: query.fields,
  limit: 5000,
  model: query.model,
  view: query.view,
  filters: buildFilters(headerArgs, query.view!),
  query_timezone: query.query_timezone,
  vis_config: {
    type: query.vis_config!.type!,
    ...headerArgs,
  },
});

const buildTableQuery = (chartArgs: ChartArgs, query: Query, historyFrequency: HistoryFrequency) => ({
  fields: buildFields(
    chartArgs.flatChartConfig,
    query.view!,
    chartArgs.legendSettings,
    'dynamic_reporting_interval'
  ),
  limit: 5000,
  model: query.model,
  view: query.view,
  filters: buildFilters(chartArgs, query.view!, true, historyFrequency),
  query_timezone: query.query_timezone,
  vis_config: query.vis_config,
});

const buildFolderSearchStrings = (
  companyFolderName: string,
  userFolderId: string,
  userGroupNames: string[],
  fleetFolderNames: string[]
): string[] => {
  const wildcardStrings: string[] = [];
  if (isSystemAdmin(userGroupNames)) {
    wildcardStrings.push(`U:${userFolderId}`);
  } else if (isCompanyAdmin(userGroupNames)) {
    wildcardStrings.push(`%C:${companyFolderName}%::U:${userFolderId}`);
  } else if (isSubCompanyAdmin(userGroupNames)) {
    wildcardStrings.push(`%C:${companyFolderName}%::U:${userFolderId}`);
  } else if (isFleetAdmin(userGroupNames)) {
    // if there are fleets, search for fleet folder
    if (fleetFolderNames.length > 0) {
      fleetFolderNames.forEach((fleetFolderName) => {
        wildcardStrings.push(`%C:${companyFolderName}%::F:${fleetFolderName}::U:${userFolderId}`);
      });
      // if there are no fleets, search company/subcompany wildcards
    } else {
      wildcardStrings.push(`%C:${companyFolderName}%::U:${userFolderId}`);
    }
  } else if (isReportEditor(userGroupNames)) {
    // if there are fleets, search for fleet folder
    if (fleetFolderNames.length > 0) {
      fleetFolderNames.forEach((fleetFolderName) => {
        wildcardStrings.push(`%C:${companyFolderName}%::F:${fleetFolderName}::U:${userFolderId}`);
      });
      // if there are no fleets, search company/subcompany wildcards
    } else {
      wildcardStrings.push(`%C:${companyFolderName}%::U:${userFolderId}`);
    }
  }

  return wildcardStrings;
};

export const AssetReportGeneratorPage = () => {
  const applicationContext = useApplicationContext();
  const { appLanguage, applicationState } = applicationContext;
  const { legendSettings, assetReportManagement: assetReportManagementState } = applicationState;
  const { userSettings } = useUserSettings();
  const { temperature, dateFormat } = userSettings;
  const { state: lookerState } = useContext(LookerUserContext);
  const navigate = useNavigate();

  const [folderId, setFolderId] = useState<string>('');
  const [baseDashboard, setBaseDashboard] = useState<Dashboard>({});
  const [dashboardCreated, setDashboardCreated] = useState<boolean>(false);
  const [headerCreated, setHeaderCreated] = useState<boolean>(false);
  const [chartCreated, setChartCreated] = useState<boolean>(false);
  const [tableCreated, setTableCreated] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [dashboardSyncRetryCount, setDashboardSyncRetryCount] = useState<number>(0);

  const assetReportManagement = assetReportManagementState && {
    ...assetReportManagementState,
  };

  const { t } = useTranslation();

  const getTimeframe = () => {
    let newTimeframe: string;

    switch (assetReportManagement.timeframe) {
      case '24h':
        newTimeframe = t('common.last.24h');
        break;
      case '48h':
        newTimeframe = t('common.last.48h');
        break;
      case '7d':
        newTimeframe = t('common.last.7d');
        break;
      default:
        newTimeframe = t('assets.asset.table.custom-timeframe');
    }

    return newTimeframe;
  };

  const getFilterTimeframe = (): FilterTimeFrame => {
    let newTimeframe: FilterTimeFrame;

    switch (assetReportManagement.timeframe) {
      case '24h':
        newTimeframe = '24hrs';
        break;
      case '48h':
        newTimeframe = '48hrs';
        break;
      case '7d':
        newTimeframe = '7days';
        break;
      default:
        newTimeframe = 'custom';
    }

    return newTimeframe;
  };

  const filterTimeframe = getFilterTimeframe();

  const getFilterTimeframeOptions = () => {
    const timeFrameOptions: FilterTimeFrame[] = ['24hrs', '48hrs', '7days'];

    if (filterTimeframe === 'custom') {
      timeFrameOptions.push('custom');
    }

    return timeFrameOptions;
  };

  const timeframe = getTimeframe();
  const filterTimeframeOptions = getFilterTimeframeOptions();

  const headerArgs: { [key: string]: string | boolean } = {
    asset: assetReportManagement?.asset?.id ?? '',
    attachLogo: assetReportManagement?.attachLogo,
    logoUrl: assetReportManagement.attachLogo ? assetReportManagement.logoUrl ?? '' : '',
    reportTitle: String(t('assethistory.report.temperature-report')),
    reportName: assetReportManagement?.reportName,
    companyLabel: String(t('assets.management.company')),
    company: assetReportManagement?.tenant?.name ?? '-',
    licensePlateNumberLabel: String(t('assets.management.license-plate')),
    licensePlateNumber: assetReportManagement?.asset?.licensePlateNumber ?? '-',
    startDateLabel: String(t('assethistory.report.starts-on')),
    startDate: format(assetReportManagement?.startDate ?? new Date(), 'yyyy/MM/dd HH:mm:ss'),
    fleetNameLabel: String(t('assets.management.fleet')),
    fleetName: assetReportManagement?.fleets?.map((f) => f.name).join(', ') ?? '-',
    serialNumberLabel: String(t('assets.management.tru-serial')),
    serialNumber: assetReportManagement?.flespiData?.freezer_serial_number ?? '-',
    endDateLabel: String(t('assethistory.report.ends-on')),
    endDate: format(assetReportManagement?.endDate ?? new Date(), 'yyyy/MM/dd HH:mm:ss'),
    assetNameLabel: String(t('assets.management.asset-name')),
    assetName: assetReportManagement?.asset?.name ?? '-',
    freezerControlModeLabel: String(t('assets.asset.table.tru-control-system-type')),
    freezerControlMode: assetReportManagement?.flespiData?.freezer_control_mode ?? '-',
    reportTimeFrameLabel: String(t('assethistory.report.timeframe')),
    reportTimeFrame: timeframe,
    reportTimeGeneratedLabel: String(t('assethistory.report.report-generated-on')),
    reportTimeGenerated: formatDate(new Date(), dateFormat),
    reportGeneratedByLabel: String(t('assethistory.report.generated-by')),
    reportGeneratedBy: assetReportManagement?.userEmail ?? '-',
    timezoneLabel: String(t('company.management.timezone')),
    filterTimeframe,
    userLanguage: appLanguage,
  };

  const chartArgs: ChartArgs = {
    chartConfig: assetReportManagement?.chartConfig as ChartConfig,
    flatChartConfig: assetReportManagement?.flatChartConfig!,
    startDate: format(assetReportManagement?.startDate ?? new Date(), 'yyyy/MM/dd HH:mm:ss'),
    endDate: format(assetReportManagement?.endDate ?? new Date(), 'yyyy/MM/dd HH:mm:ss'),
    compartment1Label: t('asset.compartment1'),
    compartment2Label: t('asset.compartment2'),
    compartment3Label: t('asset.compartment3'),
    eventsLabel: t('assethistory.graph.events'),
    device: assetReportManagement?.flespiId?.toString() ?? '',
    asset: assetReportManagement?.asset?.id ?? '',
    showEvents: assetReportManagement?.events,
    showLegend: assetReportManagement?.legend,
    showLines: assetReportManagement?.tempChart,
    isFahrenheit: temperature === 'F',
    reportTimeFrame: timeframe,
    legendSettings: legendSettings?.columnsToDisplay!,
    filterTimeframe,
    userLanguage: appLanguage,
  };

  const goToReport = () => {
    navigate(`/reports/${baseDashboard.id}`);
  };

  /**
   * This useEffect will query for the folder to save the generated report to
   */
  useEffect(() => {
    if (lookerState?.user?.id && assetReportManagement?.tenant?.name) {
      const companyFolderName = normalizeFolderPortion(assetReportManagement.tenant?.name);
      const userFolderId = lookerState.user?.id;
      const userGroupNames: string[] = lookerState.user.groupNames!;
      const fleetFolderNames: string[] = [];

      if (assetReportManagement.fleets && assetReportManagement.fleets.length > 0) {
        assetReportManagement.fleets.forEach((f) => fleetFolderNames.push(normalizeFolderPortion(f.name)));
      }

      const wildcardStrings: string[] = buildFolderSearchStrings(
        companyFolderName,
        userFolderId,
        userGroupNames,
        fleetFolderNames
      );

      LookerService.fetchFoldersByWildcardName(wildcardStrings, lookerState.user.accessToken)
        .then((resp: FolderByWildCardNameResponseWrap | null) => {
          if (resp!.errorMessage) {
            setFolderId('');
            switch (resp!.errorMessage) {
              case 'Requires authentication.':
                setErrorMsg(t('looker.errors.report-looker-auth-error'));
                break;
              default:
                setErrorMsg(resp!.errorMessage);
                break;
            }
          } else {
            setFolderId(resp!.data![0].id);
          }
        })
        .catch(() => {
          setFolderId('');
          setErrorMsg(t('looker.errors.report-folder'));
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lookerState?.userDataLoading, assetReportManagement?.tenant?.name]);

  /**
   * This useEffect will create a baseline dashboard for adjustment
   */
  useEffect(() => {
    if (folderId) {
      const randoFileHash = nanoid(7);
      const reportName = headerArgs.reportName
        ? `${headerArgs.reportTitle}__${headerArgs.reportName}__${headerArgs.reportTimeFrame}__${randoFileHash}`
        : `${headerArgs.reportTitle}__${headerArgs.reportTimeFrame}__${randoFileHash}`;

      LookerService.duplicateLookMLDashboard(
        folderId,
        DASHBOARD_TEMPLATE_ID,
        reportName,
        lookerState?.user?.accessToken
      )
        .then((resp: Dashboard) => {
          // if the sync doesn't process, try again, iterating on the report name
          if (Object.keys(resp).length === 0) {
            setDashboardSyncRetryCount(dashboardSyncRetryCount + 1);
          } else {
            setBaseDashboard(resp);
            setDashboardCreated(true);
          }
        })
        .catch(() => {
          setBaseDashboard({});
          setErrorMsg(t('looker.errors.save-dashboard'));
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [folderId, dashboardSyncRetryCount]);

  /**
   * This useEffect will update the chart header
   */
  useEffect(() => {
    if (dashboardCreated) {
      LookerService.createQuery(
        buildChartHeaderQuery(headerArgs, baseDashboard.dashboard_elements![0]!.result_maker!.query),
        lookerState?.user?.accessToken
      )
        .then((resp: Query) => {
          LookerService.updateDashboardElementQuery(
            baseDashboard.dashboard_elements![0]!.id!,
            resp.id!,
            lookerState?.user?.accessToken
          )
            .then(() => {
              setHeaderCreated(true);
            })
            .catch(() => {
              setErrorMsg(t('looker.errors.create-header'));
            });
        })
        .catch(() => {
          setErrorMsg(t('looker.errors.create-header'));
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dashboardCreated]);

  /**
   * This useEffect will handle the chart creation
   */
  useEffect(() => {
    if (dashboardCreated) {
      if (chartArgs.showEvents || chartArgs.showLegend || chartArgs.showLines) {
        LookerService.createQuery(
          buildChartQuery(chartArgs, baseDashboard.dashboard_elements![1]!.result_maker!.query),
          lookerState?.user?.accessToken
        )
          .then((resp: Query) => {
            LookerService.updateDashboardElementQuery(
              baseDashboard.dashboard_elements![1]!.id!,
              resp.id!,
              lookerState?.user?.accessToken
            )
              .then(() => {
                setChartCreated(true);
              })
              .catch(() => {
                setErrorMsg(t('looker.errors.create-temp-chart'));
              });
          })
          .catch(() => {
            setErrorMsg(t('looker.errors.create-temp-chart'));
          });
      } else {
        LookerService.deleteDashboardElementQuery(
          baseDashboard.dashboard_elements![1]!.id!,
          lookerState?.user?.accessToken
        )
          .then(() => {
            setChartCreated(true);
          })
          .catch(() => {
            setChartCreated(true);
          });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dashboardCreated]);

  /**
   * This useEffect will update the chart table
   */
  useEffect(() => {
    if (dashboardCreated) {
      if (assetReportManagement?.table) {
        LookerService.createQuery(
          buildTableQuery(
            chartArgs,
            baseDashboard.dashboard_elements![2]!.result_maker!.query,
            assetReportManagement.historyFrequency ?? '15m'
          ),
          lookerState?.user?.accessToken
        )
          .then((resp: Query) => {
            LookerService.updateDashboardElementQuery(
              baseDashboard.dashboard_elements![2]!.id!,
              resp!.id!,
              lookerState?.user?.accessToken
            )
              .then(() => {
                setTableCreated(true);
              })
              .catch(() => {
                setErrorMsg(t('looker.errors.create-temp-table'));
              });
          })
          .catch(() => {
            setErrorMsg(t('looker.errors.create-temp-table'));
          });
      } else {
        LookerService.deleteDashboardElementQuery(
          baseDashboard.dashboard_elements![2]!.id!,
          lookerState?.user?.accessToken
        )
          .then(() => {
            setTableCreated(true);
          })
          .catch(() => {
            setTableCreated(true);
          });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dashboardCreated]);

  /**
   * This useEffect will redirect to the report viewer
   */
  useEffect(() => {
    if (headerCreated && chartCreated && tableCreated) {
      LookerService.updateDashboardFilters(
        baseDashboard.dashboard_filters![0]!.id!,
        filterTimeframe,
        filterTimeframeOptions,
        'inline',
        'button_toggles',
        lookerState?.user?.accessToken
      )
        .then(async () => {
          if (baseDashboard.dashboard_filters?.[1]?.id) {
            await LookerService.updateDashboardFilters(
              baseDashboard.dashboard_filters[1].id,
              assetReportManagement.historyFrequency || '15m',
              [],
              'inline',
              'button_toggles',
              lookerState?.user?.accessToken
            );
          }
          goToReport();
        })
        .catch(() => {
          setErrorMsg(t('looker.errors.update-timeframe-filter'));
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerCreated, chartCreated, tableCreated]);

  return (
    <Box display="flex" justifyContent="center" width="100%" height="80vh">
      {errorMsg !== '' ? (
        <Box
          sx={{
            width: '100%',
            '& > * + *': {
              mt: 2,
            },
          }}
        >
          <Alert severity="error">{errorMsg}</Alert>
        </Box>
      ) : (
        <Loader />
      )}
    </Box>
  );
};
