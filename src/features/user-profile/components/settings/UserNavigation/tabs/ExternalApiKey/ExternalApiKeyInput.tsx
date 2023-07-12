import { FC, useCallback, useEffect, useState } from 'react';
import Grid from '@carrier-io/fds-react/Grid';
import Typography from '@carrier-io/fds-react/Typography';
import TextField, { TextFieldInputProps } from '@carrier-io/fds-react/TextField';
import IconButton from '@carrier-io/fds-react/IconButton';
import { Visibility, VisibilityOff, Key } from '@mui/icons-material';
import Box from '@carrier-io/fds-react/Box';
import ButtonBase from '@carrier-io/fds-react/ButtonBase';
import { useTranslation } from 'react-i18next';
import { UserService } from '@carrier-io/lynx-fleet-data-lib';

import { Maybe } from '@/types';
import { Loader } from '@/components';
import { CopyToClipboard } from '@/components/CopyToClipboard';
import { getAuthUserEmail } from '@/features/authentication';
import { useAppSelector } from '@/stores';

export const ExternalApiKeyInput: FC = () => {
  const { t } = useTranslation();
  const authUserEmail = useAppSelector(getAuthUserEmail);
  const [key, setKey] = useState<Maybe<string>>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [showKey, setShowKey] = useState<boolean>(false);

  const loadKey = useCallback(async (): Promise<void> => {
    if (!authUserEmail) {
      setError(true);

      return;
    }

    setLoading(true);

    try {
      const getResponse = await UserService.getUserApiKey({ email: authUserEmail });
      const { data, error: getApiKeyError } = getResponse.data.getApiKey;

      if (getApiKeyError === null) {
        setKey((data && data[0]?.key) || null);
        setLoading(false);

        return;
      }
    } catch {
      setError(true);
      setLoading(false);

      return;
    }

    try {
      const createResponse = await UserService.createUserApiKey({ email: authUserEmail });

      if (createResponse.data) {
        const { data, error: createApiKeyError } = createResponse.data.createApiKey;

        if (createApiKeyError === null) {
          setKey(data?.key || null);
        } else {
          setError(true);
        }
      }

      setLoading(false);
    } catch {
      setError(true);
      setLoading(false);
    }
  }, [authUserEmail]);

  const generateNewKey = async (): Promise<void> => {
    if (!authUserEmail) {
      return;
    }

    setKey(null);
    setLoading(true);

    try {
      const deleteResponse = await UserService.deleteUserApiKey({ email: authUserEmail });

      if (!deleteResponse.data) {
        return;
      }

      const { error: deleteApiKeyError } = deleteResponse.data.deleteApiKey;

      if (deleteApiKeyError !== null) {
        setLoading(false);
        setError(true);

        return;
      }
    } catch {
      setError(true);
      setLoading(false);

      return;
    }

    try {
      const createResponse = await UserService.createUserApiKey({ email: authUserEmail });

      if (createResponse.data) {
        const { data: createData, error: createError } = createResponse.data.createApiKey;

        if (createError === null) {
          setKey(createData?.key || null);
        } else {
          setError(true);
        }
      }

      setLoading(false);
    } catch (e) {
      setLoading(false);
      setError(true);
    }
  };

  useEffect(() => {
    loadKey();
  }, [loadKey]);

  const changeKeyVisible = () => {
    setShowKey((prevValue) => !prevValue);
  };

  const keyInput: TextFieldInputProps = {
    endAdornment: (
      <IconButton onClick={changeKeyVisible}>{showKey ? <VisibilityOff /> : <Visibility />}</IconButton>
    ),
    type: showKey ? 'text' : 'password',
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Box>
      {error ? (
        <Grid container>
          <Typography variant="caption" color="error.dark">
            {t('user.profile.external-api-key.error')}
          </Typography>
        </Grid>
      ) : (
        <>
          <TextField
            inputSetting={keyInput}
            defaultValue={key}
            helperText={t('user.profile.external-api-key.copy-to-use')}
            fullWidth
          />
          <Box display="flex" justifyContent="space-between" sx={{ marginTop: '1.375rem' }}>
            <CopyToClipboard label={t('user.profile.external-api-key.copy')} text={key || ''} />
            <ButtonBase onClick={generateNewKey}>
              <Key sx={{ marginRight: '.5rem', color: 'primary.main' }} />
              <Typography color="primary" variant="buttonMedium">
                {t('user.profile.external-api-key.new')}
              </Typography>
            </ButtonBase>
          </Box>
        </>
      )}
    </Box>
  );
};
