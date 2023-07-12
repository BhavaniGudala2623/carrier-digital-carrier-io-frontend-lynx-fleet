import { SyntheticEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@carrier-io/fds-react/Box';
import MenuList from '@carrier-io/fds-react/MenuList';
import MenuItem from '@carrier-io/fds-react/MenuItem';
import Switch from '@carrier-io/fds-react/Switch';
import Typography from '@carrier-io/fds-react/Typography';
import { Maybe } from '@carrier-io/lynx-fleet-types';

import { MoreActionsPopover } from '../../../../components/MoreActionsPopover';
import { RenameAssetDialog } from '../../../common/components/RenameAssetDialog';
import { useRemoveAssetFromFleet } from '../../hooks';

import { useToggle } from '@/hooks';
import { Loader } from '@/components';

interface AssetActionsRendererProps<T> {
  showIncompleteFeatures: boolean;
  editAssetAllowed: boolean;
  deleteAssetAllowed: boolean;
  assetRow: T;
}

export const AssetActionsPopover = <
  T extends {
    __typename: Maybe<string>;
    id: string;
    name: string;
    nearestFleetIdInHierarchy?: Maybe<string>;
  }
>({
  showIncompleteFeatures,
  editAssetAllowed,
  deleteAssetAllowed,
  assetRow,
}: AssetActionsRendererProps<T>) => {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<Maybe<Element>>(null);
  const [active, setActive] = useState(false);

  const {
    value: isRenameAssetDialogOpen,
    toggleOn: handleOpenRenameAssetDialog,
    toggleOff: handleCloseRenameAssetDialog,
  } = useToggle(false);

  const { id, nearestFleetIdInHierarchy } = assetRow;

  const handleClose = () => setAnchorEl(null);

  const { handleRemoveAssetFromFleet, isRemovingAssetFromFleet } = useRemoveAssetFromFleet(handleClose);

  const handleAssetRemove = async () => {
    if (id && nearestFleetIdInHierarchy) {
      await handleRemoveAssetFromFleet({
        fleetId: nearestFleetIdInHierarchy,
        assetId: id,
      });
    }
  };

  const handleSwitch = () => setActive(!active);

  const handleOpen = (event: SyntheticEvent) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <>
      <MoreActionsPopover onClose={handleClose} onOpen={handleOpen} anchorEl={anchorEl}>
        <Box width={156}>
          <MenuList disablePadding>
            {editAssetAllowed && (
              <MenuItem onClick={handleOpenRenameAssetDialog} sx={{ px: 1.5 }}>
                <Typography variant="body2">{t('company.management.rename-asset')}</Typography>
              </MenuItem>
            )}
            {editAssetAllowed && showIncompleteFeatures && (
              <MenuItem sx={{ px: 1.5 }}>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2">{t('common.active')}</Typography>
                  <Switch checked={active} onChange={handleSwitch} size="small" />
                </Box>
              </MenuItem>
            )}
            {deleteAssetAllowed && nearestFleetIdInHierarchy && (
              <MenuItem onClick={handleAssetRemove} sx={{ px: 1.5 }}>
                <Typography variant="body2">{t('company.management.remove-from-fleet')}</Typography>
              </MenuItem>
            )}
          </MenuList>
        </Box>
      </MoreActionsPopover>
      {isRemovingAssetFromFleet && <Loader overlay size={16} />}
      {isRenameAssetDialogOpen && (
        <RenameAssetDialog
          open={isRenameAssetDialogOpen}
          onClose={handleCloseRenameAssetDialog}
          id={assetRow.id}
          name={assetRow.name}
        />
      )}
    </>
  );
};
