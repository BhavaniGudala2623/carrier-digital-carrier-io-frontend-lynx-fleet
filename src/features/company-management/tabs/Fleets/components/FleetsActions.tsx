import Box from '@carrier-io/fds-react/Box';

import { CreateFleetButton } from './CreateFleet/CreateFleetButton';

import { HasPermission } from '@/features/authorization';
import { useAppSelector } from '@/stores';
import { getAuthTenantId } from '@/features/authentication';

interface FleetsActionsProps {
  onCreateFleet: () => void;
}

export const FleetsActions = ({ onCreateFleet }: FleetsActionsProps) => {
  const tenantId = useAppSelector(getAuthTenantId);

  return (
    <Box display="flex" justifyContent="flex-end" alignItems="center">
      <HasPermission action="fleet.create" subjectId={tenantId} subjectType="COMPANY">
        <CreateFleetButton onCreateFleet={onCreateFleet} />
      </HasPermission>
    </Box>
  );
};

FleetsActions.displayName = 'FleetsActions';
