import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CircularProgress from '@carrier-io/fds-react/CircularProgress';
import Menu from '@carrier-io/fds-react/Menu';
import MenuItem from '@carrier-io/fds-react/MenuItem';
import Button from '@carrier-io/fds-react/Button';
import ListItemText from '@carrier-io/fds-react/ListItemText';
import ListItemIcon from '@carrier-io/fds-react/ListItemIcon';
import { SxProps } from '@mui/material';

import { CsvIcon, XlsIcon } from '../icons';

import { Maybe } from '@/types';

interface ExportButtonProps {
  disabled?: boolean;
  loading?: boolean;
  onExportCsv?: () => void;
  onExportExcel?: () => void;
  sx?: SxProps;
}

export const ExportButton = ({
  disabled = false,
  loading = false,
  onExportCsv,
  onExportExcel,
  sx = {},
}: ExportButtonProps) => {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<Maybe<HTMLElement>>(null);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleExportCsv = () => {
    handleClose();
    onExportCsv?.();
  };

  const handleExportExcel = () => {
    handleClose();
    onExportExcel?.();
  };

  return (
    <>
      <Button
        disabled={disabled}
        variant="outlined"
        color="secondary"
        onClick={(event) => {
          setAnchorEl(event.currentTarget);
        }}
        endIcon={loading ? <CircularProgress size={13} /> : null}
        sx={sx}
        data-testid="common-export-button"
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
        variant="menu"
      >
        <MenuItem disabled>
          <ListItemText primary={`${t('common.components.export-table-as')} ...`} />
        </MenuItem>

        {onExportExcel && (
          <MenuItem onClick={() => handleExportExcel()} data-testid="export-xls">
            <ListItemIcon>
              <XlsIcon />
            </ListItemIcon>
            <ListItemText primary="XLS" />
          </MenuItem>
        )}

        {onExportCsv && (
          <MenuItem onClick={() => handleExportCsv()} data-testid="export-csv">
            <ListItemIcon>
              <CsvIcon />
            </ListItemIcon>
            <ListItemText primary="CSV" />
          </MenuItem>
        )}
      </Menu>
    </>
  );
};

ExportButton.displayName = 'ExportButton';
