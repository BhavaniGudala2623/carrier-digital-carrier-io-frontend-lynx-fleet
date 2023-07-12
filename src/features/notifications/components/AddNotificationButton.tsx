import { FC, useCallback } from 'react';
import { useRbac } from '@carrier-io/rbac-provider-react';
import { useTranslation } from 'react-i18next';
import AddIcon from '@mui/icons-material/Add';
import Button from '@carrier-io/fds-react/Button';

import { AddNotificationDialog } from './AddNotificationDialog';

import { useAppSelector } from '@/stores';
import { useToggle } from '@/hooks';
import { getAuthTenantId } from '@/features/authentication';
import { companyActionPayload } from '@/features/authorization';

export const AddNotificationButton: FC = () => {
  const { hasPermission } = useRbac();
  const { t } = useTranslation();
  const tenantId = useAppSelector(getAuthTenantId);

  const showAddNotificationButton = hasPermission(companyActionPayload('notification.create', tenantId));

  const {
    value: openAddNotificationDialog,
    toggleOn: handleOpenAddNotificationDialog,
    toggleOff: handleCloseAddNotificationDialog,
  } = useToggle(false);

  const handleAddNotificationClick = useCallback(() => {
    handleOpenAddNotificationDialog();
  }, [handleOpenAddNotificationDialog]);

  return (
    <>
      {showAddNotificationButton && (
        <Button startIcon={<AddIcon />} variant="outlined" onClick={handleAddNotificationClick}>
          {t('notifications.add-notification')}
        </Button>
      )}
      {openAddNotificationDialog && <AddNotificationDialog onClose={handleCloseAddNotificationDialog} />}
    </>
  );
};
