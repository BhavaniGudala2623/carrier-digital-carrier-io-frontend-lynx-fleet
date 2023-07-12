import { SyntheticEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@carrier-io/fds-react/Box';
import MenuList from '@carrier-io/fds-react/MenuList';
import Typography from '@carrier-io/fds-react/Typography';
import MenuItem from '@carrier-io/fds-react/MenuItem';
import { Maybe } from '@carrier-io/lynx-fleet-types';

import { MoreActionsPopover } from '../../../../components/MoreActionsPopover';
import { DeleteFleetConfirmationDialogContainer, EditFleetDialogContainer } from '../../containers';

import { useToggle } from '@/hooks';

interface CombinedActionsRendererProps<T> {
  editFleetAllowed: boolean;
  deleteFleetAllowed: boolean;
  fleetRow: T;
}

export const FleetActionsPopover = <T extends { __typename: Maybe<string>; id: string; name: string }>({
  editFleetAllowed,
  deleteFleetAllowed,
  fleetRow,
}: CombinedActionsRendererProps<T>) => {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<Maybe<Element>>(null);

  const {
    value: isDeleteFleetDialogOpen,
    toggleOn: handleOpenDeleteFleetDialog,
    toggleOff: handleCloseDeleteFleetDialog,
  } = useToggle(false);

  const {
    value: isEditFleetDialogOpen,
    toggleOn: handleOpenEditFleetDialog,
    toggleOff: handleCloseEditFleetDialog,
  } = useToggle(false);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpen = (event: SyntheticEvent) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <>
      <MoreActionsPopover onClose={handleClose} onOpen={handleOpen} anchorEl={anchorEl}>
        <Box minWidth={130}>
          <MenuList>
            {editFleetAllowed && (
              <MenuItem onClick={handleOpenEditFleetDialog} sx={{ px: 1.5 }}>
                <Typography variant="body2" textTransform="capitalize">
                  {t('company.management.edit-fleet')}
                </Typography>
              </MenuItem>
            )}
            {deleteFleetAllowed && (
              <MenuItem onClick={handleOpenDeleteFleetDialog} sx={{ px: 1.5 }}>
                <Typography variant="body2" textTransform="capitalize">
                  {t('company.management.delete-fleet')}
                </Typography>
              </MenuItem>
            )}
          </MenuList>
        </Box>
      </MoreActionsPopover>
      {isDeleteFleetDialogOpen && fleetRow && 'id' in fleetRow && (
        <DeleteFleetConfirmationDialogContainer
          onClose={handleCloseDeleteFleetDialog}
          fleetId={fleetRow.id}
        />
      )}
      {isEditFleetDialogOpen && fleetRow && (
        <EditFleetDialogContainer fleet={fleetRow} onClose={handleCloseEditFleetDialog} />
      )}
    </>
  );
};
