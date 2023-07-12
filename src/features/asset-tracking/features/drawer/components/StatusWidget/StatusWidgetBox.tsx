import Box from '@carrier-io/fds-react/Box';
import Typography from '@carrier-io/fds-react/Typography';
import { AssetStatusType, HealthStatusType } from '@carrier-io/lynx-fleet-types';

import { StatusItem } from './useStatusWidget';

interface Props {
  statusItem: StatusItem;
  onSelectStatus: (type: AssetStatusType | null) => void;
  onSelectedHealthStatus: (type: HealthStatusType | null) => void;
  onSelectedAlarm: (alarm: null) => void;
  isSelected: boolean;
  bold?: boolean;
}

export const StatusWidgetBox = ({
  statusItem,
  onSelectStatus,
  onSelectedAlarm,
  onSelectedHealthStatus,
  isSelected,
  bold,
}: Props) => {
  const { title, val, type } = statusItem;

  const handleStatusClick = () => {
    let newStatusType: AssetStatusType | null = null;

    if (!isSelected) {
      newStatusType = type;
    }

    onSelectStatus(newStatusType);
    onSelectedAlarm(null);
    onSelectedHealthStatus(null);
  };

  const selectedStatusSx = isSelected
    ? { backgroundColor: '#0038FF14' }
    : { '&:hover': { backgroundColor: (theme) => theme.palette.action.hover } };

  let titleColor = bold ? 'text.primary' : 'text.secondary';
  let valueColor = bold ? 'primary.dark' : 'text.secondary';
  if (isSelected) {
    titleColor = 'primary.main';
    valueColor = 'primary.main';
  }

  return (
    <Box
      onClick={handleStatusClick}
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      px={1}
      pt={0.75}
      pb={0.5}
      my={0.5}
      sx={{
        cursor: 'pointer',
        borderRadius: '4px',
        ...selectedStatusSx,
      }}
      data-testid={`${type.toLowerCase()}-widget`}
    >
      <Typography
        variant="caption"
        color={titleColor}
        sx={bold ? { fontWeight: 'semibold' } : {}}
        data-testid={`${type.toLowerCase()}-widget-title`}
      >
        {title}
      </Typography>
      <Typography variant="subtitle1" color={valueColor} data-testid={`${type.toLowerCase()}-widget-counter`}>
        {val}
      </Typography>
    </Box>
  );
};
