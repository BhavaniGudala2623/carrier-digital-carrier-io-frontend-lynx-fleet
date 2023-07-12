import { Field, FieldProps, Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import Box from '@carrier-io/fds-react/Box';
import Button from '@carrier-io/fds-react/Button';
import TextField from '@carrier-io/fds-react/TextField';

import { useRenameAsset } from '../../../hooks/useRenameAsset';

import { validationSchemaRenameAsset } from './validationSchemaRenameAsset';
import { validateAssetName } from './validateAssetName';

interface RenameAssetFormProps {
  onSubmit: () => void;
  id: string;
  name: string;
}

type Values = {
  name: string;
};

export const RenameAssetForm = ({ onSubmit, id, name }: RenameAssetFormProps) => {
  const { t } = useTranslation();

  const { renameAsset } = useRenameAsset();

  const handleSubmit = (values: Values) => {
    renameAsset({ id, ...values });
    onSubmit();
  };

  const initialValues: Values = { name };

  const validateNameField = (newName: string) => validateAssetName(newName, initialValues.name, id);

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      enableReinitialize
      validationSchema={validationSchemaRenameAsset}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit: handleSubmitFormik,
        isSubmitting,
      }) => (
        <form onSubmit={handleSubmitFormik} style={{ height: '100%' }}>
          <Box display="flex" flexDirection="column" justifyContent="space-between" height="100%" pl={2}>
            <Field
              name="name"
              validate={validateNameField}
              onChange={handleChange}
              value={values.name}
              onBlur={handleBlur}
            >
              {(props: FieldProps) => {
                const { field } = props;

                return (
                  <TextField
                    sx={{
                      mb: 2,
                      pr: 2,
                    }}
                    id="name"
                    label={t('assets.management.asset-name')}
                    name={field.name}
                    placeholder={t('assets.management.asset-name')}
                    size="small"
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    value={field.value}
                    error={touched.name && Boolean(errors.name)}
                    helperText={touched.name && errors.name && t(errors.name)}
                    fullWidth
                  />
                );
              }}
            </Field>
            <Box display="flex" justifyContent="right">
              <Button
                sx={{ mt: 1, ml: 1 }}
                variant="outlined"
                color="secondary"
                size="medium"
                onClick={onSubmit}
              >
                {t('common.cancel')}
              </Button>
              <Button
                sx={{ mt: 1, ml: 1 }}
                type="submit"
                variant="outlined"
                color="primary"
                size="medium"
                disabled={isSubmitting}
              >
                {t('common.save')}
              </Button>
            </Box>
          </Box>
        </form>
      )}
    </Formik>
  );
};

RenameAssetForm.displayName = 'RenameAssetForm';
