import { SyntheticEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@carrier-io/fds-react/Box';
import Grid from '@carrier-io/fds-react/Grid';
import MenuItem from '@carrier-io/fds-react/MenuItem';
import Switch from '@carrier-io/fds-react/Switch';
import Typography from '@carrier-io/fds-react/Typography';
import { Maybe } from '@carrier-io/lynx-fleet-types';

import { MoreActionsPopover } from '../../../../components/MoreActionsPopover';
import { RenameAssetDialog } from '../../../common/components/RenameAssetDialog';

import { useToggle } from '@/hooks';

interface AssetActionsRendererProps<T> {
  showIncompleteFeatures: boolean;
  editAssetAllowed: boolean;
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

  const handleClose = () => setAnchorEl(null);

  const handleSwitch = () => setActive(!active);

  const handleOpen = (event: SyntheticEvent) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <>
      <MoreActionsPopover onClose={handleClose} onOpen={handleOpen} anchorEl={anchorEl}>
        <Box minWidth={122}>
          <Grid direction="column" container>
            {editAssetAllowed && (
              <>
                <MenuItem onClick={handleOpenRenameAssetDialog} sx={{ px: 1.5 }}>
                  <Typography component="span" variant="body2">
                    {t('company.management.rename-asset')}
                  </Typography>
                </MenuItem>
                {showIncompleteFeatures && (
                  <MenuItem>
                    <Box display="flex" justifyContent="space-between">
                      {t('common.active')}
                      <Switch checked={active} onChange={handleSwitch} size="small" />
                    </Box>
                  </MenuItem>
                )}
              </>
            )}
          </Grid>
        </Box>
      </MoreActionsPopover>
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
