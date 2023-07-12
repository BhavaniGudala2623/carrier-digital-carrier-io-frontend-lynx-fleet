import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Formik } from 'formik';
import Typography from '@carrier-io/fds-react/Typography';

import { CreateFleetState, FleetParentType } from '../../types';
import { useCreateFleet } from '../../hooks';
import { CreateFleetFormContentContainer } from '../../containers';

import { validateFleetName } from './validation/validateFleetName';

interface Props {
  onClose: () => void;
}

export const CreateFleetForm = ({ onClose }: Props) => {
  const { t } = useTranslation();
  const { handleCreateFleet, isCreateFleetLoading } = useCreateFleet(onClose);

  const handleSubmitNewFleet = async (values: CreateFleetState) => {
    await handleCreateFleet(values);
  };

  const validateFormData = useCallback(
    async ({ name, assetIds, tenantId }) => {
      const errors: Record<string, string> = {};
      if (tenantId) {
        const errorMessage = await validateFleetName(name, tenantId);
        if (errorMessage !== '') {
          errors.name = t(errorMessage);
        }
      }

      if (assetIds.length === 0) {
        errors.assetIds = t('company.management.error.assets_required');
      }

      if (!tenantId) {
        errors.tenantId = t('company.management.fleet-tenant-validation');
      }

      return errors;
    },
    [t]
  );

  const initialValues: CreateFleetState = {
    assetIds: [],
    name: '',
    tenantId: '',
    parentType: FleetParentType.TENANT,
  };

  return (
    <>
      <Typography variant="subtitle2" mt={1.25} mb={1.5}>
        {t('company.management.add-assets-to-fleet')}
      </Typography>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmitNewFleet}
        validate={validateFormData}
        enableReinitialize
        validateOnChange
        validateOnSubmit
      >
        <CreateFleetFormContentContainer onClose={onClose} loading={isCreateFleetLoading} />
      </Formik>
    </>
  );
};
