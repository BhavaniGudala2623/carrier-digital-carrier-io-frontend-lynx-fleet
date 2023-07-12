import { useState, MouseEvent, memo } from 'react';
import { useOktaAuth } from '@okta/okta-react';
import Button from '@carrier-io/fds-react/Button';
import Divider from '@carrier-io/fds-react/Divider';
import Typography from '@carrier-io/fds-react/Typography';
import Avatar from '@carrier-io/fds-react/Avatar';
import { useTranslation } from 'react-i18next';
import Popover from '@carrier-io/fds-react/Popover';

import { DrawerHeader } from '../components';
import { UserNavigation } from '../components/settings/UserNavigation';

import { getAuthUserGroups } from '@/features/authentication';
import { useAppSelector } from '@/stores';
import { useUserSettings } from '@/providers/UserSettings';
import { getOktaUserEmail } from '@/utils';

import './styles.scss';

interface Props {
  hasButton: boolean;
}

export const UserSettings = memo(({ hasButton }: Props) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const { userSettings } = useUserSettings();
  const { fullName } = userSettings;
  const { t } = useTranslation();

  const { authState } = useOktaAuth();

  const groups = useAppSelector(getAuthUserGroups);
  const groupNames = groups.map((group) => group.group.name);

  const email = getOktaUserEmail(authState);
  const userFullName = fullName ?? '';

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        onClick={handleClick}
        variant="text"
        color="secondary"
        sx={{ fontWeight: 600, py: 2, pr: hasButton ? 1 : 2 }}
        data-testid="user-profile"
      >
        <Typography
          variant="subtitle2"
          sx={{
            color: 'rgba(255, 255, 255, 0.6)',
          }}
        >
          {t('common.hi')},&nbsp;
        </Typography>
        <Typography
          variant="subtitle2"
          sx={{
            color: 'rgba(255, 255, 255, 0.87)',
          }}
        >
          {userFullName}
        </Typography>
        <Avatar
          style={{
            background: '#c9f7f5',
            color: '#1bc5bd',
            marginLeft: '0.75rem',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
          }}
          sx={{ fontSize: 'subtitle1.fontSize' }}
        >
          {userFullName[0] ?? ''}
        </Avatar>
      </Button>
      <Popover
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            filter: (theme) => `drop-shadow(0px 2px 8px ${theme.palette.action.active})`,
            width: 352,
            p: 2,
            minHeight: '78%',
          },
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <DrawerHeader fullName={userFullName} email={email} groupNames={groupNames} />
        <Divider sx={{ mx: -2 }} />
        <UserNavigation />
      </Popover>
    </>
  );
});

UserSettings.displayName = 'UserSettings';
