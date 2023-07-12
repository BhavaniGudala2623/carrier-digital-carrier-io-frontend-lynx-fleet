import { CompanyService } from '@carrier-io/lynx-fleet-data-lib';

const checkAssetNameAvailability = async (name: string): Promise<boolean> => {
  try {
    const {
      data: {
        isAssetNameAvailable: { isAvailable },
      },
    } = await CompanyService.isAssetNameAvailable({ name });

    return isAvailable;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  }

  return false;
};

export const validateAssetName = async (name: string): Promise<string | null> => {
  try {
    const response = await checkAssetNameAvailability(name);

    return !response ? 'assets.management.validation.error.asset-globally-unique' : null;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  }

  return null;
};
