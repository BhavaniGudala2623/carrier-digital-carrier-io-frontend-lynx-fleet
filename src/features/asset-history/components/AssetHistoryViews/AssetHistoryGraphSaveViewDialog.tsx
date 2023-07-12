import { useTranslation } from 'react-i18next';
import Box from '@carrier-io/fds-react/Box';
import Button from '@carrier-io/fds-react/Button';
import InputLabel from '@carrier-io/fds-react/InputLabel';
import Checkbox from '@carrier-io/fds-react/Checkbox';
import TextField from '@carrier-io/fds-react/TextField';
import { AssetView, HistoryFrequency, Maybe, QuickDate } from '@carrier-io/lynx-fleet-types';
import { useFormik } from 'formik';
import FormControlLabel from '@carrier-io/fds-react/FormControlLabel';

import { saveAssetViewAction } from '../../stores';

import { Dialog } from '@/components/Dialog';
import { useAppDispatch } from '@/stores';
import { textFieldStyle } from '@/constants';

interface IAssetHistoryGraphSaveViewDialogProps {
  open: boolean;
  onClose: () => void;
  email?: string;
  quickDate: Maybe<QuickDate>;
  frequency: Maybe<HistoryFrequency>;
  legendSettings?: string[];
  views?: AssetView[];
  setSelectedView: (view: Maybe<string | number>) => void;
}

export function AssetHistoryGraphSaveViewDialog(props: IAssetHistoryGraphSaveViewDialogProps) {
  const { open, onClose, quickDate, frequency, legendSettings, email = '', setSelectedView, views } = props;

  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const { values, errors, touched, handleChange, handleBlur, handleSubmit, isValid } = useFormik<{
    name: string;
    isDefault: boolean;
  }>({
    onSubmit: (submitValues) => {
      dispatch(
        saveAssetViewAction(
          {
            name: submitValues.name,
            isDefault: submitValues.isDefault,
            email,
            quickDate,
            frequency,
            legendSettings: JSON.stringify(legendSettings),
          },
          setSelectedView,
          t('assethistory.save-current-view-confirmation')
        )
      );
      onClose();
    },
    initialValues: {
      name: '',
      isDefault: false,
    },
    validate: (validationValues) => {
      const validationErrors = {} as Record<string, string>;

      if (!validationValues.name) {
        validationErrors.name = t('assethistory.views.required-field-error');
      }

      if (views) {
        views.forEach((view) => {
          if (validationValues.name.toLowerCase() === view.name.toLowerCase()) {
            validationErrors.name = t('assethistory.views.duplicate-name-error');
          }
        });
      }

      return validationErrors;
    },
    validateOnMount: true,
  });

  return (
    <Dialog
      maxWidth="sm"
      open={open}
      dialogTitle={`${t('assethistory.save-view-title')}`}
      onClose={onClose}
      contentSx={{ minWidth: '600px' }}
      actionsSx={{ px: 3, pt: 0, pb: 2 }}
      content={
        <>
          <InputLabel sx={{ mb: 1 }}>{t('assethistory.save-view-description')}</InputLabel>
          <TextField
            id="name"
            name="name"
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.name && Boolean(errors.name)}
            helperText={touched.name && errors.name}
            placeholder={t('assethistory.save-view-name')}
            size="small"
            fullWidth
            sx={textFieldStyle}
          />
          <Box display="flex" alignItems="center">
            <FormControlLabel
              control={
                <Checkbox
                  id="isDefault"
                  sx={{ ml: 1 }}
                  size="small"
                  color="primary"
                  checked={values.isDefault}
                  onChange={handleChange}
                />
              }
              label={t('assethistory.set-as-default')}
            />
          </Box>
        </>
      }
      actions={
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
          <Button color="secondary" variant="outlined" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button
            color="primary"
            variant="outlined"
            sx={{
              ml: 1,
            }}
            disabled={!isValid}
            onClick={() => handleSubmit()}
          >
            {t('common.save')}
          </Button>
        </Box>
      }
    />
  );
}
