import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { AssetView, LanguageType, Maybe } from '@carrier-io/lynx-fleet-types';

import {
  ApplicationContextState,
  ApplicationContextType,
  AssetReportManagement,
  CompanyManagementSettings,
  ILegendSettings,
  SelectedCompanyHierarchy,
  ToolbarSettings,
} from './types';

import { ALL_COMPANIES, defAppPreferences, I18N_LANGUAGE } from '@/constants';
import { getAppLocaleOrDefault, getEnvironmentFeatureFlags } from '@/utils';
import { i18n } from '@/config/i18n';
import { FeatureFlagType } from '@/config';

export const initialState: ApplicationContextState = {
  companyManagement: {
    currentTab: 0,
  },
  assetReportManagement: {
    attachedFile: '',
    reportName: '',
    tempChart: false,
    legend: false,
    table: false,
    events: false,
    attachLogo: false,
    legendData: '',
    startDate: new Date(),
    endDate: new Date(),
    asset: null,
    tenant: null,
    pdfOutput: '',
    pageOrientation: 'portrait',
    timeframe: '24h',
    quickDate: '24h',
    historyFrequency: '15m',
  },
  legendSettings: {},
  toolbarSettings: {},
  selectedCompanyHierarchy: {
    type: 'ALL',
    id: ALL_COMPANIES,
    name: '',
  },
};

const stub = () => {};

const ApplicationContext = createContext<ApplicationContextType>({
  applicationState: initialState,
  setCompanyManagementSettings: stub,
  setAssetReportManagement: stub,
  setLegendSettings: stub,
  setAssetHistoryChartSelectedView: stub,
  setToolbarSettings: stub,
  setToolbarActions: stub,
  resetToolbarActions: stub,
  setBreadcrumbsSettings: stub,
  setSelectedCompanyHierarchy: stub,
  appLanguage: defAppPreferences.language,
  setAppLanguage: stub,
  featureFlags: {} as Record<FeatureFlagType, boolean>,
  setUserFeatureFlags: stub,
});

export function useApplicationContext() {
  return useContext(ApplicationContext);
}

export const ApplicationConsumer = ApplicationContext.Consumer;

// Establish functions for modifying the state of the application context
export function ApplicationProvider({ children }: { children: JSX.Element }) {
  const [applicationState, setApplicationStateBase] = useState(initialState);
  const [appLanguage, setAppLanguageState] = useState<LanguageType>(() =>
    getAppLocaleOrDefault(localStorage.getItem(I18N_LANGUAGE))
  );
  const [featureFlags, setFeatureFlags] = useState<Record<FeatureFlagType, boolean>>(() =>
    getEnvironmentFeatureFlags()
  );

  const setCompanyManagementSettings = useCallback((companyManagementSettings: CompanyManagementSettings) => {
    setApplicationStateBase((prevAppState) => ({ ...prevAppState, companyManagementSettings }));
  }, []);

  const setAssetReportManagement = useCallback((assetReportManagement: Partial<AssetReportManagement>) => {
    setApplicationStateBase((prevAppState) => ({
      ...prevAppState,
      assetReportManagement: {
        ...prevAppState.assetReportManagement,
        ...assetReportManagement,
      },
    }));
  }, []);

  const setLegendSettings = useCallback((legendSettings: ILegendSettings) => {
    setApplicationStateBase((prevAppState) => ({
      ...prevAppState,
      legendSettings,
    }));
  }, []);

  const setAssetHistoryChartSelectedView = useCallback((newView?: Maybe<AssetView>) => {
    setApplicationStateBase((prevAppState) => ({
      ...prevAppState,
      assetHistoryChartSelectedView: newView,
    }));
  }, []);

  const setToolbarSettings = useCallback((toolbarSettings: ToolbarSettings) => {
    setApplicationStateBase((prevAppState) => ({
      ...prevAppState,
      toolbarSettings: {
        ...prevAppState.toolbarSettings,
        ...toolbarSettings,
      },
    }));
  }, []);

  const setToolbarActions = useCallback((actionsPath: string, actions: ToolbarSettings['actions']) => {
    setApplicationStateBase((prevAppState) => ({
      ...prevAppState,
      toolbarSettings: {
        ...prevAppState.toolbarSettings,
        actionsPath,
        actions,
      },
    }));
  }, []);

  const resetToolbarActions = useCallback(() => {
    setApplicationStateBase((prevAppState) => ({
      ...prevAppState,
      toolbarSettings: {
        ...prevAppState.toolbarSettings,
        actionsPath: undefined,
        actions: undefined,
      },
    }));
  }, []);

  const setBreadcrumbsSettings = useCallback(
    (breadcrumbs: ToolbarSettings['breadcrumbs']) => setToolbarSettings({ breadcrumbs }),
    [setToolbarSettings]
  );

  const setSelectedCompanyHierarchy = useCallback(
    (value: SelectedCompanyHierarchy) =>
      setApplicationStateBase((prevAppState) => ({ ...prevAppState, selectedCompanyHierarchy: value })),
    []
  );

  const setAppLanguage = useCallback((value: LanguageType) => {
    const newLanguage = getAppLocaleOrDefault(value);

    localStorage.setItem(I18N_LANGUAGE, newLanguage);
    setAppLanguageState(newLanguage);
    i18n.changeLanguage(newLanguage);
  }, []);

  const setUserFeatureFlags = useCallback((enabledUserFlags: string[]) => {
    const flags = getEnvironmentFeatureFlags();

    for (const enabledUserFlag of enabledUserFlags) {
      if (flags[enabledUserFlag] !== undefined) {
        flags[enabledUserFlag] = true;
      }
    }

    setFeatureFlags(flags);
  }, []);

  const value = useMemo(
    () => ({
      applicationState,
      setCompanyManagementSettings,
      setAssetReportManagement,
      setLegendSettings,
      setAssetHistoryChartSelectedView,
      setToolbarSettings,
      setToolbarActions,
      resetToolbarActions,
      setBreadcrumbsSettings,
      setSelectedCompanyHierarchy,
      appLanguage,
      setAppLanguage,
      featureFlags,
      setUserFeatureFlags,
    }),
    [
      applicationState,
      setCompanyManagementSettings,
      setAssetReportManagement,
      setLegendSettings,
      setAssetHistoryChartSelectedView,
      setToolbarSettings,
      setToolbarActions,
      resetToolbarActions,
      setBreadcrumbsSettings,
      setSelectedCompanyHierarchy,
      appLanguage,
      setAppLanguage,
      featureFlags,
      setUserFeatureFlags,
    ]
  );

  return <ApplicationContext.Provider value={value}>{children}</ApplicationContext.Provider>;
}
