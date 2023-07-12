import { FormikHelpers } from 'formik';

import { MoveAssetsState } from '../types';
import { MoveAssetsForm } from '../components';
import { useMoveAssets } from '../hooks';

interface MoveAssetsFormContainerProps {
  onClose: () => void;
  setStep: (step: number) => void;
  activeStep: number;
}

export const MoveAssetsFormContainer = ({ onClose, setStep, activeStep }: MoveAssetsFormContainerProps) => {
  const { moveAssets, loading } = useMoveAssets();

  const handleSubmit = (values: MoveAssetsState, { setSubmitting }: FormikHelpers<MoveAssetsState>) => {
    const { assetIds, targetTenant } = values;
    setSubmitting(true);
    if (targetTenant?.id) {
      moveAssets({
        variables: {
          input: {
            assetIds,
            targetTenantId: targetTenant.id,
          },
        },
      })
        .then(async (result) => {
          const hasErrors = result.errors?.length && result.errors?.length > 0;
          if (!hasErrors) {
            onClose();
          }
        })
        .finally(() => {
          setSubmitting(false);
        });
    }
  };

  return (
    <MoveAssetsForm
      setActiveStep={setStep}
      onSubmit={handleSubmit}
      onClose={onClose}
      loading={loading}
      activeStep={activeStep}
    />
  );
};
