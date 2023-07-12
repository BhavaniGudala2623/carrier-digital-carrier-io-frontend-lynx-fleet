import Button from '@carrier-io/fds-react/Button';
import FormControl from '@carrier-io/fds-react/FormControl';
import TextField from '@carrier-io/fds-react/TextField';
import Typography from '@carrier-io/fds-react/Typography';
import { FormikErrors, useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useRbac } from '@carrier-io/rbac-provider-react';
import Box from '@carrier-io/fds-react/Box';

import { GeofenceGroupFormData } from '../types';
import { RadioColor } from '../RadioColor';
import { PALETTE_COLORS_MAP } from '../../../../utils';

import { useAppSelector } from '@/stores';
import { Dialog } from '@/components/Dialog';
import { getAuthTenantId } from '@/features/authentication';
import { DialogMode } from '@/types';
import { companyActionPayload } from '@/features/authorization';

interface CreateGeofenceGroupDialogViewProps {
  onClose?: () => void;
  values: GeofenceGroupFormData;
  errors: FormikErrors<GeofenceGroupFormData>;
  handleChange: ReturnType<typeof useFormik>['handleChange'];
  handleSubmit: ReturnType<typeof useFormik>['handleSubmit'];
  handleDelete?: () => void;
  open: boolean;
  isLoading: boolean;
  usedGroupColors: string[];
  currentColor?: string;
  mode: DialogMode;
}

export function View({
  onClose,
  values,
  errors,
  handleChange,
  handleSubmit,
  open,
  isLoading,
  usedGroupColors,
  handleDelete,
  currentColor,
  mode,
}: CreateGeofenceGroupDialogViewProps) {
  const { t } = useTranslation();

  const tenantId = useAppSelector(getAuthTenantId);

  const { hasPermission } = useRbac();
  const shouldShowGroupDelete = hasPermission(companyActionPayload('geofence.groupDelete', tenantId));

  const dialogTitle = mode === 'CREATE' ? t('geofences.group.create-group') : t('geofences.group.edit-group');
  const dialogSubTitle =
    mode === 'CREATE'
      ? t('geofences.group.create-group.description')
      : t('geofences.group.edit-group.description');

  const colorPalette = Object.entries(PALETTE_COLORS_MAP).map(([colorHex, name]) => (
    <RadioColor
      key={name}
      color={colorHex}
      handleChange={handleChange}
      checked={name === values.color}
      used={usedGroupColors.includes(name) && name !== currentColor}
      name={name}
    />
  ));

  return (
    <Dialog
      onClose={onClose}
      open={open}
      maxWidth="sm"
      dialogTitle={dialogTitle}
      content={
        <>
          <Typography variant="body1" mb={2}>
            {dialogSubTitle}
          </Typography>
          <TextField
            id="name"
            label={t('geofences.group.name')}
            aria-label={t('geofences.group.name')}
            type="text"
            fullWidth
            onChange={handleChange}
            value={values.name}
            error={Boolean(errors.name)}
            helperText={errors.name ?? t('geofences.geofence-group-name-hint')}
            sx={{ mb: 5 }}
            required
            size="small"
          />
          <FormControl>
            <Box aria-label={t('geofences.group.color')} display="flex">
              {colorPalette}
            </Box>
          </FormControl>
        </>
      }
      actions={
        <>
          {shouldShowGroupDelete && handleDelete && (
            <Button sx={{ marginRight: 'auto' }} variant="text" onClick={handleDelete} disabled={isLoading}>
              {t('common.delete')}
            </Button>
          )}
          <Button variant="outlined" color="secondary" onClick={onClose} disabled={isLoading}>
            {t('common.cancel')}
          </Button>
          <Button variant="outlined" color="primary" onClick={() => handleSubmit()} disabled={isLoading}>
            {t('common.save')}
          </Button>
        </>
      }
    />
  );
}
