import Box from '@carrier-io/fds-react/Box';
import RadioGroup from '@carrier-io/fds-react/RadioGroup';
import FormControlLabel from '@carrier-io/fds-react/FormControlLabel';
import Switch from '@carrier-io/fds-react/Switch';
import Radio from '@carrier-io/fds-react/Radio';
import Typography from '@carrier-io/fds-react/Typography';
import { useTranslation } from 'react-i18next';
import { AccessLevelType } from '@carrier-io/lynx-fleet-types';
import { ChangeEvent } from 'react';

import { Feature } from '../../types';

interface FeatureControlProps {
  title: string;
  enabled: boolean;
  onFeatureEnable: (value: boolean) => void;
  accessLevelValue?: Feature['accessLevel'];
  setAccessLevel: (value: AccessLevelType) => void;
  accessLevels: Feature['accessLevels'];
  subTenantsEnabled: boolean;
}

export const FeatureControl = ({
  title,
  enabled,
  onFeatureEnable,
  accessLevels,
  setAccessLevel,
  accessLevelValue,
  subTenantsEnabled,
}: FeatureControlProps) => {
  const { t } = useTranslation();

  const onToggleFeature = (event: ChangeEvent<HTMLInputElement>) => onFeatureEnable(event.target.checked);

  const handleChangeAccessLevel = (event: ChangeEvent<HTMLInputElement>) => {
    const level = event.target.value as AccessLevelType;
    setAccessLevel(level);
  };

  return (
    <div>
      <Box display="flex" justifyContent="space-between" pb={1}>
        <Box display="flex" alignItems="center">
          <Typography variant="body1">{t(title)}</Typography>
        </Box>
        <Switch
          checked={enabled}
          onChange={onToggleFeature}
          size="medium"
          disabled={enabled && subTenantsEnabled}
        />
      </Box>
      <RadioGroup
        aria-label="gender"
        name="accessLevel"
        value={accessLevelValue}
        onChange={handleChangeAccessLevel}
      >
        {accessLevels.map((level) => (
          <FormControlLabel
            key={level.type}
            labelPlacement="start"
            value={level.type}
            control={<Radio />}
            label={t(level.label)}
            disabled={!enabled || !level.enabled}
            sx={{ pb: 1 }}
          />
        ))}
      </RadioGroup>
    </div>
  );
};
