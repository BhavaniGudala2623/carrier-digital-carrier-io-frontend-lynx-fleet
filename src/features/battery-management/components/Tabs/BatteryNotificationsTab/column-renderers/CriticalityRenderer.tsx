import Chip from '@carrier-io/fds-react/Chip';
import { orange, red } from '@mui/material/colors';

import { BatteryNotificationsColumnDataType } from '../../../../types';

export const CriticalityRenderer = ({ data }: { data: BatteryNotificationsColumnDataType }) => {
  if (!data) {
    return null;
  }
  const { criticality } = data.notification;
  const getChipColor = () => {
    switch (criticality) {
      case 1:
        return red[100];
      case 2:
        return orange[100];
      default:
        return '';
    }
  };

  return criticality && <Chip style={{ background: getChipColor() }} size="small" label={criticality} />;
};
