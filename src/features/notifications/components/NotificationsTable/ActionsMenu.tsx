import Grid from '@carrier-io/fds-react/Grid';
import Menu from '@carrier-io/fds-react/Menu';
import MenuItem from '@carrier-io/fds-react/MenuItem';
import Switch from '@carrier-io/fds-react/Switch';
import { useTranslation } from 'react-i18next';

export type NotificationTableAction = 'CLOSE' | 'EDIT' | 'DELETE' | 'TOGGLE';

interface NotificationsTableActionsProps {
  anchor: HTMLElement;
  active: boolean;
  hasNotificationEditPermission: boolean;
  hasNotificationDeletePermission: boolean;
  onCallback: (action: NotificationTableAction) => void;
}

export function ActionsMenu(props: NotificationsTableActionsProps) {
  const { anchor, active, hasNotificationEditPermission, hasNotificationDeletePermission, onCallback } =
    props;

  const { t } = useTranslation();

  return (
    <Menu anchorEl={anchor} keepMounted open onClose={() => onCallback('CLOSE')}>
      {hasNotificationEditPermission && (
        <MenuItem onClick={() => onCallback('EDIT')}>{t('common.edit')}</MenuItem>
      )}
      {hasNotificationEditPermission && (
        <MenuItem>
          <Grid container alignItems="center" spacing={1}>
            <Grid item>{t('common.inactive')}</Grid>
            <Grid item>
              <Switch checked={active} onChange={() => onCallback('TOGGLE')} />
            </Grid>
            <Grid item>{t('common.active')}</Grid>
          </Grid>
        </MenuItem>
      )}
      {hasNotificationDeletePermission && (
        <MenuItem onClick={() => onCallback('DELETE')}>{t('common.delete')}</MenuItem>
      )}
    </Menu>
  );
}
