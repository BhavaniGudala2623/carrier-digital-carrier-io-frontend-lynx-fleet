import { FleetsActions } from '../components/FleetsActions';
import { CreateFleetDialog } from '../components/CreateFleet/CreateFleetDialog';

import { useToggle } from '@/hooks';

export const FleetsActionsContainer = () => {
  const {
    value: isCreateFleetDialogOpen,
    toggleOn: handleOpenCreateFleetDialog,
    toggleOff: handleCloseCreateFleetDialog,
  } = useToggle(false);

  return (
    <>
      <FleetsActions onCreateFleet={handleOpenCreateFleetDialog} />
      {isCreateFleetDialogOpen && <CreateFleetDialog onClose={handleCloseCreateFleetDialog} />}
    </>
  );
};
