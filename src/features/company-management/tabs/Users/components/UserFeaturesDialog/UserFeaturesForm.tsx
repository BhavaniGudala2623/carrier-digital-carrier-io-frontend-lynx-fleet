import Box from '@carrier-io/fds-react/Box';
import Button from '@carrier-io/fds-react/Button';
import { useTranslation } from 'react-i18next';
import FormControlLabel from '@carrier-io/fds-react/FormControlLabel';
import Switch from '@carrier-io/fds-react/Switch';
import { Typography } from '@carrier-io/fds-react';
import { MainService } from '@carrier-io/lynx-fleet-data-lib';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';

import { Loader } from '@/components';
import { useAppDispatch } from '@/stores';
import { showError, showMessage } from '@/stores/actions';
import { FeatureFlagType, earlyAccessFeatures } from '@/config';

interface UserFeaturesFormProps {
  userEmail: string;
  onClose: () => void;
}

export const UserFeaturesForm = ({ userEmail, onClose }: UserFeaturesFormProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const [enabledFeatureFlags, setEnabledFeatureFlags] = useState<FeatureFlagType[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data, loading } = MainService.useGetUserFeatureFlags({ email: userEmail });

  useEffect(() => {
    if (!loading && data) {
      const { success, error, enabledFeatureFlags: userFeatureFlags } = data.getUserFeatureFlags;

      if (success) {
        setEnabledFeatureFlags([...((userFeatureFlags as FeatureFlagType[]) ?? [])]);
      } else {
        showError(dispatch, error);
        onClose();
      }
    }
  }, [loading, data, dispatch, onClose]);

  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const featureFlag = event.target.name as FeatureFlagType;

    setEnabledFeatureFlags((prev) =>
      prev.filter((item) => item !== featureFlag).concat(event.target.checked ? [featureFlag] : [])
    );
  }, []);

  const handleSubmit = async () => {
    setIsSubmitting(true);

    MainService.updateUserFeatureFlags({
      input: {
        email: userEmail,
        enabledFeatureFlags,
      },
    })
      .then((response) => {
        setIsSubmitting(false);
        if (response.data?.updateUserFeatureFlags.success) {
          showMessage(dispatch, t('user.management.user.update-success'));
          onClose();
        } else {
          showError(dispatch, response.data?.updateUserFeatureFlags.error);
        }
      })
      .catch((error) => {
        setIsSubmitting(false);
        showError(dispatch, error);
      });
  };

  return (
    <Box display="flex" flexDirection="column">
      <Typography variant="subtitle2" mt={1.25}>
        {t('common.user-email')}: {userEmail}
      </Typography>

      <Box display="flex" flexDirection="column" mb={2.5} ml={1} mt={1}>
        {earlyAccessFeatures.map((feature) => (
          <FormControlLabel
            key={feature.flag}
            sx={{ mt: 2 }}
            control={
              <Switch
                size="small"
                name={feature.flag}
                color="primary"
                checked={enabledFeatureFlags.includes(feature.flag)}
                onChange={handleChange}
                sx={{ mr: 1 }}
              />
            }
            label={feature.name}
          />
        ))}
      </Box>

      <Box display="flex" justifyContent="flex-end" mt={2.5}>
        <Button color="secondary" variant="outlined" sx={{ ml: 'auto' }} onClick={onClose}>
          {t('common.cancel')}
        </Button>
        <Button onClick={handleSubmit} sx={{ ml: 2 }} color="primary" variant="outlined" type="submit">
          {t('common.save')}
        </Button>
      </Box>
      {(loading || isSubmitting) && <Loader overlay />}
    </Box>
  );
};

UserFeaturesForm.displayName = 'UserFeaturesForm';
