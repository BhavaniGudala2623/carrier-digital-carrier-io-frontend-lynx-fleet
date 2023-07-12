import { FleetService } from '@carrier-io/lynx-fleet-data-lib';
import { debounce } from 'lodash-es';

const checkFleetName = async (name: string, tenantId: string) => {
  const {
    data: {
      checkFleetNameUnique: { result, error },
    },
  } = await FleetService.checkFleetNameUnique({ name, tenantId });

  return { result, error };
};

export const checkFleetNameUniqueDebounced = debounce(checkFleetName, 500);
