import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';
import { Formik } from 'formik';
import Typography from '@carrier-io/fds-react/Typography';
import { Fleet, AssetRow } from '@carrier-io/lynx-fleet-types';

import { useEditFleet } from '../../hooks';
import {
  EditFleetFormContentContainer,
  EditFleetFormValues,
} from '../../containers/EditFleetFormContentContainer';

interface EditFleetFormProps {
  fleet: Pick<Fleet, 'id' | 'name'> & { tenantId?: string };
  assets?: AssetRow[];
  selectedAssetIds: string[];
  onClose: () => void;
}

export const EditFleetForm = ({
  onClose,
  fleet: { name, id, tenantId },
  assets,
  selectedAssetIds,
}: EditFleetFormProps) => {
  const { t } = useTranslation();

  const { handleEditFleet, isEditFleetLoading } = useEditFleet(onClose);

  const onFleetEdit = async ({ assetIds, name: fleetName }: EditFleetFormValues) => {
    if (id) {
      await handleEditFleet({ id, name: fleetName, assetIds });
    }
  };

  const validateFormData = useCallback(
    ({ assetIds }) => {
      const errors: Record<string, string> = {};
      if (assetIds.length === 0) {
        errors.assetIds = t('company.management.error.assets_required');
      }

      return errors;
    },
    [t]
  );

  return (
    <>
      <Typography variant="subtitle2" mt={1.25} mb={1.5}>
        {t('company.management.add-assets-to-fleet')}
      </Typography>
      <Formik
        initialValues={{
          name,
          assetIds: selectedAssetIds,
          tenantId: tenantId ?? '',
        }}
        onSubmit={onFleetEdit}
        validate={validateFormData}
        validateOnChange
        validateOnSubmit
      >
        <EditFleetFormContentContainer loading={isEditFleetLoading} onClose={onClose} assets={assets} />
      </Formik>
    </>
  );
};

EditFleetForm.displayName = 'EditFleetForm';
