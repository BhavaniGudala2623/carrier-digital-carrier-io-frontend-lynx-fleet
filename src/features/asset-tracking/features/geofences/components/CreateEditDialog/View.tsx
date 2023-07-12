import AddIcon from '@mui/icons-material/Add';
import { FormikErrors, useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useRbac } from '@carrier-io/rbac-provider-react';
import Button from '@carrier-io/fds-react/Button';
import FormControl from '@carrier-io/fds-react/FormControl';
import MenuItem from '@carrier-io/fds-react/MenuItem';
import Select from '@carrier-io/fds-react/Select';
import TextField from '@carrier-io/fds-react/TextField';
import Typography from '@carrier-io/fds-react/Typography';
import { styled } from '@mui/material/styles';
import InputLabel from '@carrier-io/fds-react/InputLabel';
import FormHelperText from '@carrier-io/fds-react/FormHelperText';
import Input from '@carrier-io/fds-react/Input';
import { GeofenceGroupColor } from '@carrier-io/lynx-fleet-types';

import { CreateGeofenceFormData } from '../types';
import { getHexColor } from '../../../../utils';

import { useAppSelector } from '@/stores';
import { Dialog } from '@/components/Dialog';
import { getAuthTenantId } from '@/features/authentication';
import { DialogMode, SelectChangeEvent } from '@/types';
import { companyActionPayload } from '@/features/authorization';

interface CreateGeofenceDialogViewProps {
  onClose?: () => void;
  values: CreateGeofenceFormData;
  errors: FormikErrors<CreateGeofenceFormData>;
  handleChange: ReturnType<typeof useFormik>['handleChange'];
  handleSubmit: ReturnType<typeof useFormik>['handleSubmit'];
  handleCreateGroupClick: () => void;
  open: boolean;
  isLoading: boolean;
  groups: { id: string; name: string; color: GeofenceGroupColor }[];
  mode: DialogMode;
}

const CircleColorSpan = styled('span')({
  display: 'inline-block',
  width: '1rem',
  height: '1rem',
  borderRadius: '50%',
  verticalAlign: 'middle',
  marginRight: '0.5rem',
});

export function View({
  onClose,
  values,
  errors,
  handleChange,
  handleSubmit,
  handleCreateGroupClick,
  open,
  groups,
  isLoading,
  mode,
}: CreateGeofenceDialogViewProps) {
  const { t } = useTranslation();

  const tenantId = useAppSelector(getAuthTenantId);

  const { hasPermission } = useRbac();
  const shouldShowCreateGroup = hasPermission(companyActionPayload('dashboard.assetList', tenantId));

  const dialogTitle = mode === 'CREATE' ? t('geofences.create-geofence') : t('geofences.edit-geofence');
  const dialogSubTitle = mode === 'CREATE' ? t('geofences.create-geofence-subtitle') : '';

  const handleGeofenceGroupChange = (event: SelectChangeEvent<unknown>) => {
    if (event.target.value === 'nothing-to-change') {
      return;
    }
    handleChange(event);
  };

  return (
    <Dialog
      onClose={onClose}
      open={open}
      dialogTitle={dialogTitle}
      content={
        <>
          {dialogSubTitle && (
            <Typography variant="body1" mb={2}>
              {dialogSubTitle}
            </Typography>
          )}

          <TextField
            id="name"
            name="name"
            sx={{ mb: 3 }}
            label={t('geofences.name')}
            aria-label={t('geofences.name')}
            type="text"
            fullWidth
            onChange={handleChange}
            value={values.name}
            error={Boolean(errors.name)}
            helperText={errors.name ?? t('geofences.geofence-name-hint')}
            required
            size="small"
          />

          <FormControl sx={{ mb: 3 }} variant="filled" fullWidth>
            <InputLabel>{t('geofences.geofence-group')}</InputLabel>
            <Select
              id="groupId"
              name="groupId"
              input={<Input />}
              value={values.groupId}
              onChange={handleGeofenceGroupChange}
              size="small"
              renderValue={(value: unknown) => {
                if (!value) {
                  return null;
                }

                const group = groups.find((g) => g.id === value);

                return (
                  <>
                    <CircleColorSpan sx={{ bgcolor: group?.color && getHexColor(group.color) }} />
                    {group?.name}
                  </>
                );
              }}
            >
              {shouldShowCreateGroup && groups.length < 8 && (
                <MenuItem value="nothing-to-change" onClick={handleCreateGroupClick}>
                  <AddIcon sx={{ mr: 1 }} color="primary" />
                  <Typography color="primary" variant="body1">
                    {t('geofences.create-group')}
                  </Typography>
                </MenuItem>
              )}
              {groups.map((group) => (
                <MenuItem key={group.id} value={group.id}>
                  <CircleColorSpan sx={{ bgcolor: group?.color && getHexColor(group.color) }} />
                  {group.name}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText sx={{ ml: 0.5 }}>{t('geofences.geofence-group-hint')}</FormHelperText>
          </FormControl>

          <TextField
            id="description"
            name="description"
            sx={{ mb: 1 }}
            label={t('geofences.description')}
            aria-label={t('geofences.description')}
            fullWidth
            onChange={handleChange}
            value={values.description}
            error={Boolean(errors.description)}
            helperText={errors.description}
            required
            size="small"
          />
        </>
      }
      actions={
        <>
          <Button variant="outlined" color="secondary" onClick={onClose}>
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
