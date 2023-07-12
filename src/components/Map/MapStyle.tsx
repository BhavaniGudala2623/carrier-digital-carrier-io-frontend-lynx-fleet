import { useTranslation } from 'react-i18next';
import ToggleButtonGroup from '@carrier-io/fds-react/ToggleButtonGroup';
import { useState } from 'react';
import { styled } from '@mui/material/styles';

import { TooltipToggleButton } from '../TooltipToggleButton';

import satelliteViewIconUrl from './satellite-view-icon.png';
import streetViewIconUrl from './street-view-icon.png';

import { MapStyleType } from '@/types';

const MapStyleIcon = styled('img')({
  width: '20px',
  height: '20px',
});

export const MapStyle = ({ onChange }: { onChange: (mapStyle: MapStyleType) => void }) => {
  const { t } = useTranslation();
  const [mapStyle, setMapStyle] = useState('streets');

  const handleChangeMapStyle = (_event, newStyle: MapStyleType) => {
    setMapStyle(newStyle);
    onChange(newStyle);
  };

  return (
    <ToggleButtonGroup
      value={mapStyle}
      exclusive
      onChange={handleChangeMapStyle}
      aria-label={t('buttons.tooltip.change-map-style')}
      size="small"
      sx={{ backgroundColor: (theme) => theme.palette.background.paper }}
    >
      <TooltipToggleButton
        value="streets"
        aria-label={t('buttons.tooltip.street-view')}
        TooltipProps={{
          classes: { popper: 'MuiTooltip-popper-subheader' },
          title: t('buttons.tooltip.street-view'),
        }}
      >
        <MapStyleIcon src={streetViewIconUrl} alt={t('buttons.tooltip.street-view')} />
      </TooltipToggleButton>
      <TooltipToggleButton
        value="satellite"
        aria-label={t('buttons.tooltip.satellite-view')}
        TooltipProps={{
          classes: { popper: 'MuiTooltip-popper-subheader' },
          title: t('buttons.tooltip.satellite-view'),
        }}
      >
        <MapStyleIcon src={satelliteViewIconUrl} alt={t('buttons.tooltip.satellite-view')} />
      </TooltipToggleButton>
    </ToggleButtonGroup>
  );
};
