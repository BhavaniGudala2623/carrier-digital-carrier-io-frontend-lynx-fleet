import Typography from '@carrier-io/fds-react/Typography';
import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';

import { SelectAssets } from '../../SelectAssets';
import { MoveAssetsState } from '../../../types';

import { UserAccessibleTenantsSelect } from '@/features/common';

export const StepOne = () => {
  const { setFieldValue, values } = useFormikContext<MoveAssetsState>();
  const { t } = useTranslation();

  return (
    <>
      <Typography pb={1} variant="subtitle1">
        {t('company.management.assets.move-assets.select-to-be-moved')}
      </Typography>
      <UserAccessibleTenantsSelect
        sx={{ maxWidth: 480, mb: 2 }}
        onChange={(value) => {
          setFieldValue('sourceTenant', value);
        }}
        value={values.sourceTenant}
      />
      <SelectAssets
        tenantId={values.sourceTenant?.id ?? ''}
        defsConfigs={['name', 'licensePlateNumber', 'fleetName', 'lastModified']}
        onSelectedAssetsChange={(assets) => {
          setFieldValue(
            'assetIds',
            assets.map(({ id }) => id)
          );
        }}
      />
    </>
  );
};
