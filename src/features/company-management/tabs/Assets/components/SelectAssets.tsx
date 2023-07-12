import { useMemo, useState } from 'react';
import { ApolloError } from '@apollo/client';
import { useFormikContext } from 'formik';
import Box from '@carrier-io/fds-react/Box';
import Paper from '@carrier-io/fds-react/Paper';
import { useRbac } from '@carrier-io/rbac-provider-react';
import { AssetRow } from '@carrier-io/lynx-fleet-types';
import SearchBox from '@carrier-io/fds-react/patterns/SearchBox';
import { useTranslation } from 'react-i18next';
import Typography from '@carrier-io/fds-react/Typography';
import { AssetService } from '@carrier-io/lynx-fleet-data-lib';
import { fleetThemeOptions } from '@carrier-io/fds-react/theme';

import { RowSelected } from '../../common/types';

import { AssetsTable } from './AssetsTable';
import { defaultDefsConfigs } from './constants';

import { useAppDispatch } from '@/stores';
import { showError } from '@/stores/actions';
import { companyActionPayload } from '@/features/authorization';

interface AssetsTableContainerProps {
  onSelectedAssetsChange?: (assets: AssetRow[]) => void;
  tenantId: string;
  showOnlyUnassignedAssets?: boolean;
  defsConfigs?: string[];
}

export const SelectAssets = ({
  onSelectedAssetsChange,
  tenantId,
  showOnlyUnassignedAssets = false,
  defsConfigs = defaultDefsConfigs,
}: AssetsTableContainerProps) => {
  const { hasPermission } = useRbac();
  const [quickFilterText, setQuickFilterText] = useState<string>('');
  const { t } = useTranslation();

  const { editAssetAllowed, deleteAssetAllowed } = useMemo(
    () => ({
      editAssetAllowed: hasPermission(companyActionPayload('asset.edit', tenantId)),
      deleteAssetAllowed: hasPermission(companyActionPayload('fleet.edit', tenantId)),
    }),
    [hasPermission, tenantId]
  );

  const { errors, values, setFieldError, setFieldValue } = useFormikContext<{ assetIds: string[] }>();

  const dispatch = useAppDispatch();

  const { data, loading } = AssetService.useGetAssetsRow(
    {
      for: { type: 'ALL' },
    },
    {
      onError: (e: ApolloError) => showError(dispatch, e),
    }
  );

  const rowData = useMemo(() => {
    if (!tenantId) {
      return [];
    }

    const assets = data?.getAssets?.items;
    if (showOnlyUnassignedAssets) {
      return assets?.filter((asset) => !asset.tenant);
    }

    return assets?.filter((asset) => asset.tenant?.id === tenantId);
  }, [data?.getAssets?.items, showOnlyUnassignedAssets, tenantId]);

  const assetsById = (rowData || []).reduce<{ [index: string]: AssetRow }>(
    (acc, asset) => ({
      ...acc,
      [asset.id]: asset,
    }),
    {}
  );

  const handleSelectionChange = (assets: RowSelected[]) => {
    const selectedIds = assets.map((asset) => asset.id);

    setFieldValue('assetIds', selectedIds);
    setFieldError('assetIds', '');

    if (onSelectedAssetsChange) {
      const selectedAssets = selectedIds.map((assetId) => assetsById[assetId]);
      onSelectedAssetsChange(selectedAssets);
    }
  };

  const handleSearchBoxChange = ({ text }) => {
    setQuickFilterText(text);
  };

  return (
    <Box mb={2}>
      <Paper sx={{ minHeight: 430, height: '100%', mb: 1 }}>
        <Box
          sx={{
            borderBottom: (theme) => `1px solid ${theme.palette.secondary.light}`,
            p: 1,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <SearchBox
            multiple={false}
            TextFieldProps={{
              placeholder: t('common.search'),
              value: '',
              showBorder: false,
            }}
            onChange={handleSearchBoxChange}
            size="small"
            sx={{
              width: '352px',
            }}
            filledInputStyles={{ backgroundColor: fleetThemeOptions.palette.addition.filledInputBackground }}
          />
          <Typography>{`(${values.assetIds.length}) ${t('common.items-selected')}`}</Typography>
        </Box>
        <Box height={430} sx={{ '& .MuiPaper-root': { pt: 0 } }}>
          <AssetsTable
            defsConfig={defsConfigs}
            quickFilterText={quickFilterText}
            rowData={rowData}
            loading={loading}
            selectedIds={values.assetIds}
            onSelectedIdsChange={handleSelectionChange}
            permissions={{
              editAssetAllowed,
              deleteAssetAllowed,
            }}
            checkboxSelection
            headerCheckboxSelection
          />
        </Box>
      </Paper>
      <Box height={20}>
        {errors.assetIds && (
          <Typography variant="caption" color="error">
            {errors.assetIds}
          </Typography>
        )}
      </Box>
    </Box>
  );
};
