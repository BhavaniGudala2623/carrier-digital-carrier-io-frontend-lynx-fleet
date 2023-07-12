import { forwardRef } from 'react';
import Box from '@carrier-io/fds-react/Box';
import Paper from '@carrier-io/fds-react/Paper';
import Typography from '@carrier-io/fds-react/Typography';
import { useTranslation } from 'react-i18next';

const groupRolesStyle = {
  mb: 0,
  mr: 3,
  fontSize: 16,
};

export const InfoPopUpContent = forwardRef<HTMLDivElement>((_props, ref) => {
  const { t } = useTranslation();

  return (
    <Paper
      ref={ref}
      elevation={3}
      sx={{
        width: 400,
        p: 2,
      }}
    >
      <Box mb={2}>
        <Typography sx={{ mb: 2, fontSize: 16 }} variant="body1" color="textSecondary">
          {t('user.management.user-group.role-description-title')}
        </Typography>
        <Typography sx={groupRolesStyle} variant="body1" fontWeight="bold">
          {t('user.management.user-group.role-type.owner')}
        </Typography>
        <Typography variant="body1" color="textSecondary">
          {t('user.management.add.group.role.owner.description')}
        </Typography>
      </Box>
      <Box mb={2}>
        <Typography sx={groupRolesStyle} variant="body1" fontWeight="bold">
          {t('user.management.user-group.role-type.manager')}
        </Typography>
        <Typography variant="body1" color="textSecondary">
          {t('user.management.add.group.role.manager.description')}
        </Typography>
      </Box>
      <Box mb={2}>
        <Typography sx={groupRolesStyle} variant="body1" fontWeight="bold">
          {t('user.management.user-group.role-type.member')}
        </Typography>
        <Typography variant="body1" color="textSecondary">
          {t('user.management.add.group.role.member.description')}
        </Typography>
      </Box>
    </Paper>
  );
});
