import ToggleButtonGroup from '@carrier-io/fds-react/ToggleButtonGroup';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import Box from '@carrier-io/fds-react/Box';
import VerticalAlignBottomIcon from '@mui/icons-material/VerticalAlignBottom';
import VerticalAlignCenterIcon from '@mui/icons-material/VerticalAlignCenter';
import VerticalAlignTopIcon from '@mui/icons-material/VerticalAlignTop';

import { AssetListView as PageView } from '../../types';

import { TooltipToggleButton } from '@/components';

export const PageViewControl = ({
  selectedView,
  onChange,
}: {
  selectedView: PageView;
  onChange: (view: PageView) => void;
}) => {
  const { t } = useTranslation();
  const [view, setView] = useState(selectedView);

  const handleChangeView = (_, newView: PageView) => {
    if (newView) {
      setView(newView);
      onChange(newView);
    }
  };

  return (
    <Box>
      <ToggleButtonGroup
        value={view}
        exclusive
        onChange={handleChangeView}
        aria-label="change map view"
        sx={{ '& .MuiSvgIcon-fontSizeSmall': { fontSize: '1rem' } }}
        size="small"
      >
        <TooltipToggleButton
          value="MapView"
          aria-label="map view"
          TooltipProps={{
            classes: { popper: 'MuiTooltip-popper-subheader' },
            title: t('buttons.tooltip.view-map-and-table'),
          }}
        >
          <VerticalAlignBottomIcon fontSize="small" />
        </TooltipToggleButton>

        <TooltipToggleButton
          value="SplitView"
          aria-label="map view"
          TooltipProps={{
            classes: { popper: 'MuiTooltip-popper-subheader' },
            title: t('buttons.tooltip.view-map-and-table'),
          }}
        >
          <VerticalAlignCenterIcon fontSize="small" />
        </TooltipToggleButton>
        <TooltipToggleButton
          value="TableView"
          aria-label="map view"
          TooltipProps={{
            classes: { popper: 'MuiTooltip-popper-subheader' },
            title: t('buttons.tooltip.view-table-only'),
          }}
        >
          <VerticalAlignTopIcon fontSize="small" />
        </TooltipToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
};
