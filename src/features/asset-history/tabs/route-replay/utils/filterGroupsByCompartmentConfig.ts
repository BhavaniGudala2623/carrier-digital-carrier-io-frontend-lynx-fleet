import { CompartmentConfig, Maybe } from '@carrier-io/lynx-fleet-types';

import { IColumnGroup } from '@/types';

export const filterGroupsByCompartmentConfig = (
  columnData: IColumnGroup[],
  compartmentConfig: Maybe<CompartmentConfig> | undefined
): IColumnGroup[] =>
  columnData.filter((data) => {
    const compartmentNumber = data.groupId?.slice(1);

    if (compartmentNumber) {
      const configKey = `comp${compartmentNumber}Configured`;

      return compartmentConfig?.[configKey as keyof typeof compartmentConfig] ?? false;
    }

    return true;
  });
