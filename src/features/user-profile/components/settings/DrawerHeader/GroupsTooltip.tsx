import { FC } from 'react';
import Typography from '@carrier-io/fds-react/Typography';
import Tooltip from '@carrier-io/fds-react/Tooltip';
import { useTranslation } from 'react-i18next';

interface GroupsTooltipProps {
  groupNames: string[];
}

export const GroupsTooltip: FC<GroupsTooltipProps> = ({ groupNames }) => {
  const { t } = useTranslation();

  if (groupNames.length === 0) {
    return (
      <Typography color="text.disabled" data-testid="user-profile-group-names">
        {t('user.management.user-group.no-groups')}
      </Typography>
    );
  }

  if (groupNames.length === 1) {
    return (
      <Typography color="text.disabled" data-testid="user-profile-group-names">
        {groupNames[0]}
      </Typography>
    );
  }

  return (
    <Tooltip title={groupNames.join(', ')} enterDelay={100}>
      <Typography color="text.disabled" sx={{ cursor: 'pointer' }} data-testid="user-profile-group-names">
        {`${groupNames[0]}, +${groupNames.length - 1}`}
      </Typography>
    </Tooltip>
  );
};
