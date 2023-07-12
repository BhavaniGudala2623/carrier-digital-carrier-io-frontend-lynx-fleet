import { Maybe } from '@carrier-io/lynx-fleet-types';
import { useState, useCallback, useEffect, useMemo } from 'react';
import Typography from '@carrier-io/fds-react/Typography';
import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import Box from '@carrier-io/fds-react/Box';
import Paper from '@carrier-io/fds-react/Paper';
import FormHelperText from '@carrier-io/fds-react/FormHelperText';

import { NotificationFormData } from '../../../../types';

import { AssetsTable } from './AssetsTable';

import { TenantFleetsSelect, UserAccessibleTenantsSelect, useTenantAssets } from '@/features/common';
import { OptionItem } from '@/types';
import { showError } from '@/stores/actions';
import { useAppDispatch } from '@/stores';

export const SelectAssets = (): JSX.Element | null => {
  const { values, setFieldValue, errors, dirty } = useFormikContext<NotificationFormData>();
  const [selectedCompany, setSelectedCompany] = useState<Maybe<OptionItem>>(null);
  const [selectedFleet, setSelectedFleet] = useState<Maybe<OptionItem>>(null);

  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const { assets, isAssetsLoading, error: assetsError } = useTenantAssets(selectedCompany?.id);

  const handleTenantChange = useCallback(
    (value: Maybe<OptionItem>) => {
      setSelectedCompany(value);

      if (value) {
        setFieldValue('assets.companyId', value.id);
      }
    },
    [setFieldValue]
  );

  const handleFleetChange = useCallback(
    (value: Maybe<OptionItem>) => {
      setSelectedFleet(value);
      setFieldValue('assets.fleetId', value?.id);
    },
    [setFieldValue]
  );

  useEffect(() => {
    if (assetsError) {
      showError(dispatch, assetsError);
    }
  }, [assetsError, dispatch]);

  const handleChangeSelectedAssetsIds = useCallback(
    (assetIds: string[]) => {
      setFieldValue('assets.assetIds', assetIds, true);
    },
    [setFieldValue]
  );

  const filteredAssets = useMemo(() => {
    if (!values.assets.fleetId) {
      return assets;
    }

    return assets.filter((item) => item.fleets?.map((el) => el.id).includes(values.assets.fleetId));
  }, [assets, values.assets.fleetId]);

  return (
    <Box display="flex" flexDirection="column">
      <Typography variant="body1" mb={1}>
        {t('notifications.select-assets-step-header')}
      </Typography>
      <Box display="flex" flexDirection="column" width={480}>
        <UserAccessibleTenantsSelect
          onChange={handleTenantChange}
          value={selectedCompany}
          defaultId={values.assets.companyId}
          renderSingleOptionAsDisabledTextField
          size="small"
          sx={{ mb: 2 }}
        />
        <TenantFleetsSelect
          tenantId={selectedCompany?.id}
          onChange={handleFleetChange}
          value={selectedFleet}
          defaultId={values.assets.fleetId}
          hideIfNoOptions
          size="small"
          sx={{ mb: 2 }}
        />
      </Box>
      <Paper variant="outlined" sx={{ mb: 1, display: 'flex', flexDirection: 'column' }}>
        <AssetsTable
          assets={filteredAssets}
          onSelectedAssetIdsChanged={handleChangeSelectedAssetsIds}
          selectedAssetIds={values.assets.assetIds ?? []}
          loading={isAssetsLoading}
        />
      </Paper>
      {errors.assets?.assetIds && (
        <FormHelperText error={dirty} variant="filled" sx={{ mb: 2, ml: 0 }}>
          {errors.assets.assetIds}
        </FormHelperText>
      )}
    </Box>
  );
};
