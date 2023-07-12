import { useFormikContext } from 'formik';
import Grid from '@carrier-io/fds-react/Grid';
import Box from '@carrier-io/fds-react/Box';
import Typography from '@carrier-io/fds-react/Typography';
import Button from '@carrier-io/fds-react/Button';
import { useTranslation } from 'react-i18next';
import { Description, DescriptionVariants } from '@carrier-io/fds-react/patterns/Description';
import Popper from '@carrier-io/fds-react/Popper';
import Fade from '@carrier-io/fds-react/Fade';
import Paper from '@carrier-io/fds-react/Paper';
import ClickAwayListener from '@carrier-io/fds-react/ClickAwayListener';
import { styled } from '@mui/material';

import { AddUserInput } from '../../types';
import { useReviewData } from '../../hooks';
import { usePopper } from '../../../common/hooks';

export const StyledText = styled('div')({
  maxWidth: '280px',
  flexWrap: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

export const ReviewStep = () => {
  const { t } = useTranslation();
  const { anchorEl, open: openInfo, handleShowPopper, handleClosePopper } = usePopper();
  const { values } = useFormikContext<AddUserInput>();

  const { userInfo, companyPreferencesInfo, groupInfo } = useReviewData(values, values.availableTenantGroups);

  return (
    <Grid container justifyContent="space-between">
      <Grid item xs={6}>
        <Box sx={{ backgroundColor: 'background.description', p: 2, borderRadius: 1, mr: 0.5, mb: 1 }}>
          <Typography marginBottom={1.25} variant="subtitle1">
            {t('user.management.user-information')}
          </Typography>
          <Description
            rowIndentCssUnit="rem"
            rowIndentValue={1.25}
            variant={DescriptionVariants.HorizontalJustifiedWithNoDots}
            sx={{ backgroundColor: 'background.description', overflowY: 'hidden', mb: 2 }}
          >
            {userInfo.map(({ label, text }) => (
              <Description.Item TextProps={{ textAlign: 'right' }} key={label} label={label}>
                <StyledText>{text}</StyledText>
              </Description.Item>
            ))}
          </Description>
        </Box>
        <Box sx={{ backgroundColor: 'background.description', p: 2, borderRadius: 1, mr: 0.5 }}>
          <Typography marginBottom={1.25} variant="subtitle1">
            {t('company.management.groups')}
          </Typography>
          <Description
            rowIndentCssUnit="rem"
            rowIndentValue={1.25}
            variant={DescriptionVariants.HorizontalJustifiedWithNoDots}
            sx={{ backgroundColor: 'background.description', overflowY: 'hidden', mb: 2 }}
          >
            {groupInfo.description.map(({ label, text }) => (
              <Description.Item TextProps={{ textAlign: 'right' }} key={label} label={label}>
                <Button
                  sx={{ p: 0, textTransform: 'lowercase' }}
                  variant="text"
                  color="primary"
                  onClick={handleShowPopper}
                >
                  {text}
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
                            <Box p={2} minWidth={200}>
                              {groupInfo.groupRoleMap.map((group) => (
                                <Box display="flex" justifyContent="space-between">
                                  <Typography mr={2} variant="body1" color="text.secondary">
                                    {group.name}
                                  </Typography>
                                  <Typography variant="body1" color="text.primary" fontWeight={600}>
                                    {group.role}
                                  </Typography>
                                </Box>
                              ))}
                            </Box>
                          </ClickAwayListener>
                        </Paper>
                      </Fade>
                    )}
                  </Popper>
                </Button>
              </Description.Item>
            ))}
          </Description>
        </Box>
      </Grid>
      <Grid item xs={6}>
        <Box
          sx={{
            backgroundColor: 'background.description',
            p: 2,
            borderRadius: 1,
            ml: 0.5,
            height: '100%',
          }}
        >
          <Typography marginBottom={1.25} variant="subtitle1">
            {t('company.management.company-preferences')}
          </Typography>
          <Description
            rowIndentCssUnit="rem"
            rowIndentValue={1.25}
            variant={DescriptionVariants.HorizontalJustifiedWithNoDots}
            sx={{ backgroundColor: 'background.description', overflowY: 'hidden' }}
          >
            {companyPreferencesInfo.map(({ label, text }) => (
              <Description.Item TextProps={{ textAlign: 'right' }} key={label} label={label}>
                {text}
              </Description.Item>
            ))}
          </Description>
        </Box>
      </Grid>
    </Grid>
  );
};

ReviewStep.displayName = 'ReviewStep';
