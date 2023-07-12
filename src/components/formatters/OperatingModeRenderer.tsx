import Tooltip from '@carrier-io/fds-react/Tooltip';
import Box from '@carrier-io/fds-react/Box';
import { CompartmentModeType, SnapshotData } from '@carrier-io/lynx-fleet-types';
import { TFunction } from 'i18next';
import { ICellRendererParams } from '@ag-grid-community/core';
import { useTranslation } from 'react-i18next';

import {
  CompartmentNotEnabledIcon,
  HeatIcon,
  NullIcon,
  DefrostIcon,
  CoolIcon,
  HeatRHIcon,
  IdleRHIcon,
  DefrostRHIcon,
  CoolRHIcon,
} from '../icons';

import { translateOperatingMode } from '@/utils';
import { CompartmentModeTypeLowercase } from '@/types';

const iconSx = { fontSize: '22px' };
const iconRHSx = { fontSize: '26px' };

export const renderOperatingMode = ({
  value,
  t,
}: {
  value: CompartmentModeType | null | undefined;
  t: TFunction;
}) => {
  if (!value) {
    return <span />;
  }

  const renderTooltip = (icon: JSX.Element, mode: string) => (
    <Tooltip title={translateOperatingMode(t, mode)}>{icon}</Tooltip>
  );

  const getIcon = () => {
    switch (value.toLowerCase() as CompartmentModeTypeLowercase) {
      case 'off':
        return (
          <span className="w-100 label label-lg label-light label-inline">
            {translateOperatingMode(t, value)}
          </span>
        );
      case 'heat':
        return renderTooltip(<HeatIcon sx={iconSx} />, 'Heat');
      case 'cool':
        return renderTooltip(<CoolIcon sx={iconSx} />, 'Cool');
      case 'null':
        return renderTooltip(<NullIcon sx={iconSx} />, 'Null');
      case 'idle':
        return renderTooltip(<NullIcon sx={iconSx} />, 'Idle');
      case 'defrost':
        return renderTooltip(<DefrostIcon sx={iconSx} />, 'Defrost');
      case 'compartment not enabled':
        return renderTooltip(<CompartmentNotEnabledIcon sx={iconSx} />, 'Compartment Not Enabled');
      case 'defrost start/end':
        return renderTooltip(<DefrostIcon sx={iconSx} />, 'defrost start/end');
      case 'cool with rh active':
        return renderTooltip(<CoolRHIcon sx={iconRHSx} />, 'cool with rh active');
      case 'heat with rh active':
        return renderTooltip(<HeatRHIcon sx={iconRHSx} />, 'heat with rh active');
      case 'idle with rh active':
        return renderTooltip(<IdleRHIcon sx={iconRHSx} />, 'idle with rh active');
      case 'defrost with rh active':
        return renderTooltip(<DefrostRHIcon sx={iconRHSx} />, 'defrost with rh active');
      case 'defrost start/end with rh active':
        return renderTooltip(<DefrostRHIcon sx={iconRHSx} />, 'defrost start/end with rh active');
      default:
        return <span />;
    }
  };

  return (
    <Box display="flex" alignItems="center" height="100%">
      {getIcon()}
    </Box>
  );
};

export function OperatingModeRenderer({
  value,
}: ICellRendererParams<SnapshotData, CompartmentModeType | null | undefined>) {
  const { t } = useTranslation();

  return renderOperatingMode({ value, t });
}
