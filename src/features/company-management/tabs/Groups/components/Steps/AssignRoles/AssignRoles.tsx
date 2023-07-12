import Box from '@carrier-io/fds-react/Box';
import ClickAwayListener from '@carrier-io/fds-react/ClickAwayListener';
import IconButton from '@carrier-io/fds-react/IconButton';
import Paper from '@carrier-io/fds-react/Paper';
import Popper from '@carrier-io/fds-react/Popper';
import Typography from '@carrier-io/fds-react/Typography';
import { useTranslation } from 'react-i18next';
import { useFormikContext } from 'formik';
import { InfoOutlined } from '@mui/icons-material';
import Fade from '@carrier-io/fds-react/Fade';

import { CreateGroupFormValuesType } from '../../../types';
import { ContentContainer } from '../styles';
import { usePopper } from '../../../../common/hooks';

import { InfoPopUpContent } from './InfoPopUpContent';
import { GroupRolesField } from './GroupRolesField';

interface AssignRolesProps {
  activeStep: number;
}

export const AssignRoles = ({ activeStep }: AssignRolesProps) => {
  const { t } = useTranslation();
  const { values } = useFormikContext<CreateGroupFormValuesType>();

  const { anchorEl, open: openInfo, handleShowPopper, handleClosePopper } = usePopper();

  return (
    <ContentContainer sx={{ my: 4 }}>
      <Box mb={1} display="flex" justifyContent="flex-start" alignItems="center">
        <Typography
          variant="body1"
          sx={{
            mr: 0.5,
          }}
        >
          {t('company.management.create-group.assign-roles')}
        </Typography>
        <IconButton size="small" aria-label="close" color="inherit" onClick={handleShowPopper}>
          <InfoOutlined fontSize="small" />
        </IconButton>
        <Popper
          style={{ zIndex: 9999 }}
          open={openInfo}
          anchorEl={anchorEl}
          placement="right"
          transition
          direction="ltr"
        >
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={350}>
              <Paper>
                <ClickAwayListener onClickAway={handleClosePopper}>
                  <InfoPopUpContent />
                </ClickAwayListener>
              </Paper>
            </Fade>
          )}
        </Popper>
      </Box>
      <Box mb={1}>
        <Typography sx={{ mb: 1 }} variant="subtitle1" color="text.primary">
          {t('user.management.add.group.owner')}
        </Typography>
        <Typography variant="body1">{values.ownerName}</Typography>
      </Box>
      <Box mb={2}>
        <GroupRolesField activeStep={activeStep} />
      </Box>
    </ContentContainer>
  );
};

AssignRoles.displayName = 'AssignRoles';
