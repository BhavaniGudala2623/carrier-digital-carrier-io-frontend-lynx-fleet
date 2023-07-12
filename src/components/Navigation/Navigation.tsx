import { FC, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Navbar,
  Navigation as FdsNavigation,
  NavbarFooter,
  ActiveButtonType,
} from '@carrier-io/fds-react/patterns/Navbar';
import Box from '@carrier-io/fds-react/Box';
import { useRbac } from '@carrier-io/rbac-provider-react';
import { Maybe } from '@carrier-io/lynx-fleet-types';

import { getRoutesWithNavItem } from '@/utils';
import { IntercomButton } from '@/features/customer-support';
import { getAuthTenantId, getAuthUserEmail } from '@/features/authentication';
import { useAppSelector } from '@/stores';
import { actionPayload, companyActionPayload } from '@/features/authorization';
import { useApplicationContext } from '@/providers/ApplicationContext';

import './styles.scss';

interface NavigationProps {
  onClick?: () => void;
}

export const Navigation: FC<NavigationProps> = ({ onClick }) => {
  const tenantId = useAppSelector(getAuthTenantId);
  const email = useAppSelector(getAuthUserEmail);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { hasPermission } = useRbac();
  const { featureFlags } = useApplicationContext();

  const [drawerOpened, setDrawerOpened] = useState(false);
  const basePath = location.pathname.split('/')?.[1];
  const currentPathname = basePath ? `/${basePath}` : location.pathname;

  const permissions = useMemo(
    () => ({
      assetList: hasPermission(companyActionPayload('dashboard.assetList', tenantId)),
      advancedTracking: hasPermission(companyActionPayload('wialon.view', tenantId)),
      notifications: hasPermission(companyActionPayload('notification.list', tenantId)),
      commandHistory: hasPermission(companyActionPayload('2WayCmd.historyList', tenantId)),
      companyManagement: hasPermission(companyActionPayload('company.list', tenantId)),
      deviceManagement: hasPermission(companyActionPayload('device.list', tenantId)),
      restApi: hasPermission(
        actionPayload({
          action: 'apiPortal.view',
          subjectType: 'USER',
          subjectId: email,
        })
      ),
      reports: hasPermission(companyActionPayload('scheduledReports.view', tenantId)),
    }),
    [email, hasPermission, tenantId]
  );

  const navigationItems = useMemo(
    () => getRoutesWithNavItem(t, permissions, featureFlags),
    [t, permissions, featureFlags]
  );

  const handleClick = (path: Maybe<string>) => {
    if (path && path !== location.pathname) {
      navigate(path);

      return;
    }

    if (typeof onClick === 'function') {
      onClick();
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <Navbar
        disableHoverListener={false}
        onDrawerSizeChanged={setDrawerOpened}
        childHeight={40}
        maxOpenWidth={300}
        childMargin={4}
        sx={{
          backgroundColor: 'background.desktop',
          height: '100%',
          '& .MuiTypography-root': {
            fontSize: 14,
          },
          '& .MuiButton-root': {
            marginLeft: 0.5,
          },
          borderRight: drawerOpened ? '1px solid rgba(0, 0, 0, 0.08)' : 'none',
        }}
      >
        <FdsNavigation
          currentPathname={currentPathname}
          activeButtonType={ActiveButtonType.Indicator}
          items={navigationItems}
          onClick={(item) => handleClick(item?.path)}
          disableTooltip
        />
        <NavbarFooter>{IntercomButton()}</NavbarFooter>
      </Navbar>
    </Box>
  );
};

Navigation.displayName = 'Navigation';
