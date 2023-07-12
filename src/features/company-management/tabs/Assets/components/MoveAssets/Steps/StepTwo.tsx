import { useFormikContext } from 'formik';
import Box from '@carrier-io/fds-react/Box';
import { useTranslation } from 'react-i18next';
import Typography from '@carrier-io/fds-react/Typography';

import { MoveAssetsState } from '../../../types';
import { CompanySelectFlat } from '../CompanySelectFlat';

import { OptionItemDescription } from '@/types';

export const StepTwo = () => {
  const { setFieldValue, values, errors } = useFormikContext<MoveAssetsState>();
  const { t } = useTranslation();

  const handleChange = (value: OptionItemDescription) => {
    setFieldValue('targetTenant', value);
  };

  return (
    <Box minHeight={300} maxWidth={350}>
      <Typography>
        {t('company.management.assets.move-assets.selected', { count: values.assetIds.length })}
      </Typography>
      {values.sourceTenant?.id && (
        <CompanySelectFlat
          tenantId={values.sourceTenant.id}
          onChange={handleChange}
          value={values.targetTenant}
        />
      )}
      {errors.targetTenant && (
        <Typography variant="caption" color="error">
          {errors.targetTenant}
        </Typography>
      )}
    </Box>
  );
};
