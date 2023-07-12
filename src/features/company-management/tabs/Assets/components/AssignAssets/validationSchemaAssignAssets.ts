import * as yup from 'yup';

export const getValidationSchema = (t) =>
  yup.object().shape({
    // yup.array() do not consume i18n values, need to use t function from useTranslation hook
    assetIds: yup.array().ensure().min(1, t('company.management.error.assets_required')),
    tenantId: yup.string().required('company.management.error.tenant_required'),
  });
