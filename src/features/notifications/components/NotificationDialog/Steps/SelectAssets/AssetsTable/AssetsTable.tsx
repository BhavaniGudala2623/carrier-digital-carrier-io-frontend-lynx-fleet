import { useCallback, useMemo, useState } from 'react';
import { FirstDataRenderedEvent, SelectionChangedEvent } from '@ag-grid-community/core';
import { AssetRow } from '@carrier-io/lynx-fleet-types';
import Box from '@carrier-io/fds-react/Box';
import { useTranslation } from 'react-i18next';
import SearchBox from '@carrier-io/fds-react/patterns/SearchBox';
import { Typography } from '@carrier-io/fds-react';

import { getColumns } from './columns';

import { Loader, Table, TableProps } from '@/components';
import { useUserSettings } from '@/providers/UserSettings';

type AssetsTableProps = {
  assets?: AssetRow[];
  onSelectedAssetIdsChanged: (assetsIds: string[]) => void;
  selectedAssetIds: string[];
  loading?: boolean;
} & TableProps;

export const AssetsTable = ({
  assets,
  selectedAssetIds,
  onSelectedAssetIdsChanged,
  loading,
}: AssetsTableProps) => {
  const { userSettings } = useUserSettings();
  const { dateFormat } = userSettings;
  const { t } = useTranslation();
  const [searchText, setSearchText] = useState('');

  const handleSelectionChanged = useCallback(
    (event: SelectionChangedEvent) => {
      onSelectedAssetIdsChanged(event.api.getSelectedNodes().map(({ data }) => data.id));
    },
    [onSelectedAssetIdsChanged]
  );

  const columns = useMemo(() => getColumns(t, dateFormat), [t, dateFormat]);

  const handleFirstDataRendered = useCallback(
    (event: FirstDataRenderedEvent) => {
      event.api.forEachNode((node) => {
        if (selectedAssetIds.includes(node.id as string)) {
          node.setSelected(true);
        }
      });
    },
    [selectedAssetIds]
  );

  return (
    <Box height={400} position="relative" display="flex" flexDirection="column">
      {loading && <Loader overlay />}
      <Table
        onFirstDataRendered={handleFirstDataRendered}
        columnDefs={columns}
        sortingOrder={['asc', 'desc']}
        rowData={assets}
        getRowId={({ data }) => data.id}
        rowSelection="multiple"
        rowMultiSelectWithClick
        resizeColumnsToFit
        suppressRowClickSelection
        accentedSort
        onSelectionChanged={handleSelectionChanged}
        quickFilterText={searchText}
        HeaderProps={{
          sx: {
            justifyContent: 'space-between',
            borderBottom: '1px solid',
            borderColor: 'secondary.light',
            p: 1,
          },
        }}
        headerContent={
          <>
            <SearchBox
              multiple={false}
              size="small"
              TextFieldProps={{
                placeholder: t('common.search'),
                showBorder: false,
                sx: {
                  minWidth: '352px',
                },
              }}
              onChange={({ text }) => setSearchText(text)}
            />
            <Typography variant="body1">
              {t(
                selectedAssetIds.length === 1 ? 'common.count-item-selected' : 'common.count-items-selected',
                {
                  selected: selectedAssetIds.length,
                }
              )}
            </Typography>
          </>
        }
      />
    </Box>
  );
};
