import Button from '@carrier-io/fds-react/Button';
import FormControl from '@carrier-io/fds-react/FormControl';
import FormControlLabel from '@carrier-io/fds-react/FormControlLabel';
import FormLabel from '@carrier-io/fds-react/FormLabel';
import Radio from '@carrier-io/fds-react/Radio';
import RadioGroup from '@carrier-io/fds-react/RadioGroup';
import { useTranslation } from 'react-i18next';
import { FormikErrors, useFormik } from 'formik';
import Typography from '@carrier-io/fds-react/Typography';

import { DeleteGeofenceGroupFormData } from '../types';

import { Dialog } from '@/components/Dialog';

interface DeleteGeofenceGroupDialogViewProps {
  onClose?: () => void;
  values: DeleteGeofenceGroupFormData;
  errors: FormikErrors<DeleteGeofenceGroupFormData>;
  handleChange: ReturnType<typeof useFormik>['handleChange'];
  handleSubmit: ReturnType<typeof useFormik>['handleSubmit'];
  isLoading: boolean;
}

export function DeleteGeofenceGroupDialogView({
  onClose,
  values,
  errors,
  handleChange,
  handleSubmit,
  isLoading,
}: DeleteGeofenceGroupDialogViewProps) {
  const { t } = useTranslation();

  return (
    <Dialog
      onClose={onClose}
      open
      maxWidth="sm"
      content={
        <>
          <Typography variant="body1" mb={2}>
            {t('geofences.group.after-delete-group')}:
          </Typography>
          <FormControl>
            <RadioGroup name="mode" value={values.mode} onChange={handleChange} sx={{ pl: 3 }}>
              <FormControlLabel
                value="MOVE_GEOFENCES_TO_UNGROUPED"
                control={<Radio />}
                label={
                  <>
                    {t('geofences.group.move-geofences-to')}
                    <span style={{ fontWeight: 600 }}>{` "${t('geofences.geofence-ungrouped')}"`}</span>
                  </>
                }
              />
              <FormControlLabel
                value="DELETE_GEOFENCES"
                control={<Radio />}
                label={t('geofences.group.delete-geofences')}
              />
            </RadioGroup>
            {errors.mode && <FormLabel error>{errors.mode}</FormLabel>}
          </FormControl>
        </>
      }
      actions={
        <>
          <Button variant="outlined" color="secondary" onClick={onClose} disabled={isLoading}>
            {t('common.cancel')}
          </Button>
          <Button variant="outlined" color="primary" onClick={() => handleSubmit()} disabled={isLoading}>
            {t('common.delete')}
          </Button>
        </>
      }
      dialogTitle={t('geofences.group.delete-group')}
    />
  );
}
