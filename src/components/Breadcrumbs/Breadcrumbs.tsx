import { useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import BreadcrumbsFDS from '@carrier-io/fds-react/Breadcrumbs';
import Typography from '@carrier-io/fds-react/Typography';
import { useTranslation } from 'react-i18next';

import { BreadcrumbType } from './types';
import { BreadcrumbsLink } from './BreadcrumbsLink';

import { routes } from '@/routes';
import { useApplicationContext } from '@/providers/ApplicationContext';

export const Breadcrumbs = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { deviceImei } = useParams();
  const {
    applicationState: { toolbarSettings },
  } = useApplicationContext();

  const customBreadcrumbActions = toolbarSettings.breadcrumbs?.customActions;

  const breadCrumbs: BreadcrumbType[] = useMemo(
    () =>
      Object.values(routes)
        .filter((route) => route.path === location.pathname || location.pathname.includes(route.path))
        .flatMap((route) => {
          if (route.path === routes.deviceManagement.path && deviceImei) {
            const deviceRoute = {
              title: deviceImei,
              path: `${route.path}/${deviceImei}`,
            };

            return [route, deviceRoute];
          }

          return [{ ...route, title: t(route.title) }];
        }),
    [deviceImei, location.pathname, t]
  );

  return (
    <BreadcrumbsFDS
      aria-label="breadcrumb"
      separator={<Typography color="primary.contrastText">/</Typography>}
    >
      {customBreadcrumbActions?.length
        ? customBreadcrumbActions
        : breadCrumbs.map((item, idx) => (
            <BreadcrumbsLink key={item.path} item={item} isLastItem={idx + 1 === breadCrumbs.length} />
          ))}
    </BreadcrumbsFDS>
  );
};

Breadcrumbs.displayName = 'Breadcrumbs';
