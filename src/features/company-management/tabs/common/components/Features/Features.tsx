import { useTranslation } from 'react-i18next';
import { AccessLevelType } from '@carrier-io/lynx-fleet-types';
import Box from '@carrier-io/fds-react/Box';
import Typography from '@carrier-io/fds-react/Typography';
import { grey } from '@mui/material/colors';
import Button from '@carrier-io/fds-react/Button';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';

import { ConfigFeatures, Feature } from '../../types';

import { FeatureBar } from './FeatureBar';

interface FeaturesProps {
  featuresData: ConfigFeatures[];
  onFeaturesSave: (name: Feature['name'], enabled: boolean, accessLevel: AccessLevelType | null) => void;
  handleReset: () => void;
}

export const Features = ({ featuresData, onFeaturesSave, handleReset }: FeaturesProps) => {
  const { t } = useTranslation();

  return (
    <Box position="relative">
      <div>
        {featuresData.map(({ configName, features }) => (
          <div key={configName}>
            <Box py={1.5}>
              <Typography color={grey[500]}>{configName}</Typography>
            </Box>
            <div>
              {features.map(
                ({
                  subTenantsEnabled,
                  name,
                  title,
                  enabled,
                  accessLevel,
                  accessLevels,
                  logo,
                  editingDisabled,
                }) => (
                  <FeatureBar
                    key={String(name)}
                    name={name}
                    title={title}
                    logo={logo}
                    enabled={enabled}
                    accessLevel={accessLevel}
                    accessLevels={accessLevels}
                    onFeatureSettingsSave={onFeaturesSave}
                    editingDisabled={editingDisabled}
                    subTenantsEnabled={subTenantsEnabled}
                  />
                )
              )}
            </div>
          </div>
        ))}
      </div>
      <Button
        sx={{ position: 'absolute', bottom: '-60px', right: 0 }}
        startIcon={<RefreshOutlinedIcon />}
        variant="text"
        onClick={handleReset}
      >
        {t('common.reset')}
      </Button>
    </Box>
  );
};
