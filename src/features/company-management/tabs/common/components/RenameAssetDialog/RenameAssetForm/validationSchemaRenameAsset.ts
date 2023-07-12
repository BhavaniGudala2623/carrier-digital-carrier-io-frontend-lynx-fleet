import * as yup from 'yup';

export const validationSchemaRenameAsset = yup.object().shape({
  name: yup.string().min(1).max(50).required('common.required'),
});
