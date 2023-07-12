import { useState, MouseEvent } from 'react';
import Box from '@carrier-io/fds-react/Box';
import IconButton from '@carrier-io/fds-react/IconButton';
import Menu from '@carrier-io/fds-react/Menu';
import { useRbac } from '@carrier-io/rbac-provider-react';

import { HeaderMenuIcon } from './icons/HeaderMenuIcon';
import { AdvancedTrackingButton } from './AdvancedTrackingButton';
import { ApiPortalButton } from './ApiPortalButton';

import { getAuthTenant, getAuthUserEmail } from '@/features/authentication';
import { useAppSelector } from '@/stores';
import { actionPayload, companyActionPayload } from '@/features/authorization';
import { UserSettings } from '@/features/user-profile';
import { useApplicationContext } from '@/providers/ApplicationContext';

import '../styles.scss';

export const HeaderRight = () => {
  const { appLanguage } = useApplicationContext();
  const tenant = useAppSelector(getAuthTenant);
  const authUserEmail = useAppSelector(getAuthUserEmail);

  const { hasPermission } = useRbac();

  const canAccessApiPortal = hasPermission(
    actionPayload({
      action: 'apiPortal.view',
      subjectType: 'USER',
      subjectId: authUserEmail,
    })
  );

  const canAccessAdvancedTracking =
    tenant?.advancedTrackingEnabled && hasPermission(companyActionPayload('wialon.view', tenant.id));

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuButtonClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => setAnchorEl(null);

  const showButton = Boolean(canAccessApiPortal || canAccessAdvancedTracking);

  return (
    <>
      <Box className="app-bar-right__settings">
        <UserSettings hasButton={showButton} />
      </Box>

      {showButton && (
        <Box className="app-bar-right__menu">
          <IconButton onClick={handleMenuButtonClick} data-testid="app-bar-button">
            <HeaderMenuIcon />
          </IconButton>
          {anchorEl && (
            <Menu
              anchorEl={anchorEl}
              open
              onClose={handleMenuClose}
              autoFocus
              keepMounted
              MenuListProps={{
                dense: true,
                disablePadding: true,
                sx: { width: 240 },
              }}
              PaperProps={{
                sx: {
                  mt: 2,
                  width: 240,
                },
              }}
            >
              {canAccessApiPortal && <ApiPortalButton />}
              {canAccessAdvancedTracking && <AdvancedTrackingButton language={appLanguage} />}
            </Menu>
          )}
        </Box>
      )}
    </>
  );
};
