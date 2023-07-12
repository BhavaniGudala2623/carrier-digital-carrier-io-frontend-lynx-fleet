import { NavbarFooterButton } from '@carrier-io/fds-react/patterns/Navbar';
import { useTranslation } from 'react-i18next';
import Typography from '@carrier-io/fds-react/Typography';

import { IntercomIcon } from './IntercomIcon';

export const IntercomButton = () => {
  const { t } = useTranslation();

  return (
    <NavbarFooterButton
      id="intercomButton"
      sx={{
        backgroundColor: 'info.main',
        borderRadius: 21,
        maxWidth: 200,
      }}
    >
      <IntercomIcon
        sx={{
          fontSize: 24,
          ml: -1.5,
          mr: 1,
        }}
      />
      <Typography variant="inherit" color="info.main" ml={2}>
        {t('common.need-help')}
      </Typography>
    </NavbarFooterButton>
  );
};
