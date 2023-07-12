import Box from '@carrier-io/fds-react/Box';
import Grid from '@carrier-io/fds-react/Grid';
import MenuItem from '@carrier-io/fds-react/MenuItem';
import { SyntheticEvent, useState } from 'react';
import { Maybe } from '@carrier-io/lynx-fleet-types';
import { useTranslation } from 'react-i18next';

import { MoreActionsPopover } from '../../../components/MoreActionsPopover';
import { CompaniesTableParams } from '../types';
import { useEditCompany } from '../providers';
import { DeleteCompanyDialog } from '../components/DeleteCompanyDialog';

import { useToggle } from '@/hooks';

interface CompanyActionsRendererProps extends CompaniesTableParams {
  editAllowed: boolean;
  deleteAllowed: boolean;
}

export const CompanyActionsRenderer = ({ data, editAllowed, deleteAllowed }: CompanyActionsRendererProps) => {
  const { t } = useTranslation();

  const [anchorEl, setAnchorEl] = useState<Maybe<Element>>(null);
  // const [active, setActive] = useState(false);

  const {
    value: isDeleteCompanyDialogOpen,
    toggleOn: handleOpenDeleteCompanyDialog,
    toggleOff: handleCloseDeleteCompanyDialog,
  } = useToggle(false);

  const { handleOpenEditCompanyForm } = useEditCompany();

  // TODO: hidden for release 21.1.3
  // const handleSwitch = () => setActive(!active);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpen = (event: SyntheticEvent) => {
    setAnchorEl(event.currentTarget);
  };

  if (!data) {
    return null;
  }

  return (
    <>
      <MoreActionsPopover onClose={handleClose} onOpen={handleOpen} anchorEl={anchorEl}>
        <Box py={1} px={0.5}>
          <Grid direction="column" container>
            {editAllowed && (
              <>
                <MenuItem onClick={() => handleOpenEditCompanyForm(data.id)}>
                  {t('company.management.edit-company')}
                </MenuItem>
                {/* TODO: hidden for release 21.1.3 */}
                {/* <Grid item xs={12} className={classes.actionButton}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    {t('common.active')}
                    <Switch checked={active} onChange={handleSwitch} size="small" />
                  </Box>
                </Grid> */}
              </>
            )}
            {deleteAllowed && (
              <MenuItem onClick={handleOpenDeleteCompanyDialog}>
                {t('company.management.delete-company')}
              </MenuItem>
            )}
          </Grid>
        </Box>
      </MoreActionsPopover>
      {isDeleteCompanyDialogOpen && (
        <DeleteCompanyDialog
          open={isDeleteCompanyDialogOpen}
          onClose={handleCloseDeleteCompanyDialog}
          id={data.id}
          assetCount={data?.assetCount}
          userCount={data?.userCount}
        />
      )}
    </>
  );
};
