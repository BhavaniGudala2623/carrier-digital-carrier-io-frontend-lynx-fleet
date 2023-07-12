import { useMemo } from 'react';
import Popover from '@carrier-io/fds-react/Popover';
import Box from '@carrier-io/fds-react/Box';
import Typography from '@carrier-io/fds-react/Typography';
import Divider from '@carrier-io/fds-react/Divider';
import { fleetThemeOptions } from '@carrier-io/fds-react/theme';
import { useTranslation } from 'react-i18next';
import FormControl from '@carrier-io/fds-react/FormControl';
import FormControlLabel from '@carrier-io/fds-react/FormControlLabel';
import Checkbox from '@carrier-io/fds-react/Checkbox';

import { useColumnPopupContext } from '../../providers';
import { useAssetHistoryPageContext } from '../../../../providers/AssetHistoryPageProvider';
import { filterGroupsByCompartmentConfig } from '../../utils';

import { ColumnGroupMenu } from './ColumnGroupMenu';

import { IColumnGroup } from '@/types';
import { useApplicationContext } from '@/providers/ApplicationContext';

interface ITimelinePopoverProps {
  isOpen: boolean;
  legendAnchorEl: HTMLElement | null;
  onClose: () => void;
}

export const TimelinePopover = ({ isOpen, legendAnchorEl, onClose }: ITimelinePopoverProps) => {
  const { t } = useTranslation();
  const { assetDetails } = useAssetHistoryPageContext();
  const { featureFlags } = useApplicationContext();

  const openLegend = Boolean(legendAnchorEl);
  const legendId = openLegend ? 'legend-popover' : undefined;
  const { groups, setAllColumnsVisible, isAllSelected, visibleColumns } = useColumnPopupContext();

  const handleSelectAll = () => setAllColumnsVisible(!isAllSelected);

  const isIndeterminate = useMemo(
    () => !isAllSelected && visibleColumns.length > 0,
    [isAllSelected, visibleColumns.length]
  );

  const filteredGroups = featureFlags.REACT_APP_FEATURE_LYNXFLT_7559_COMPARTMENTS_TOGGLE
    ? filterGroupsByCompartmentConfig(groups, assetDetails?.compartmentConfig)
    : groups;
  const groupMenuList = filteredGroups.map((item: IColumnGroup, index) => (
    <ColumnGroupMenu key={item.groupId} columnGroup={item} isTopLevel={index === 0} />
  ));

  return (
    <Popover
      id={legendId}
      open={isOpen}
      anchorEl={legendAnchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      sx={{ left: 5 }}
    >
      <Box
        sx={{
          width: 100,
          height: 500,
          padding: 0,
          minWidth: (theme) => theme.spacing(35),
          textAlign: 'center',
        }}
      >
        <Typography
          variant="subtitle1"
          component="div"
          sx={{ width: '100%', textAlign: 'left', pt: 2, pl: 2, pb: 1, fontWeight: 'bold' }}
        >
          {t('assethistory.route.temperature-sensors')}
        </Typography>
        <Divider variant="fullWidth" color={fleetThemeOptions.palette.background.desktop} />
        {groupMenuList.length > 0 && (
          <FormControl sx={{ paddingLeft: 0, width: '90%' }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isIndeterminate || isAllSelected}
                  indeterminate={isIndeterminate}
                  onChange={handleSelectAll}
                  data-testid="select-all"
                />
              }
              label={t('assethistory.route.select-all')}
              labelPlacement="end"
            />
          </FormControl>
        )}
        {groupMenuList}
      </Box>
    </Popover>
  );
};
