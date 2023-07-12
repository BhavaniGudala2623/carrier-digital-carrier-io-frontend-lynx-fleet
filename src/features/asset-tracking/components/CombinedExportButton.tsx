import { MouseEvent, useState, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { useRbac } from '@carrier-io/rbac-provider-react';
import Button from '@carrier-io/fds-react/Button';
import CircularProgress from '@carrier-io/fds-react/CircularProgress';
import Menu from '@carrier-io/fds-react/Menu';
import MenuItem from '@carrier-io/fds-react/MenuItem';
import ListItemIcon from '@carrier-io/fds-react/ListItemIcon';
import ListItemText from '@carrier-io/fds-react/ListItemText';
import Divider from '@carrier-io/fds-react/Divider';

import { TableTab } from '../types';

import { CsvIcon, XlsIcon } from '@/components/icons';
import { getAuthTenantId } from '@/features/authentication';
import { useAppSelector } from '@/stores';
import { ExportTaskType } from '@/types';
import { companyActionPayload } from '@/features/authorization';

interface CombinedExportButtonProps {
  loading?: boolean;
  disabled?: boolean;
  onExport: (tab: TableTab, task: ExportTaskType) => void;
}

export const CombinedExportButton = memo((props: CombinedExportButtonProps) => {
  const { disabled, loading, onExport } = props;

  const tenantId = useAppSelector(getAuthTenantId);
  const { t } = useTranslation();
  const { hasPermission } = useRbac();

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleExport = (tab: TableTab, task: ExportTaskType) => {
    handleClose();
    onExport(tab, task);
  };

  const canSeeAssetsList = hasPermission(companyActionPayload('dashboard.assetList', tenantId));
  const canSeeGeofences = hasPermission(companyActionPayload('geofence.list', tenantId));

  return (
    <>
      <Button
        disabled={disabled}
        variant="outlined"
        size="small"
        color="secondary"
        onClick={handleClick}
        endIcon={loading ? <CircularProgress size={13} /> : null}
        data-testid="combined-export-button"
      >
        {loading ? t('common.loading') : t('common.export')}
      </Button>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        MenuListProps={{
          disablePadding: true,
        }}
      >
        {canSeeAssetsList && (
          <MenuItem disabled>
            <ListItemText primary={`${t('assets.export-assets-as')} ...`} />
          </MenuItem>
        )}
        {canSeeAssetsList && (
          <MenuItem onClick={() => handleExport('assets', 'EXCEL')} data-testid="export-assets-xls">
            <ListItemIcon>
              <XlsIcon />
            </ListItemIcon>
            <ListItemText primary="XLS" />
          </MenuItem>
        )}
        {canSeeAssetsList && (
          <MenuItem onClick={() => handleExport('assets', 'CSV')} data-testid="export-assets-csv">
            <ListItemIcon>
              <CsvIcon />
            </ListItemIcon>
            <ListItemText primary="CSV" />
          </MenuItem>
        )}
        {canSeeAssetsList && canSeeGeofences && <Divider />}
        {canSeeGeofences && (
          <MenuItem disabled>
            <ListItemText primary={`${t('geofences.export-geofences-as')} ...`} />
          </MenuItem>
        )}
        {canSeeGeofences && (
          <MenuItem onClick={() => handleExport('geofences', 'EXCEL')} data-testid="export-geofences-xls">
            <ListItemIcon>
              <XlsIcon />
            </ListItemIcon>
            <ListItemText primary="XLS" />
          </MenuItem>
        )}
        {canSeeGeofences && (
          <MenuItem onClick={() => handleExport('geofences', 'CSV')} data-testid="export-geofences-csv">
            <ListItemIcon>
              <CsvIcon />
            </ListItemIcon>
            <ListItemText primary="CSV" />
          </MenuItem>
        )}
      </Menu>
    </>
  );
});

CombinedExportButton.displayName = 'CombinedExportButton';
