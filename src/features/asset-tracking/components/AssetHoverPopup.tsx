import Chip from '@carrier-io/fds-react/Chip';
import Typography from '@carrier-io/fds-react/Typography';
import { useTranslation } from 'react-i18next';
import Box from '@carrier-io/fds-react/Box';
import Grid from '@carrier-io/fds-react/Grid';
import { LocalShipping, OpenInFull } from '@mui/icons-material';
import IconButton from '@carrier-io/fds-react/IconButton';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { fleetThemeOptions } from '@carrier-io/fds-react/theme';

import { getAssetState } from '../utils/getAssetState';

import type { SnapshotDataEx } from '@/features/common';
import { useApplicationContext } from '@/providers/ApplicationContext';

type AssetHoverPopupProps = {
  snapshot: SnapshotDataEx;
  placeName: string;
  onShowAssetDetailsClick: (assetId: string) => void;
  setKeepPopupOpen: Dispatch<SetStateAction<boolean>>;
  onLoad?: () => void;
};

export const AssetHoverPopup = (props: AssetHoverPopupProps) => {
  const { snapshot, placeName, onShowAssetDetailsClick, setKeepPopupOpen, onLoad } = props;
  const { featureFlags } = useApplicationContext();
  const isAssetHealthEnabled = featureFlags.REACT_APP_FEATURE_HEALTH_STATUS;

  const { t } = useTranslation();

  useEffect(() => {
    if (onLoad) {
      onLoad();
    }
  }, [onLoad]);

  let chipLabel = '';
  let chipColor = '';

  switch (getAssetState(snapshot, isAssetHealthEnabled)) {
    case 'Alarm':
      chipLabel = t('assets.asset.table.active-alarm');
      chipColor = fleetThemeOptions.palette.error.main;
      break;
    case 'Yes':
      chipLabel = t('assets.asset.table.moving');
      chipColor = fleetThemeOptions.palette.success.main;
      break;
    case 'No':
      chipLabel = t('assets.asset.table.stationary');
      chipColor = fleetThemeOptions.palette.warning.main;
      break;
    default:
      break;
  }

  const handleOpenInFullClick = () => {
    if (snapshot.asset?.id) {
      onShowAssetDetailsClick(snapshot.asset.id);
    }
  };

  const handleMouseEnter = () => {
    setKeepPopupOpen(true);
  };

  const handleMouseLeave = () => {
    setKeepPopupOpen(false);
  };

  return (
    <Box display="flex" p="24px" m="-24px" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <Grid container direction="row" spacing={2}>
        <Grid item xs="auto">
          <Box pt={1}>
            <LocalShipping sx={{ fontSize: '1.5rem' }} />
          </Box>
        </Grid>
        <Grid item xs="auto" minWidth={200}>
          <Grid item>
            <Typography variant="subtitle1">{snapshot.asset?.name}</Typography>
          </Grid>
          <Grid item>
            <Typography variant="body2" color="text.secondary">
              {placeName}
            </Typography>
          </Grid>
          <Grid item pt={1.75}>
            <Chip
              label={chipLabel}
              size="small"
              // use style here because backgroundColor doesn't work with sx
              style={{
                height: '1.5rem',
                borderRadius: '.25rem',
                fontSize: '0.875rem',
                backgroundColor: chipColor,
                color: fleetThemeOptions.palette.common.white,
              }}
            />
          </Grid>
        </Grid>
        <Grid item xs="auto" pr={0.25}>
          <IconButton onClick={handleOpenInFullClick} aria-label="close">
            <OpenInFull sx={{ fontSize: '1rem', color: (theme) => theme.palette.action.active }} />
          </IconButton>
        </Grid>
      </Grid>
    </Box>
  );
};
