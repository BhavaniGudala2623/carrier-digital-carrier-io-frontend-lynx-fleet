import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { BreadcrumbsLink } from '@/components/Breadcrumbs';
import { useApplicationContext } from '@/providers/ApplicationContext';
import { routes } from '@/routes';

export const useReportsBreadcrumbs = (reportTitle: string, reportId: string) => {
  const { setBreadcrumbsSettings } = useApplicationContext();
  const { t } = useTranslation();

  useEffect(() => {
    setBreadcrumbsSettings({
      customActions: [
        <BreadcrumbsLink
          key={routes.reports.path}
          item={{ path: routes.reports.path, title: t(routes.reports.title) }}
          isLastItem={false}
        />,
        <BreadcrumbsLink
          key="dashboard-id"
          item={{
            path: routes.fleetReports.path.replace(':dashboardId', reportId ?? ''),
            title: reportTitle ?? '',
          }}
          isLastItem
        />,
      ],
    });

    return () => setBreadcrumbsSettings({ customActions: null });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportId, reportTitle]);
};
