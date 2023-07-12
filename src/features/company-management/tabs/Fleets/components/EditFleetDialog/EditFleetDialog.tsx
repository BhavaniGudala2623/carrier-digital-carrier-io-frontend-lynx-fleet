import Box from '@carrier-io/fds-react/Box';
import { useTranslation } from 'react-i18next';
import { Fleet, AssetRow } from '@carrier-io/lynx-fleet-types';

import { EditFleetForm } from './EditFleetForm';

import { Loader, Dialog } from '@/components';
import { useAppDispatch } from '@/stores';
import { showError } from '@/stores/actions';

interface EditFleetDialogProps {
  fleet: Pick<Fleet, 'id' | 'name'> & { tenantId?: string };
  assets?: AssetRow[];
  onClose: () => void;
  isFleetLoading: boolean;
  isAssetsLoading: boolean;
  error?: string;
  selectedAssetIds: string[];
}

export const EditFleetDialog = ({
  fleet,
  assets,
  onClose,
  isFleetLoading,
  isAssetsLoading,
  error,
  selectedAssetIds,
}: EditFleetDialogProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const getContent = () => {
    if (isFleetLoading || isAssetsLoading) {
      return <Loader overlay />;
    }

    if (error || !fleet || !fleet?.tenantId) {
      showError(dispatch, t('company.management.error-loading-fleet'));

      return <div>{error}</div>;
    }

    return (
      <EditFleetForm onClose={onClose} fleet={fleet} assets={assets} selectedAssetIds={selectedAssetIds} />
    );
  };

  return (
    <Dialog
      maxWidth="md"
      onClose={onClose}
      dialogTitle={`${t('company.management.edit-a-fleet')}`}
      content={<Box minHeight={500}>{getContent()}</Box>}
      fullWidth
      dividers
      open
    />
  );
};
