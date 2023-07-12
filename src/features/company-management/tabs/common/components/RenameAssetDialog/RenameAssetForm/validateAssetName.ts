import { CompanyService } from '@carrier-io/lynx-fleet-data-lib';
import { debounce } from 'lodash-es';

const checkAssetNameAvailability = async (name: string, assetId: string): Promise<boolean> => {
  try {
    const {
      data: {
        isAssetNameAvailable: { isAvailable },
      },
    } = await CompanyService.isAssetNameAvailable({ name, assetId });

    return isAvailable;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  }

  return false;
};

const checkAssetNameAvailabilityDebounced = debounce(checkAssetNameAvailability, 500);

export const validateAssetName = async (
  newName: string,
  initialName: string,
  assetId: string
): Promise<string> => {
  let validateMessage: string = '';

  if (newName && newName !== initialName) {
    try {
      const response = await checkAssetNameAvailabilityDebounced(newName, assetId);

      validateMessage = response === false ? 'assets.management.validation.error.asset-unique' : '';
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  }

  return validateMessage;
};
