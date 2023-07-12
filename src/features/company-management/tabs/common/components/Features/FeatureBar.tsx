import { useEffect, useState } from 'react';
import Button from '@carrier-io/fds-react/Button';
import Typography from '@carrier-io/fds-react/Typography';
import IconButton from '@carrier-io/fds-react/IconButton';
import SettingsIcon from '@mui/icons-material/Settings';
import { useTranslation } from 'react-i18next';
import { AccessLevelType, FeatureType, Maybe } from '@carrier-io/lynx-fleet-types';
import Box from '@carrier-io/fds-react/Box';

import { Feature } from '../../types';

import { featureControlNameMap } from './constants';
import { FeatureControl } from './FeatureControl';
import { AccessLevelLabel } from './AccessLevelLabel';

import { useToggle } from '@/hooks';
import { Dialog } from '@/components/Dialog';

export const FeatureBar = ({
  name,
  title,
  logo,
  enabled,
  accessLevel,
  accessLevels,
  onFeatureSettingsSave,
  editingDisabled = false,
  subTenantsEnabled,
}: Feature & {
  onFeatureSettingsSave: (name: FeatureType, enabled: boolean, accessLevel: Maybe<AccessLevelType>) => void;
}) => {
  const { t } = useTranslation();

  const { value: openDialog, toggleOn: handleOpenDialog, toggleOff: handleCloseDialog } = useToggle(false);

  const [isFeatureSwitchEnabled, setIsFeatureSwitchEnabled] = useState(enabled);
  const [accessLevelValue, setAccessLevel] = useState<AccessLevelType | null>(accessLevel);

  useEffect(() => {
    setAccessLevel(accessLevel);
  }, [accessLevel]);

  useEffect(() => {
    setIsFeatureSwitchEnabled(enabled);
  }, [enabled]);

  const handleSave = () => {
    onFeatureSettingsSave(name, isFeatureSwitchEnabled, accessLevelValue);
    handleCloseDialog();
  };

  const handleCancel = () => {
    setIsFeatureSwitchEnabled(enabled);
    handleCloseDialog();
  };

  const disabled = editingDisabled || !accessLevels.find(({ enabled: enabledLevel }) => enabledLevel);

  const handleDialogIconClick = () => {
    if (!disabled) {
      handleOpenDialog();
    }
  };

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.5 }}>
        <Box mr={3} width={18}>
          {logo}
        </Box>
        <Typography mr="auto" color="text.secondary" variant="body1">
          {t(title)}
        </Typography>
        <Box display="flex" alignItems="center">
          <Box display="flex" alignItems="center" mr={2}>
            <AccessLevelLabel accessLevel={accessLevel} />
          </Box>
          <IconButton size="small" onClick={handleDialogIconClick}>
            <SettingsIcon color={disabled ? 'disabled' : 'inherit'} />
          </IconButton>
        </Box>
      </Box>
      <Dialog
        open={openDialog}
        onClose={handleCancel}
        dialogTitle={t(title)}
        fullWidth
        maxWidth="sm"
        content={
          <FeatureControl
            title={t(featureControlNameMap[name])}
            accessLevels={accessLevels}
            enabled={isFeatureSwitchEnabled}
            onFeatureEnable={setIsFeatureSwitchEnabled}
            accessLevelValue={accessLevelValue}
            setAccessLevel={setAccessLevel}
            subTenantsEnabled={subTenantsEnabled}
          />
        }
        actions={
          <>
            <Button color="secondary" variant="outlined" onClick={handleCancel}>
              {t('common.cancel')}
            </Button>
            <Button
              color="primary"
              variant="outlined"
              onClick={handleSave}
              disabled={isFeatureSwitchEnabled && !accessLevelValue}
            >
              {t('common.save')}
            </Button>
          </>
        }
      />
    </>
  );
};
