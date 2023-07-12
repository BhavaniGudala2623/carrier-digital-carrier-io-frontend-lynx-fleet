import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import MenuItem from '@carrier-io/fds-react/MenuItem';
import Typography from '@carrier-io/fds-react/Typography';
import { LanguageType } from '@carrier-io/lynx-fleet-types';

import { wialonOpen } from '../utils/wialon';

import { AdvancedTrackingIcon } from '@/components';
import { Maybe } from '@/types';
import { rootSlice, useAppDispatch, useAppSelector } from '@/stores';
import { getAuthUserEmail } from '@/features/authentication';

export const AdvancedTrackingButton: FC<{
  language: Maybe<LanguageType>;
}> = ({ language }) => {
  const dispatch = useAppDispatch();
  const authUserEmail = useAppSelector(getAuthUserEmail);

  const { t } = useTranslation();

  const onClick = async () => {
    const { setExtLoading } = rootSlice.actions;

    dispatch(setExtLoading(true));
    await wialonOpen(authUserEmail, language);
    dispatch(setExtLoading(false));
  };

  return (
    <MenuItem onClick={onClick} data-testId="advanced-tracking-button">
      <AdvancedTrackingIcon />
      <Typography variant="body2" ml={1.5}>
        {t('assets.management.advanced-tracking')}
      </Typography>
    </MenuItem>
  );
};
