import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import MenuItem from '@carrier-io/fds-react/MenuItem';
import Typography from '@carrier-io/fds-react/Typography';

import { ApiPortalIcon } from '@/components';

export const ApiPortalButton: FC = () => {
  const { t } = useTranslation();

  const onClick = () => {
    const apiPortalWindow = window.open(process.env.REACT_APP_API_PORTAL || '', '_blank');

    apiPortalWindow?.focus();
  };

  return (
    <MenuItem onClick={onClick} data-testId="api-portal-button">
      <ApiPortalIcon />
      <Typography variant="body2" ml={1.5}>
        {t('company.management.api-portal')}
      </Typography>
    </MenuItem>
  );
};
